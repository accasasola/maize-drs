import os
import cv2
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

def extract_features(image_path):
    # Read image
    img = cv2.imread(image_path)
    if img is None:
        return None

    # Resize and convert to grayscale
    img = cv2.resize(img, (128, 128))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Compute histogram
    hist = cv2.calcHist([gray], [0], None, [64], [0, 256])
    hist = cv2.normalize(hist, hist).flatten()

    # Edge detection (Canny)
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges) / (128 * 128)

    # Combine features
    features = np.append(hist, edge_density)
    return features

# Paths
dataset_path = "maize-dataset"
labels = ["damaged", "not_damaged"]

X = []
y = []

# Load data
for label in labels:
    folder = os.path.join(dataset_path, label)
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        features = extract_features(path)
        if features is not None:
            X.append(features)
            y.append(label)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train classifier
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(clf, "maize_model.pkl")
print("✅ Model saved as 'maize_model.pkl'")
