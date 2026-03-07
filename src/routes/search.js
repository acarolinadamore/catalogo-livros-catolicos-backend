/**
 * Rotas de Busca
 * Core do sistema - foco principal na experiência de busca
 */

import express from 'express';
import {
  searchBooks,
  getFilterOptions
} from '../controllers/searchController.js';

const router = express.Router();

// GET /api/search - Busca avançada de livros
router.get('/', searchBooks);

// GET /api/search/filters - Opções de filtros disponíveis
router.get('/filters', getFilterOptions);

export default router;
