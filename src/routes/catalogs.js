/**
 * Rotas de Catálogos
 */

import express from 'express';
import {
  listCatalogs,
  getCatalogBySlug,
  getCatalogBooks
} from '../controllers/catalogController.js';

const router = express.Router();

// GET /api/catalogs - Listar catálogos públicos
router.get('/', listCatalogs);

// GET /api/catalogs/:slug - Buscar catálogo por slug
router.get('/:slug', getCatalogBySlug);

// GET /api/catalogs/:slug/books - Livros de um catálogo
router.get('/:slug/books', getCatalogBooks);

export default router;
