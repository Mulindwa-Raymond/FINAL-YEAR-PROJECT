/**
 * Multer Configuration Middleware
 * Handles file uploads for CSV/JSON (bulk import) and images (equipment/detergent photos).
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper: Ensure directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ============================================
// 1. IMAGE UPLOADS (Equipment & Detergents)
// ============================================

// Storage for equipment images
const equipmentImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/equipment/';
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `equip-${unique}${ext}`);
  }
});

// Storage for detergent images
const detergentImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/detergents/';
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `det-${unique}${ext}`);
  }
});

// Image file filter (accept only images)
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.'), false);
  }
};

// Multer instances for image uploads (5MB limit)
const uploadEquipmentImage = multer({
  storage: equipmentImageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('image');

const uploadDetergentImage = multer({
  storage: detergentImageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('image');

// ============================================
// 2. CSV/JSON UPLOADS (Bulk Import)
// ============================================

// Storage for CSV/JSON files (temporary)
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `import-${unique}${ext}`);
  }
});

// CSV/JSON file filter
const csvFilter = (req, file, cb) => {
  const allowedTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(file.mimetype) || ext === '.csv' || ext === '.json') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and JSON files are allowed.'), false);
  }
};

const uploadCSV = multer({
  storage: csvStorage,
  fileFilter: csvFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
}).single('file');

// ============================================
// 3. EXPORTS
// ============================================
module.exports = {
  // Image uploads
  uploadEquipmentImage,
  uploadDetergentImage,
  // Bulk data imports
  uploadCSV
};