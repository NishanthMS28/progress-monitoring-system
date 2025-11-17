# 🚀 Quick Start Guide

Get the Progress Monitoring System up and running fast.

## Step 1: Prerequisites
```bash
node --version
mongod --version
python3 --version
```

## Step 2: Setup Script
```bash
chmod +x setup.sh
./setup.sh
```

## Step 3: Configure Backend
```bash
cp backend/.env.example backend/.env
# Edit backend/.env
```

## Step 4: Start Services
```bash
# Terminal 1
mongod

# Terminal 2
cd backend && npm run seed && npm run dev

# Terminal 3
cd frontend && npm start

# Terminal 4
cd model_simulation && python3 progress_monitor.py
```

Open http://localhost:3000 and login with:
- Owner: owner@factory.com / Owner@123
- Customer: customer1@company.com / Customer@123

