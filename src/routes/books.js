/**
 * Rotas de Livros
 */

import express from 'express';
import {
  listBooks,
  getBookById,
  getRecentBooks,
  createBook,
  updateBook,
  deleteBook,
  clearCategoryFromBooks
} from '../controllers/bookController.js';

const router = express.Router();

// GET /api/books - Listar todos os livros
router.get('/', listBooks);

// GET /api/books/recent - Livros recentes
router.get('/recent', getRecentBooks);

// POST /api/books - Criar novo livro
router.post('/', createBook);

// POST /api/books/clear-category - Limpar categoria de livros
router.post('/clear-category', clearCategoryFromBooks);

// GET /api/books/:id - Buscar livro por ID
router.get('/:id', getBookById);

// PUT /api/books/:id - Atualizar livro
router.put('/:id', updateBook);

// DELETE /api/books/:id - Deletar livro
router.delete('/:id', deleteBook);

export default router;
