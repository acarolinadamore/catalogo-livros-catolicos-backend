/**
 * Controlador de Catálogos
 * Gerencia operações relacionadas a catálogos de livros
 */

import { supabase } from '../config/supabase.js';

/**
 * Listar todos os catálogos públicos
 */
export async function listCatalogs(req, res) {
  try {
    const { data, error } = await supabase
      .from('catalogs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Erro ao listar catálogos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar catálogos'
    });
  }
}

/**
 * Buscar catálogo por slug
 */
export async function getCatalogBySlug(req, res) {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('catalogs')
      .select('*')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Catálogo não encontrado'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Erro ao buscar catálogo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar catálogo'
    });
  }
}

/**
 * Buscar livros de um catálogo específico
 */
export async function getCatalogBooks(req, res) {
  try {
    const { slug } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Primeiro, buscar o catálogo
    const { data: catalog, error: catalogError } = await supabase
      .from('catalogs')
      .select('id')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (catalogError) {
      if (catalogError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Catálogo não encontrado'
        });
      }
      throw catalogError;
    }

    // Buscar livros do catálogo
    const { data: books, error: booksError, count } = await supabase
      .from('books')
      .select('*', { count: 'exact' })
      .eq('catalog_id', catalog.id)
      .order('title')
      .range(offset, offset + limit - 1);

    if (booksError) throw booksError;

    res.json({
      success: true,
      data: books || [],
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar livros do catálogo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livros'
    });
  }
}
