from flask import Flask, render_template, request, jsonify
import os
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
MODEL_PATH = "models/mineral_resnet18_v2.pth"
LABELS_PATH = "models/nigerian_labels.json"
DB_PATH = "mineral_db.json"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =========================
# LOAD DATABASE
# =========================

with open(DB_PATH, "r", encoding="utf-8") as f:
    mineral_db = json.load(f)

# =========================
# LOAD LABELS
# =========================

with open(LABELS_PATH, "r") as f:
    labels_data = json.load(f)

idx_to_label = labels_data["idx_to_label"]

# =========================
# MODEL
# =========================

NUM_CLASSES = len(idx_to_label)

model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)

try:
    checkpoint = torch.load(
        MODEL_PATH,
        map_location="cpu"
    )

    if "model_state_dict" in checkpoint:
        model.load_state_dict(
            checkpoint["model_state_dict"]
        )
    else:
        model.load_state_dict(checkpoint)

    model.eval()

    MODEL_READY = True

except Exception as e:

    print("MODEL ERROR:", e)

    MODEL_READY = False

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485,0.456,0.406],
        [0.229,0.224,0.225]
    )
])

# =========================
# ROUTES
# =========================

@app.route("/")
def home():
    return render_template(
        "index.html",
        states=mineral_db["state_distributions"]
    )

@app.route("/identify")
def identify():
    return render_template("identify.html")

@app.route("/database")
def database():
    return render_template(
        "database.html",
        minerals=mineral_db["minerals"]
    )

@app.route("/analytics")
def analytics():
    return render_template("analytics.html")

@app.route("/api/catalog")
def catalog():

    return jsonify(
        mineral_db["minerals"]
    )

@app.route("/api/states")
def states():

    return jsonify(
        mineral_db["state_distributions"]
    )

@app.route("/mineral/<name>")
def mineral_detail(name):

    mineral = next(
        (
            m for m in mineral_db["minerals"]
            if m["name"].lower() == name.lower()
        ),
        None
    )

    return render_template(
        "mineral_detail.html",
        mineral=mineral
    )

@app.route("/predict", methods=["POST"])
def predict():

    if not MODEL_READY:
        return jsonify({
            "error":"Model not loaded"
        })

    file = request.files["image"]

    path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(path)

    image = Image.open(path).convert("RGB")

    tensor = transform(image)
    tensor = tensor.unsqueeze(0)

    with torch.no_grad():

        output = model(tensor)

        probs = torch.softmax(
            output,
            dim=1
        )

        confidence, pred = torch.max(
            probs,
            1
        )

    mineral_name = idx_to_label[str(pred.item())]

    mineral_info = next(
        (
            m for m in mineral_db["minerals"]
            if m["name"].lower()
            == mineral_name.lower()
        ),
        None
    )

    return jsonify({
        "prediction": mineral_name,
        "confidence": round(
            confidence.item()*100,
            2
        ),
        "details": mineral_info
    })

if __name__ == "__main__":
    app.run(debug=True)