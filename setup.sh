#!/bin/bash
# Setup script for Progress Monitoring System

set -e

echo "🚀 Progress Monitoring System - Setup Script"
echo "=============================================="
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed. Install Node.js v16+."
  exit 1
fi
echo "✅ Node.js: $(node --version)"

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm not found."
  exit 1
fi
echo "✅ npm: $(npm --version)"

if ! command -v python3 >/dev/null 2>&1; then
  echo "⚠️  Python 3 is not installed. Install Python 3.8+."
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "📝 Created backend/.env (edit it with your config)."
fi
npm install
cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "📦 Installing Python Dependencies..."
cd model_simulation
if [ ! -f "requirements.txt" ]; then
  cat > requirements.txt << EOL
ultralytics>=8.2.0
pandas>=2.0.0
opencv-python-headless>=4.8.0
Pillow>=10.0.0
numpy>=1.24.0
EOL
fi
pip3 install -r requirements.txt || true
mkdir -p output/images
touch output/progress_data.json
cd ..

echo ""
echo "✅ Setup Complete!"
echo "Next:"
echo "1) Edit backend/.env"
echo "2) Start MongoDB (mongod)"
echo "3) Seed DB: cd backend && npm run seed"
echo "4) Start backend: npm run dev"
echo "5) Start frontend: cd ../frontend && npm start"
echo "6) Start simulation: cd ../model_simulation && python3 progress_monitor.py"

