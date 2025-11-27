#!/usr/bin/env python3
"""
Lightweight runner that processes exactly one image per run from the images folder.
Counts vehicles with YOLOv8n on CPU and appends a record to output/progress_data.json.
"""
import os
import json
from datetime import datetime, timezone
from pathlib import Path

IMAGES_DIR = Path(os.environ.get("IMAGES_DIR"))
if not IMAGES_DIR or not IMAGES_DIR.exists():
    print("❌ ERROR: IMAGES_DIR environment variable is not set or directory does not exist!")
    print("Please set IMAGES_DIR in your .env file to the absolute path of your images directory.")
    sys.exit(1)
ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = ROOT / "output"
STATE_PATH = OUTPUT_DIR / "state.json"
AGG_PATH = OUTPUT_DIR / "progress_data.json"

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
VEHICLE_CLASSES = {"car", "truck", "bus", "motorcycle", "bicycle"}

def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()

def list_images():
    if not IMAGES_DIR.exists():
        raise RuntimeError(f"Images folder not found: {IMAGES_DIR}")
    files = sorted([p for p in IMAGES_DIR.rglob("*") if p.suffix.lower() in SUPPORTED_EXTS])
    if not files:
        raise RuntimeError(f"No images found under: {IMAGES_DIR}")
    return files

def load_state():
    if STATE_PATH.exists():
        try:
            return json.loads(STATE_PATH.read_text())
        except Exception:
            return {}
    return {}

def save_state(state):
    OUTPUT_DIR.mkdir(exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2))

def append_record(rec):
    OUTPUT_DIR.mkdir(exist_ok=True)
    existing = []
    if AGG_PATH.exists():
        try:
            existing = json.loads(AGG_PATH.read_text() or "[]")
            if not isinstance(existing, list):
                existing = [existing]
        except Exception:
            existing = []
    existing.append(rec)
    if len(existing) > 200:
        existing = existing[-200:]
    AGG_PATH.write_text(json.dumps(existing, indent=2))

def run():
    files = list_images()
    state = load_state()
    last_idx = int(state.get("last_index", -1))
    next_idx = (last_idx + 1) % len(files)
    img_path = files[next_idx]

    # Load YOLO
    from ultralytics import YOLO
    model = YOLO("yolov8n.pt")
    model.to("cpu")

    # Predict
    results = model.predict(source=str(img_path), conf=0.25, iou=0.5, device="cpu", verbose=False)
    total = 0
    try:
        r = results[0]
        boxes = r.boxes
        names = getattr(model.model, "names", getattr(model, "names", {}))
        if boxes is not None and len(boxes) > 0:
            cls = boxes.cls.cpu().numpy().astype(int)
            for c in cls:
                cname = names.get(int(c), str(int(c)))
                if cname in VEHICLE_CLASSES:
                    total += 1
    except Exception:
        total = 0

    # Path to store relative so backend can resolve from multiple roots
    rel_path = f"images/{img_path.name}"

    record = {
        "timestamp": utc_now_iso(),
        "progressCount": int(total),
        "imagePath": rel_path
    }
    append_record(record)

    state["last_index"] = next_idx
    save_state(state)
    print(f"Processed: {img_path} -> count={total}")

if __name__ == "__main__":
    run()


