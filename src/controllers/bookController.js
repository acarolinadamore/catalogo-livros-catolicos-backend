/**
 * Controlador de Livros
 * Gerencia operações relacionadas a livros individuais
 */

import { supabase } from '../config/supabase.js';

/**
 * Listar todos os livros (com paginação)
 */
export async function listBooks(req, res) {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from('books')
      .select(`
        *,
        catalog:catalogs!inner(id, name, slug, is_public)
      `, { count: 'exact' })
      .eq('catalog.is_public', true)
      .order('title')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livros'
    });
  }
}

/**
 * Buscar livro por ID
 */
export async function getBookById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        catalog:catalogs!inner(id, name, slug, is_public)
      `)
      .eq('id', id)
      .eq('catalog.is_public', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Livro não encontrado'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livro'
    });
  }
}

/**
 * Buscar livros recentes
 */
export async function getRecentBooks(req, res) {
  try {
    const { limit = 12 } = req.query;

    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        catalog:catalogs!inner(id, name, slug, is_public)
      `)
      .eq('catalog.is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Erro ao buscar livros recentes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livros recentes'
    });
  }
}

/**
 * Criar novo livro
 */
export async function createBook(req, res) {
  try {
    const {
      titulo,
      autor,
      editora,
      ano,
      categoria,
      descricao,
      isbn,
      capa_url,
      indice,
      catalog_id
    } = req.body;

    // Validação básica
    if (!titulo || !autor) {
      return res.status(400).json({
        success: false,
        error: 'Título e autor são obrigatórios'
      });
    }

    // Se catalog_id não foi fornecido, buscar o primeiro catálogo público
    let catalogId = catalog_id;
    if (!catalogId) {
      const { data: catalogs, error: catalogError } = await supabase
        .from('catalogs')
        .select('id')
        .eq('is_public', true)
        .limit(1)
        .single();

      if (catalogError || !catalogs) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum catálogo disponível. Forneça um catalog_id válido.'
        });
      }

      catalogId = catalogs.id;
    }

    // Criar livro no Supabase
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title: titulo,
          author: autor,
          publisher: editora || null,
          publication_year: ano ? parseInt(ano) : null,
          category: categoria || null,
          description: descricao || null,
          isbn: isbn || null,
          cover_url: capa_url || null,
          index_text: indice || null,
          catalog_id: catalogId
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Livro cadastrado com sucesso',
      data
    });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao cadastrar livro'
    });
  }
}

/**
 * Atualizar livro existente
 */
export async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const {
      titulo,
      autor,
      editora,
      ano,
      categoria,
      descricao,
      isbn,
      capa_url,
      indice
    } = req.body;

    // Validação básica
    if (!titulo || !autor) {
      return res.status(400).json({
        success: false,
        error: 'Título e autor são obrigatórios'
      });
    }

    // Atualizar livro no Supabase
    const { data, error } = await supabase
      .from('books')
      .update({
        title: titulo,
        author: autor,
        publisher: editora || null,
        publication_year: ano ? parseInt(ano) : null,
        category: categoria || null,
        description: descricao || null,
        isbn: isbn || null,
        cover_url: capa_url || null,
        index_text: indice || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Livro não encontrado'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Livro atualizado com sucesso',
      data
    });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar livro'
    });
  }
}

/**
 * Deletar livro
 */
export async function deleteBook(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Livro deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar livro'
    });
  }
}
