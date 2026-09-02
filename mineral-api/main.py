from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torchvision.transforms as transforms
import torchvision.models as models
import io
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}

# Load your model
checkpoint = torch.load("mineral_resnet18_v2.pth", map_location="cpu")
idx_to_label = checkpoint["idx_to_label"]
CLASS_NAMES = [idx_to_label[i] for i in range(len(idx_to_label))]

model = models.resnet50(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, len(CLASS_NAMES))
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

@app.post("/identify")
async def identify(file: UploadFile = File(...)):
    img_bytes = await file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs, dim=1)[0]

    top3 = torch.topk(probs, 3)
    results = [
        {
            "name": CLASS_NAMES[top3.indices[i].item()],
            "confidence": round(top3.values[i].item() * 100, 1)
        }
        for i in range(3)
    ]
    return {"results": results}
