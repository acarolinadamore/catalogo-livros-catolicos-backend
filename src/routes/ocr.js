/**
 * Rotas para OCR com Claude API Vision
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { processBookCoverOCR } from '../controllers/ocrController.js';

const router = express.Router();

// Usar pasta temporária do sistema (funciona em qualquer ambiente)
const tmpDir = os.tmpdir();

// Configurar multer para upload temporário
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usar pasta temporária do sistema operacional
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ocr-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    // Aceitar apenas imagens
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (JPG, PNG, WEBP, GIF)'));
    }
  }
});

/**
 * POST /api/ocr/analyze-cover
 * Analisa capa de livro e extrai informações usando Claude Vision
 */
router.post('/analyze-cover', upload.single('image'), processBookCoverOCR);

export default router;
