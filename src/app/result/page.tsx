'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const description = searchParams.get("description");
  const prediction = searchParams.get("prediction");
  const confidence = searchParams.get("confidence");

  const imageName = searchParams.get("imageName");
  const img = searchParams.get("img");
  const cropStage = searchParams.get("cropStage");
  const leafFeeding = searchParams.get("leafFeeding");
  const shotHoles = searchParams.get("shotHoles");
  const lesions = searchParams.get("lesions");
  const larvaeCount = searchParams.get("larvaeCount");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const record = {
      timestamp: new Date().toISOString(),
      score,
      description,
      prediction,
      imageName,
      img,
      cropStage,
      leafFeeding,
      shotHoles,
      lesions,
      larvaeCount,
    };

    const existing = localStorage.getItem("maizeRecords");
    const data = existing ? JSON.parse(existing) : [];
    data.push(record);
    localStorage.setItem("maizeRecords", JSON.stringify(data));
    setSaved(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Assessment Result</h1>

        {prediction ? (
          <div>
            <h2 className="text-xl font-semibold">Predicted Classification:</h2>
            <p className="text-2xl mt-2 text-green-600">
              {prediction} {confidence && `(${confidence}% confidence)`}
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-green-700">Damage Score:</h2>
            <p className="text-3xl mt-2 text-green-700">{score}</p>
            <p className="mt-4 text-gray-700">{description}</p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={handleSave}
            className={`w-full py-2 px-4 rounded font-semibold transition ${
              saved ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            disabled={saved}
          >
            {saved ? 'Assessment Saved' : 'Save Assessment'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-2 px-4 rounded border border-green-600 text-green-700 hover:bg-green-100 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
