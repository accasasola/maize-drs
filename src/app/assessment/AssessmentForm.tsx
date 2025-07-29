'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AssessmentForm() {
  const router = useRouter();

  const [dap, setDap] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [cropStage, setCropStage] = useState('');
  const [leafFeeding, setLeafFeeding] = useState('');
  const [shotHoles, setShotHoles] = useState('');
  const [lesions, setLesions] = useState('');
  const [larvaeCount, setLarvaeCount] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("\ud83d\udce4 Form submitted");

    const token = localStorage.getItem("token");
    console.log("\ud83d\udeab Token:", token);

    const dapValue = parseInt(dap);
    const larvae = parseInt(larvaeCount);

    if (!image || !dap) {
      console.warn("\u274c Missing image or DAP");
      alert('Please fill in all required fields.');
      return;
    }

    console.log("\u2714\ufe0f Passed image and DAP check");

    if (leafFeeding === 'no' && shotHoles === 'none') {
      if (dapValue < 28) {
        router.push('/result?prediction=not damaged');
        return;
      } else {
        router.push('/result?score=1&description=No visible leaf-feeding damage or shot holes');
        return;
      }
    }

    if (dapValue < 28) {
      if (leafFeeding === 'no') {
        router.push('/result?prediction=not damaged');
        return;
      }

      if (leafFeeding === 'yes' || larvae > 0) {
        const formData = new FormData();
        formData.append("file", image);

        try {
          const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();
          if (!result.prediction) throw new Error("No prediction received");

          router.push(`/result?prediction=${result.prediction}&confidence=${result.confidence}`);
        } catch (error) {
          console.error("Prediction error:", error);
          alert("Failed to analyze image.");
        }
        return;
      }
    }

    if (dapValue >= 28) {
      if (leafFeeding === 'no') {
        router.push('/result?score=1&description=No visible leaf-feeding damage');
        return;
      }

      let score = 1;

      if (shotHoles === '1-2' || shotHoles === '3-5') score = 2;
      else if (shotHoles === '6-8') score = 4;
      else if (shotHoles === 'more than 8') score = 5;

      if (lesions === 'several') score = Math.max(score, 6);
      else if (lesions === 'too many') score = Math.max(score, 7);

      const calculatedScore = score;
      const description = `Leaf-feeding observed. Shot holes: ${shotHoles}. Lesions: ${lesions}.`;

      try {
        const response = await fetch("http://localhost:5268/api/assessment/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageName: image?.name ?? '',
            base64Image: base64Image ?? '',
            cropStage,
            leafFeeding,
            shotHoles,
            lesions,
            larvaeCount: larvae,
            score: calculatedScore,
            description
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          console.error("Save failed:", err);
          alert("Failed to save assessment.");
        } else {
          console.log("\u2705 Assessment saved.");
        }
      } catch (error) {
        console.error("Error saving assessment:", error);
        alert("Error occurred while saving.");
      }

      router.push(
        `/result?score=${calculatedScore}&description=${encodeURIComponent(description)}&imageName=${image?.name ?? ''}&img=${base64Image ?? ''}&cropStage=${cropStage}&leafFeeding=${leafFeeding}&shotHoles=${shotHoles}&lesions=${lesions}&larvaeCount=${larvaeCount}`
      );
    }
  };

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/corn.jpg')` }}
    >
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => {
            console.log('Back button clicked');
            router.push('/');
          }}
          className="bg-white text-green-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </div>

      {/* Form content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white bg-opacity-95 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
            🌽 Start New Assessment
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
            <div>
              <label className="block text-sm font-medium mb-1">Days After Planting (DAP)</label>
              <input
                type="number"
                value={dap}
                onChange={(e) => setDap(e.target.value)}
                min={1}
                required
                className="w-full p-2 border border-gray-700 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Maize Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full text-sm file:bg-green-600 file:text-white file:px-4 file:py-2 file:rounded-md file:border-none"
              />
            </div>

            <div className="border-t pt-4">
              <h2 className="font-semibold mb-2">Observed Symptoms</h2>

              <div>
                <label className="block text-sm mb-1">1. Is there visible leaf-feeding damage?</label>
                <select
                  value={leafFeeding}
                  onChange={(e) => setLeafFeeding(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-700 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">2. How many leaves have visible shot holes?</label>
                <select
                  value={shotHoles}
                  onChange={(e) => setShotHoles(e.target.value)}
                  className="w-full p-2 border border-gray-700 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="none">None</option>
                  <option value="1-2">1–2</option>
                  <option value="3-5">3–5</option>
                  <option value="6-8">6–8</option>
                  <option value="more than 8">More than 8</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">3. How many elongated lesions are visible?</label>
                <select
                  value={lesions}
                  onChange={(e) => setLesions(e.target.value)}
                  className="w-full p-2 border border-gray-700 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="none">None</option>
                  <option value="few">Few</option>
                  <option value="several">Several</option>
                  <option value="too many">Too many</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">4. How many visible larvae are there?</label>
                <input
                  type="number"
                  min={0}
                  value={larvaeCount}
                  onChange={(e) => setLarvaeCount(e.target.value)}
                  className="w-full p-2 border border-gray-700 rounded-md"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Submit Assessment
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
