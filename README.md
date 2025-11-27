# Progress Monitoring System

A full-stack MERN application for real-time construction/manufacturing progress tracking with AI-powered image analysis using YOLOv8.

## Features

- 📊 **Real-time Progress Tracking** - Monitor project progress with live updates
- 🤖 **AI-Powered Analysis** - YOLOv8 object detection for automated progress counting
- 📧 **Email Notifications** - Customizable alerts for owners and customers
- 👥 **Multi-User Support** - Separate dashboards for owners and customers
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 📈 **Visual Analytics** - Charts and graphs for progress visualization
- 🖼️ **Image History** - View historical progress images

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- Axios (API calls)

### Backend
- Node.js & Express.js
- MongoDB (database)
- JWT (authentication)
- Nodemailer (email notifications)
- Node-cron (scheduled tasks)

### AI/ML
- Python 3.x
- YOLOv8 (Ultralytics)
- OpenCV
- Pillow

## Prerequisites

### All Platforms
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/downloads)
- **Gmail Account** (for email notifications)



## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/NishanthMS28/progress-monitoring-system.git
cd progress-monitoring-system
```

### 2. MongoDB Setup

#### macOS
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### Windows
1. Download MongoDB from [official website](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will start automatically as a service

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

#### Configure Backend Environment Variables

Edit `backend/.env`:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/progress_monitoring

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_secure

# Email Configuration (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL
CLIENT_URL=http://localhost:3000

# Model Configuration
MODEL_OUTPUT_PATH=../model_simulation/output/progress_data.json
IMAGES_DIR=/absolute/path/to/your/images/directory
REAL_EXPECTED_PER_CYCLE=7

# Python Environment
PYTHON_EXEC=/absolute/path/to/progress-monitoring-system/model_simulation/.venv/bin/python

# User Credentials for Seeding
OWNER_EMAIL=owner@example.com
OWNER_PASSWORD=SecureOwnerPassword123
REAL_CUSTOMER_EMAIL=customer@example.com
REAL_CUSTOMER_PASSWORD=SecureCustomerPassword123
```

> **⚠️ IMPORTANT**: 
> - `IMAGES_DIR` must be an **absolute path** to your images directory
> - `PYTHON_EXEC` must be an **absolute path** to your Python virtual environment

#### Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-character password (remove spaces)
6. Paste it in `EMAIL_PASS` in your `.env` file

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 5. Model Simulation Setup

#### macOS/Linux
```bash
cd ../model_simulation

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

#### Windows
```bash
cd ../model_simulation

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

### 6. Prepare Images Directory

Create a directory for your images and update `IMAGES_DIR` in `.env`:

```bash
# Example
mkdir -p /path/to/your/images
```

Place your images in this directory. The model will process them sequentially.

### 7. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 1 Owner account (using `OWNER_EMAIL` and `OWNER_PASSWORD`)
- 3 Customer accounts (including one using `REAL_CUSTOMER_EMAIL` and `REAL_CUSTOMER_PASSWORD`)
- 3 Sample projects

## Running the Application

You need to run **three** services simultaneously:

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

### Terminal 2: Frontend
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

### Terminal 3: Model Simulation
```bash
cd model_simulation
source .venv/bin/activate  # macOS/Linux
# OR
.venv\Scripts\activate  # Windows

python runner_yolo.py
```

## Default Login Credentials

After seeding, you can log in with:

### Owner Account
- **Email**: Value from `OWNER_EMAIL` in `.env`
- **Password**: Value from `OWNER_PASSWORD` in `.env`

### Customer Account
- **Email**: Value from `REAL_CUSTOMER_EMAIL` in `.env`
- **Password**: Value from `REAL_CUSTOMER_PASSWORD` in `.env`

## Usage Guide

### For Owners

1. **Dashboard Overview**: View all projects, their status, and completion percentages
2. **Project Management**: Click on any project to see detailed progress history
3. **Email Notifications**: Toggle email alerts per project in the "Email Alerts" column
4. **View Images**: Click the eye icon in the history table to view progress images

### For Customers

1. **Project Dashboard**: View your assigned project's progress
2. **Progress Charts**: See visual representation of progress over time
3. **Email Notifications**: Toggle email alerts in the navbar
4. **Recent History**: View all progress updates with timestamps and images

## Email Notification System

### Customer Preferences
- Toggle in the navbar controls ALL email notifications
- When OFF: Customer receives no emails

