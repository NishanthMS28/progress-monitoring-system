const fs = require('fs');
const path = require('path');

function readProgressData(outputPath) {
  try {
    // If already absolute, use as-is; otherwise resolve relative to backend root
    const abs = path.isAbsolute(outputPath) ? outputPath : path.resolve(__dirname, '../../', outputPath);
    if (!fs.existsSync(abs)) {
      console.warn(`⚠️  Progress data file not found: ${abs}`);
      return [];
    }
    const raw = fs.readFileSync(abs, 'utf-8').trim();
    if (!raw) return [];
    const json = JSON.parse(raw);
    if (Array.isArray(json)) return json;
    return [json];
  } catch (err) {
    console.error('❌ Parser error:', err.message);
    return [];
  }
}

module.exports = { readProgressData };

