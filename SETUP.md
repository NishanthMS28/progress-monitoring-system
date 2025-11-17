# 🧰 Local Setup Guide (macOS) - Automated Progress Monitoring System

Follow these steps from a fresh macOS Terminal to run the full MERN app (MongoDB, Express/Node, React, Python simulation).

## 0) Open Terminal and go to the project
```bash
cd "/Users/nishanth/Documents/Parking/Claude App/progress-monitoring-system"
```

## 1) Prerequisites
Check installed versions:
```bash
node --version
npm --version
python3 --version
```

If MongoDB is not installed, install via Homebrew:
```bash
# Install Homebrew if you don't have it: https://brew.sh
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

Alternatively, start MongoDB with Docker (optional instead of Homebrew):
```bash
docker run -d --name pms-mongo -p 27017:27017 mongo:6
```

## 2) One-time project setup
Run the automated setup (installs deps, creates folders):
```bash
chmod +x setup.sh
./setup.sh
```

If you prefer manual install:
```bash
# Backend deps
cd backend
npm install
cd ..

# Frontend deps
cd frontend
npm install
cd ..

# Python deps
cd model_simulation
pip3 install -r requirements.txt
mkdir -p output/images
touch output/progress_data.json
cd ..
```

## 3) Configure backend environment
Create and edit `backend/.env` (copy the example below):
```bash
cd backend
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/progress_monitoring
JWT_SECRET=your_super_secret_jwt_key_change_this
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
CLIENT_URL=http://localhost:3000
MODEL_OUTPUT_PATH=../model_simulation/output/progress_data.json
EOF
cd ..
```

Notes:
- Use a Gmail App Password (not your regular password). Enable 2FA → App Passwords.
- If using Docker MongoDB, `MONGO_URI` can remain `mongodb://localhost:27017/progress_monitoring`.

## 4) Seed the database (demo users/projects)
```bash
cd backend
npm run seed
cd ..
```
This creates:
- Owner: owner@factory.com / Owner@123
- Customers: customer1@company.com, customer2@company.com, customer3@company.com (all with Customer@123)

## 5) Start all services (separate terminals)
Open three terminal windows/tabs:

- Terminal A: Backend (Node/Express)
```bash
cd "/Users/nishanth/Documents/Parking/Claude App/progress-monitoring-system/backend"
npm run dev
```

- Terminal B: Frontend (React)
```bash
cd "/Users/nishanth/Documents/Parking/Claude App/progress-monitoring-system/frontend"
npm start
```

- Terminal C: Model Simulation (Python)
```bash
cd "/Users/nishanth/Documents/Parking/Claude App/progress-monitoring-system/model_simulation"
python3 progress_monitor.py
```

Access the app at:
```
http://localhost:3000
```

Login using demo credentials (e.g., owner@factory.com / Owner@123).

## 6) What’s running under the hood
- Frontend (React) on http://localhost:3000
- Backend (Express/Node) on http://localhost:5000
  - Health check: http://localhost:5000/health
  - API base: http://localhost:5000/api
- MongoDB on localhost:27017
- Cron job (backend) reads `model_simulation/output/progress_data.json` every 5 minutes, computes status, writes to MongoDB, and sends emails via Nodemailer.
- Python script writes progress records to `model_simulation/output/progress_data.json` (derived from your notebook output logic).

## 7) Useful API checks
```bash
# Health
curl http://localhost:5000/health

# Login (owner)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@factory.com","password":"Owner@123"}'
```

## 8) Docker (optional)
You can also start MongoDB, backend, and frontend via Docker Compose:
```bash
cd "/Users/nishanth/Documents/Parking/Claude App/progress-monitoring-system"
docker-compose up -d --build
docker-compose logs -f
```
Note: The Python simulation runs outside the containers in this setup. Keep running it locally:
```bash
cd model_simulation && python3 progress_monitor.py
```

## 9) Troubleshooting
- Backend fails to connect to Mongo:
  - Ensure Mongo is running: `brew services list` or `docker ps`
  - Check `MONGO_URI` in `backend/.env`
  - Try `mongodb://127.0.0.1:27017/progress_monitoring`
- Emails not sending:
  - Use Gmail App Password
  - Verify `EMAIL_USER` / `EMAIL_PASS` in `.env`
- Frontend can’t reach API:
  - Ensure backend is running on port 5000
  - Frontend dev proxy is set in `frontend/package.json`
- No progress shows up:
  - Confirm `model_simulation/progress_monitor.py` is running
  - Check `model_simulation/output/progress_data.json` updates
  - Cron runs every 5 minutes; for immediate processing you can temporarily call `processProgressData()` manually from a small script, or wait for the next interval

## 10) Stop services
```bash
# Backend/Frontend: Ctrl+C in each terminal

# MongoDB (Homebrew)
brew services stop mongodb-community@6.0

# Docker containers (if used)
docker-compose down
```

You’re ready to explore the dashboards on http://localhost:3000 and see the system update as the simulation writes new progress data.*** End Patch ```

