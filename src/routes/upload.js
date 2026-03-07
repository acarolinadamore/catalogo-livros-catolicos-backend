/**
 * Rotas de Upload
 */

import express from 'express';
import multer from 'multer';
import { uploadCover } from '../controllers/uploadController.js';

const router = express.Router();

// Configurar multer para armazenar em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// POST /api/upload/cover - Upload de capa de livro
router.post('/cover', upload.single('image'), uploadCover);

export default router;
