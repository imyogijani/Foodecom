import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../public/uploads'),
    path.join(__dirname, '../public/uploads/avatars'),
    path.join(__dirname, '../public/uploads/products')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadType = req.path.includes('avatar') ? 'avatars' : 'products';
    const dest = path.join(__dirname, `../public/uploads/${uploadType}`);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${req.userId}`;
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-').toLowerCase());
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Only allow specific image types
  if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
    return cb(new Error('Only JPG, PNG and GIF files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
