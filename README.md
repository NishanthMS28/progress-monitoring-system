# 🏭 Automated Progress Monitoring System

A complete MERN stack application for monitoring manufacturing progress through periodic image analysis. The system uses YOLO-based vehicle detection to track progress, compares it with predefined schedules, and sends automated email alerts to customers and owners.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Mac Setup](#mac-setup)
  - [Windows Setup](#windows-setup)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Setting Up Real Customer and Owner Accounts](#setting-up-real-customer-and-owner-accounts)
  - [Email Configuration](#email-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

## ✨ Features

- **Automated Progress Monitoring**: Image analysis every 5 minutes using YOLOv8
- **Real-time Dashboards**: Separate interfaces for owners and customers
- **Smart Status Tracking**: Automatically calculates ahead/on-time/delayed status
- **Email Notifications**: Automated alerts with progress summaries and images
- **Historical Analytics**: Track progress trends and deviations over time
- **Role-based Access**: Owner and Customer roles with appropriate permissions
- **Image Gallery**: View processed images with click-to-expand modal

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Python** (3.8 or higher) - [Download](https://www.python.org/downloads/)
- **Gmail Account** (for email notifications)
- **Git** (optional, for cloning)

## 🚀 Installation

### Mac Setup

#### 1. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Node.js

```bash
brew install node
node --version  # Verify installation (should show v16+)
```

#### 3. Install MongoDB

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Verify MongoDB is running:
```bash
mongosh
# Type 'exit' to leave MongoDB shell
```

#### 4. Install Python

```bash
brew install python3
python3 --version  # Verify installation
```

#### 5. Clone or Download the Project

```bash
cd ~/Documents
git clone <your-repo-url> progress-monitoring-system
cd progress-monitoring-system
```

### Windows Setup

#### 1. Install Node.js

1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the prompts
3. Verify installation:
```cmd
node --version
npm --version
```

#### 2. Install MongoDB

1. Download from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer (choose "Complete" installation)
3. During installation, check "Install MongoDB as a Service"
4. Verify installation:
```cmd
mongosh
```

#### 3. Install Python

1. Download from [python.org](https://www.python.org/downloads/)
2. Run the installer
3. **Important**: Check "Add Python to PATH" during installation
4. Verify installation:
```cmd
python --version
```

#### 4. Clone or Download the Project

```cmd
cd C:\Users\YourName\Documents
git clone <your-repo-url> progress-monitoring-system
cd progress-monitoring-system
```

## ⚙️ Configuration

### Environment Variables

#### 1. Backend Configuration

Navigate to the backend directory and create a `.env` file:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (local MongoDB)
MONGO_URI=mongodb://localhost:27017/progress_monitoring

# JWT Secret (generate a random string)
JWT_SECRET=your_very_secure_random_string_here_minimum_32_characters

# Email Configuration (see Email Setup section below)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password

# Frontend URL
CLIENT_URL=http://localhost:3000

# Model Configuration
MODEL_OUTPUT_PATH=../model_simulation/output/progress_data.json
IMAGES_DIR=/absolute/path/to/your/images/folder
PYTHON_EXEC=python3

# Real Customer Configuration (see section below)
REAL_CUSTOMER_EMAIL=your_customer_email@gmail.com
REAL_CUSTOMER_PASSWORD=YourSecurePassword123

# Owner Account Configuration
OWNER_EMAIL=your_owner_email@gmail.com
OWNER_PASSWORD=YourSecurePassword123

# Expected Progress Per Cycle
REAL_EXPECTED_PER_CYCLE=7
```

**Important Paths:**
- **IMAGES_DIR**: Use absolute path to your images folder
  - Mac: `/Users/YourName/Documents/images`
  - Windows: `C:\Users\YourName\Documents\images`

### Setting Up Real Customer and Owner Accounts

The system uses environment variables to configure real customer and owner accounts. This allows you to use your own email addresses without hardcoding them in the source code.

#### Step 1: Update `.env` File

In `backend/.env`, set your real accounts:

```env
# Your real customer account (will receive progress updates)
REAL_CUSTOMER_EMAIL=your_customer_email@gmail.com
REAL_CUSTOMER_PASSWORD=YourSecurePassword123

# Your real owner account (will receive all project updates)
OWNER_EMAIL=your_owner_email@gmail.com
OWNER_PASSWORD=YourSecurePassword123
```

#### Step 2: Seed the Database

After setting the environment variables, seed the database:

```bash
cd backend
npm run seed
```

This will create:
- Owner account using `OWNER_EMAIL` and `OWNER_PASSWORD`
- Customer 1 account using `REAL_CUSTOMER_EMAIL` and `REAL_CUSTOMER_PASSWORD`
- Two additional demo customer accounts

**Note**: If you don't set these environment variables, the system will use default demo accounts.

### Email Configuration

The system sends automated email notifications using Gmail. You need to set up a Gmail App Password (not your regular password).

#### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled

#### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter a name like "Progress Monitoring System"
5. Click "Generate"
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

#### Step 3: Update `.env` File

In `backend/.env`:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Important**: 
- Use the Gmail account that generated the App Password
- Remove any spaces from the App Password
- Never commit your `.env` file to Git

## 🎬 Running the Application

### Step 1: Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

#### Model Simulation

```bash
cd ../model_simulation

# Mac/Linux: Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Windows: Create virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Set Up Images Folder

1. Create a folder with your images (e.g., `~/Documents/images` or `C:\Users\YourName\Documents\images`)
2. Place your images (`.jpg`, `.jpeg`, `.png`, etc.) in this folder
3. Update `IMAGES_DIR` in `backend/.env` with the absolute path to this folder

### Step 3: Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- Owner account
- Customer accounts
- Sample projects
- Clears any existing progress data (starts fresh)

### Step 4: Start MongoDB

#### Mac

```bash
brew services start mongodb-community
# Or manually:
mongod --dbpath /usr/local/var/mongodb
```

#### Windows

MongoDB should start automatically as a service. If not:

```cmd
net start MongoDB
```

### Step 5: Start All Services

You'll need **4 terminal windows**:

#### Terminal 1: Backend

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📧 Email notifications enabled
✅ MongoDB connected
⏰ Progress monitoring active (5-minute intervals)
```

#### Terminal 2: Frontend

```bash
cd frontend
npm start
```

The browser should open automatically at `http://localhost:3000`

#### Terminal 3: Model Simulation (Optional - runs automatically via backend)

The backend automatically runs the model every 5 minutes. However, you can test it manually:

```bash
cd model_simulation

# Activate virtual environment
# Mac/Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# Run once to test
python runner_yolo.py
```

#### Terminal 4: MongoDB (if not running as service)

Only needed if MongoDB isn't running as a service:

```bash
# Mac
mongod

# Windows
mongod --dbpath "C:\data\db"
```

### Step 6: Access the Application

1. Open browser: `http://localhost:3000`
2. Login with your accounts:
   - **Owner**: Use `OWNER_EMAIL` / `OWNER_PASSWORD` from `.env`
   - **Customer**: Use `REAL_CUSTOMER_EMAIL` / `REAL_CUSTOMER_PASSWORD` from `.env`

## 📁 Project Structure

```
progress-monitoring-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, error handling
│   │   ├── utils/           # Email, scheduling, parsing
│   │   ├── config/          # Database configuration
│   │   ├── scripts/         # Database seeding
│   │   └── server.js        # Express app entry point
│   ├── uploads/             # Processed images (created automatically)
│   ├── .env.example         # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Dashboard pages
│   │   ├── context/         # React context (Auth)
│   │   ├── services/        # API service layer
│   │   ├── App.js           # Main app component
│   │   └── index.js         # React entry point
│   ├── public/
│   └── package.json
│
├── model_simulation/
│   ├── runner_yolo.py       # YOLO model runner
│   ├── requirements.txt     # Python dependencies
│   └── output/              # Model outputs (gitignored)
│       ├── progress_data.json
│       └── state.json
│
├── README.md                # This file
├── .gitignore               # Git ignore rules
└── docker-compose.yml       # Docker configuration (optional)
```

## 📖 API Documentation

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me (Protected)
GET /api/auth/customers (Owner only)
```

### Progress

```http
GET /api/progress/latest/:projectId (Protected)
GET /api/progress/history/:projectId (Protected)
GET /api/progress/stats/:projectId (Protected)
GET /api/progress/overview (Owner only)
GET /api/progress/chart/:projectId (Protected)
```

### Email

```http
POST /api/email/send (Owner only)
GET /api/email/history/:projectId (Protected)
POST /api/email/test (Owner only)
```

## 🔍 Troubleshooting

### Backend won't start

- **Check MongoDB**: Ensure MongoDB is running (`mongosh` should work)
- **Check .env**: Verify `.env` file exists and has correct values
- **Check Port**: Ensure port 5000 is not in use
- **Check Logs**: Look for error messages in terminal

### Frontend connection issues

- **Check Backend**: Ensure backend is running on port 5000
- **Check CORS**: Verify `CLIENT_URL` in backend `.env` matches frontend URL
- **Check API**: Test `http://localhost:5000/health` in browser

### Images not displaying

- **Check Uploads Folder**: Verify `backend/uploads` folder exists and has images
- **Check Path**: Verify `IMAGES_DIR` in `.env` is correct absolute path
- **Check Console**: Open browser console (F12) for error messages
- **Test Direct URL**: Try `http://localhost:5000/uploads/filename.jpg` directly

### Emails not sending

- **Check App Password**: Verify you're using Gmail App Password (16 characters), not regular password
- **Check 2FA**: Ensure 2-Step Verification is enabled on Gmail
- **Check .env**: Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- **Check Logs**: Look for email errors in backend terminal

### Model not running

- **Check Python**: Verify Python 3.8+ is installed
- **Check Virtual Environment**: Ensure virtual environment is activated
- **Check Dependencies**: Run `pip install -r requirements.txt`
- **Check Images**: Verify images folder exists and has images
- **Check Logs**: Look for errors in backend terminal

### Database connection errors

- **Check MongoDB**: Ensure MongoDB service is running
- **Check URI**: Verify `MONGO_URI` in `.env` is correct
- **Check Network**: Try `mongodb://127.0.0.1:27017/progress_monitoring`

## 🚢 Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)

Key considerations:
- Use MongoDB Atlas for database
- Set secure `JWT_SECRET`
- Use environment variables for all sensitive data
- Set up proper CORS for your domain
- Use a production email service (SendGrid, Mailgun, etc.)

## 📝 License

Feel free to use this project for your needs.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review API documentation
- Check server logs for error messages

---

**Built with ❤️ for modern manufacturing monitoring**
