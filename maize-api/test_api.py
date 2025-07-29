import requests

with open("test.jpg", "rb") as f:
    files = {'file': f}
    response = requests.post("http://localhost:5000/predict", files=files)

print(response.status_code)
print(response.json())









