from flask_cors import CORS
from flask import Flask, request, jsonify
import joblib
import cv2
import numpy as np
import tempfile
import os

app = Flask(__name__)
CORS(app) 
model = joblib.load("maize_model.pkl")

def extract_features(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None
    img = cv2.resize(img, (128, 128))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hist = cv2.calcHist([gray], [0], None, [64], [0, 256])
    hist = cv2.normalize(hist, hist).flatten()
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges) / (128 * 128)
    features = np.append(hist, edge_density)
    return features

@app.route('/predict', methods=['POST'])
def predict():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    temp_path = tempfile.mktemp(suffix='.jpg')
    file.save(temp_path)

    features = extract_features(temp_path)
    os.remove(temp_path)

    if features is None:
        return jsonify({'error': 'Invalid image'}), 400
    proba = model.predict_proba([features])[0]
    confidence = max(proba)  # get the highest probability
    
    
    prediction = model.predict([features])[0]
    return jsonify({
        "prediction": str(prediction),
        "confidence": round(float(confidence) *100,2)
        })
@app.route('/sync', methods=['POST'])
def sync_data():
    try:
        data = request.get_json()
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Invalid data format'}), 400

        # For now, just print or log the synced records (you can later save to a file or database)
        print(f"Received {len(data)} assessment(s)")
        for record in data:
            print(record)

        return jsonify({'message': 'Data synced successfully!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
