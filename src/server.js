/**
 * Servidor principal da API - Biblioteca Católica
 * Backend para catalogação de livros religiosos católicos
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/supabase.js';
import catalogRoutes from './routes/catalogs.js';
import bookRoutes from './routes/books.js';
import searchRoutes from './routes/search.js';
import uploadRoutes from './routes/upload.js';
import ocrRoutes from './routes/ocr.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// MIDDLEWARES
// =====================

// CORS - Permitir requisições do frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://minha-biblioteca-catolica.vercel.app'
];

// Adicionar FRONTEND_URL do .env se existir
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueou origem: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Parser de JSON
app.use(express.json());

// Logger simples
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// =====================
// ROTAS
// =====================

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Biblioteca Católica API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      catalogs: '/api/catalogs',
      books: '/api/books',
      search: '/api/search',
      upload: '/api/upload',
      ocr: '/api/ocr'
    }
  });
});

// Rotas da API
app.use('/api/catalogs', catalogRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ocr', ocrRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =====================
// INICIALIZAÇÃO
// =====================

async function startServer() {
  try {
    // Testar conexão com Supabase
    const connected = await testConnection();

    if (!connected) {
      console.warn('⚠ Servidor iniciado, mas sem conexão com o banco de dados');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🙏 Biblioteca Católica API`);
      console.log(`📚 Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 http://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