### Owner Preferences
- Each project has its own toggle in the "All Projects" table
- Control notifications per-project for granular management
- When OFF for a project: Owner doesn't receive emails for THAT specific project

## Adding New Projects/Customers

### Option 1: Modify Seed Script

Edit `backend/src/scripts/seed.js`:

```javascript
const customers = [
  { name: 'Your Customer Name', email: 'customer@example.com', password: 'SecurePassword123' },
  // Add more customers
];

const projects = [
  {
    name: 'Your Project Name',
    description: 'Project description',
    totalUnits: 1000,  // Total expected units
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    customerEmail: 'customer@example.com'
  },
  // Add more projects
];
```

Then re-run:
```bash
npm run seed
```

### Option 2: Manual Database Entry

Use MongoDB Compass or mongosh to add documents directly to the `users` and `projects` collections.

## Customizing Expected Progress

### Per-Project Schedule
Projects automatically generate a schedule based on `startDate`, `endDate`, and `totalUnits`.

### Real Customer Baseline
For the customer specified in `REAL_CUSTOMER_EMAIL`, the system uses `REAL_EXPECTED_PER_CYCLE` instead of the calculated schedule. This is useful for actual production tracking where you have a known baseline.

Edit in `.env`:
```bash
REAL_EXPECTED_PER_CYCLE=7  # Expected units per cycle
```

## Using Your Own Model

### Option 1: Replace YOLOv8 Model

1. Place your YOLOv8 `.pt` file in `model_simulation/`
2. Update `runner_yolo.py`:
```python
model = YOLO('your_model.pt')
```

### Option 2: Use Different Detection Logic

Modify `model_simulation/runner_yolo.py`:

```python
def process_image(image_path):
    # Your custom detection logic here
    # Must return: count (int)
    
    # Example:
    # count = your_detection_function(image_path)
    
    return count
```

The system expects:
- Input: Image path
- Output: Integer count of detected objects

## Project Structure

```
progress-monitoring-system/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Seed scripts
│   │   └── utils/          # Utilities (email, scheduling)
│   └── uploads/            # Uploaded images (gitignored)
├── frontend/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context (auth)
│       ├── pages/          # Page components
│       └── services/       # API services
├── model_simulation/       # Python AI model
│   ├── output/            # Model outputs (gitignored)
│   └── .venv/             # Python virtual env (gitignored)
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Progress
- `GET /api/progress/overview` - Get all projects overview (owner)
- `GET /api/progress/:projectId/latest` - Get latest progress
- `GET /api/progress/:projectId/history` - Get progress history
- `GET /api/progress/:projectId/stats` - Get project statistics
- `GET /api/progress/:projectId/chart` - Get chart data

### Projects
- `PUT /api/projects/:id/preferences` - Update project email preferences

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# macOS
brew services list

# Linux
sudo systemctl status mongod

# Windows
# Check Services app for "MongoDB"
```

### Email Not Sending
1. Verify Gmail App Password is correct (no spaces)
2. Check 2-Step Verification is enabled
3. Check backend logs for email errors
4. Verify email preferences are enabled (toggles are ON)

### Model Not Processing Images
1. Verify Python virtual environment is activated
2. Check `IMAGES_DIR` path is correct and contains images
3. Verify `PYTHON_EXEC` path in `.env`
4. Check model_simulation logs for errors

### Frontend Not Connecting to Backend
1. Verify backend is running on port 5000
2. Check `proxy` in `frontend/package.json` is `http://localhost:5000`
3. Clear browser cache and restart frontend

## Configuration Guide

### Finding Absolute Paths

You need absolute paths for `IMAGES_DIR` and `PYTHON_EXEC`. Here's how to find them:

#### macOS/Linux
**Images Directory**:
```bash
cd ~/path/to/images
pwd
# Copy the output
```

**Python Executable**:
```bash
cd model_simulation
source .venv/bin/activate
which python
# Copy the output
```

#### Windows
**Images Directory**:
1. Open File Explorer to your images folder
2. Click the address bar
3. Copy the path

**Python Executable**:
```bash
cd model_simulation
.venv\Scripts\activate
where python
# Copy the output path
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/NishanthMS28/progress-monitoring-system/issues)
- Check existing issues for solutions

## Acknowledgments

- YOLOv8 by Ultralytics
- MongoDB, Express, React, Node.js communities
