const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { readProgressData } = require('./notebookParser');
const Project = require('../models/Project');
const Progress = require('../models/Progress');
const User = require('../models/User');
const emailService = require('./emailService');

async function processProgressData() {
  try {
    const outputPath = process.env.MODEL_OUTPUT_PATH || path.resolve(__dirname, '../../model_simulation/output/progress_data.json');
    const data = readProgressData(outputPath);
    if (!data.length) {
      console.log('⚠️  No progress data found');
      return;
    }
    // For demo: map latest record to each customer's project if imagePath matches or round-robin
    const latest = data[data.length - 1];
    console.log(`📊 Processing latest record: count=${latest.progressCount}, image=${latest.imagePath || 'none'}`);
    // Copy processed image into backend uploads for serving
    let imgPath = '';
    const latestImageField = latest.imagePath || latest.image || '';
    if (latestImageField) {
      try {
        const backendUploads = path.resolve(__dirname, '../uploads');
        if (!fs.existsSync(backendUploads)) fs.mkdirSync(backendUploads, { recursive: true });
        
        // Resolve image path - runner_yolo.py writes "images/filename.jpg"
        const imagesBase = process.env.IMAGES_DIR || '/Users/nishanth/Documents/Parking/Claude App/images';
        let sourceAbs = '';
        
        // Try direct path first (if imagePath is already absolute or relative to images folder)
        if (latestImageField.startsWith('images/')) {
          // Remove "images/" prefix and join with actual images directory
          const filename = latestImageField.replace('images/', '');
          sourceAbs = path.join(imagesBase, filename);
        } else {
          sourceAbs = path.join(imagesBase, latestImageField);
        }
        
        // Fallback: try other possible locations
        if (!fs.existsSync(sourceAbs)) {
          const possibleRoots = [
            path.resolve(__dirname, '../../model_simulation'),
            path.resolve(process.cwd(), 'model_simulation'),
            path.resolve('/Users/nishanth/Documents/Parking/Claude App'),
          ];
          for (const root of possibleRoots) {
            const candidates = [
              path.join(root, String(latestImageField)),
              path.join(root, 'uploaded_images', String(latestImageField)),
              path.join(root, 'uploaded_images', 'images', String(latestImageField)),
              path.join(root, 'images', String(latestImageField)),
            ];
            for (const pth of candidates) {
              if (fs.existsSync(pth)) { sourceAbs = pth; break; }
            }
            if (fs.existsSync(sourceAbs)) break;
          }
        }
        
        if (sourceAbs && fs.existsSync(sourceAbs)) {
          const filename = `${Date.now()}_${path.basename(sourceAbs)}`;
          const dest = path.join(backendUploads, filename);
          fs.copyFileSync(sourceAbs, dest);
          imgPath = filename; // relative under /uploads
          console.log(`✅ Copied image: ${sourceAbs} -> ${dest}`);
        } else {
          console.warn(`⚠️  Image not found: ${latestImageField} (tried: ${sourceAbs})`);
        }
      } catch (e) {
        console.error('❌ Image copy error:', e.message, e.stack);
      }
    }
    const projects = await Project.find({});
    const realCustomerEmail = process.env.REAL_CUSTOMER_EMAIL || 'customer1@company.com';
    const baselineExpected = Number(process.env.REAL_EXPECTED_PER_CYCLE || 7);
    for (const p of projects) {
      let expected = p.getExpectedCount(new Date(latest.timestamp));
      // Real vs dummy: real for Customer 1 (email match), dummy 5-10 random for others
      let actual = 0;
      if (p.customer) {
        const cust = await User.findById(p.customer);
        if (cust && cust.email === realCustomerEmail) {
          actual = Math.max(0, Number(latest.progressCount || latest.total_vehicles || 0));
          // Clamp expected for real customer to realistic per-cycle baseline
          expected = baselineExpected;
        } else {
          actual = expected + (Math.floor(Math.random() * 6) - 3); // vary around expected
          if (actual <= 0) actual = Math.floor(5 + Math.random() * 6); // 5-10 minimum pattern
        }
      } else {
        actual = expected;
      }
      const status = Progress.calculateStatus(actual, expected);
      const doc = await Progress.create({
        project: p._id,
        timestamp: latest.timestamp ? new Date(latest.timestamp) : new Date(),
        progressCount: actual,
        expectedCount: expected,
        status,
        deviation: actual - expected,
        imagePath: imgPath,
        metadata: latest.metadata || {}
      });
      console.log(`✅ Saved progress for project "${p.name}": ${actual}/${expected} (${status})`);
      if (p.customer) {
        const fullProject = await Project.findById(p._id).populate('customer');
        try {
          await emailService.sendProgressEmail(fullProject, doc);
          doc.emailSent = true;
          doc.emailSentAt = new Date();
          await doc.save();
          console.log(`📧 Email sent to ${fullProject.customer.email}`);
        } catch (emailErr) {
          console.error(`❌ Email error for ${fullProject.customer.email}:`, emailErr.message);
        }
      }
    }
    console.log('✅ Progress processing complete');
  } catch (err) {
    console.error('❌ Scheduler error:', err.message, err.stack);
  }
}

function startProgressMonitoring() {
  // Every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    console.log('⏰ Cron: Processing progress data...');
    // Execute fast YOLO runner (avoids papermill fragility). Set IMAGES_DIR via env if needed.
    const scriptCwd = path.resolve(__dirname, '../../../model_simulation');
    const pyExec = process.env.PYTHON_EXEC || 'python3';
    const env = { ...process.env, IMAGES_DIR: process.env.IMAGES_DIR || '/Users/nishanth/Documents/Parking/Claude App/images' };
    const py = spawn(pyExec, ['runner_yolo.py'], { cwd: scriptCwd, env });
    py.on('close', () => {
      processProgressData();
    });
  });
  console.log('⏰ Progress monitoring active (5-minute intervals)');
}

module.exports = { startProgressMonitoring, processProgressData };

