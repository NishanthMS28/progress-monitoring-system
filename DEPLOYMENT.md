# 🚢 Deployment Guide

## Local Production
### Backend
```bash
cd backend
npm ci --only=production
NODE_ENV=production node src/server.js
```

### Frontend
```bash
cd frontend
npm run build
npx serve -s build -l 3000
```

## Docker Compose
```bash
docker-compose up -d --build
docker-compose logs -f
```

## Environment Variables
Backend:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=...
JWT_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
CLIENT_URL=https://your-frontend
MODEL_OUTPUT_PATH=/app/model_simulation/output/progress_data.json
```

Frontend:
```env
REACT_APP_API_URL=https://your-backend/api
```

