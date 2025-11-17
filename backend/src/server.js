require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');
const emailRoutes = require('./routes/emailRoutes');
const scheduleService = require('./utils/scheduleService');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder - must match where scheduleService copies images
// __dirname is backend/src, so ../uploads = backend/uploads (one level up from src)
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads folder');
}

// Serve static files with proper headers
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    res.set('Cache-Control', 'public, max-age=3600');
  }
}));

// Fallback route handler for uploads (in case static middleware doesn't work)
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found', filename, uploadsDir });
  }
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).json({ error: 'Error serving file', message: err.message });
    }
  });
});

// Debug endpoint to list uploads (before other routes to avoid conflicts)
app.get('/api/debug/uploads', (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ error: 'Uploads directory does not exist', uploadsDir });
    }
    const files = fs.readdirSync(uploadsDir).filter(f => !f.startsWith('.'));
    res.json({ 
      uploadsDir, 
      exists: fs.existsSync(uploadsDir),
      fileCount: files.length,
      files: files.map(f => {
        const fullPath = path.join(uploadsDir, f);
        return {
          name: f,
          url: `http://localhost:5000/uploads/${f}`,
          size: fs.existsSync(fullPath) ? fs.statSync(fullPath).size : 0,
          exists: fs.existsSync(fullPath)
        };
      })
    });
  } catch (err) {
    res.status(500).json({ error: err.message, uploadsDir, stack: err.stack });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start background jobs
scheduleService.startProgressMonitoring();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email notifications enabled`);
});

module.exports = app;
