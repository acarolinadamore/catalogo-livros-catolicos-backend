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
        id,
        catalog_id,
        title,
        author,
        publisher,
        year,
        content_type,
        description,
        cover_image_url,
        index_text,
        intercessors,
        pastoral_uses,
        created_at,
        updated_at,
        catalog:catalogs!inner(id, name, slug, is_public)
      `, { count: 'exact' })
      .eq('catalog.is_public', true)
      .order('title')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Mapear campos do schema original para nomes compatíveis com frontend
    const mappedData = (data || []).map(book => ({
      ...book,
      publication_year: book.year,
      category: book.content_type,
      cover_url: book.cover_image_url,
      tags: book.intercessors && book.pastoral_uses
        ? [...(book.intercessors || []), ...(book.pastoral_uses || [])].join(', ')
        : ''
    }));

    res.json({
      success: true,
      data: mappedData,
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
        id,
        catalog_id,
        title,
        author,
        publisher,
        year,
        content_type,
        description,
        cover_image_url,
        index_text,
        intercessors,
        pastoral_uses,
        created_at,
        updated_at,
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

    // Mapear campos do schema original para nomes compatíveis com frontend
    const mappedData = {
      ...data,
      publication_year: data.year,
      category: data.content_type,
      cover_url: data.cover_image_url,
      tags: data.intercessors && data.pastoral_uses
        ? [...(data.intercessors || []), ...(data.pastoral_uses || [])].join(', ')
        : ''
    };

    res.json({
      success: true,
      data: mappedData
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
        id,
        catalog_id,
        title,
        author,
        publisher,
        year,
        content_type,
        description,
        cover_image_url,
        index_text,
        intercessors,
        pastoral_uses,
        created_at,
        updated_at,
        catalog:catalogs!inner(id, name, slug, is_public)
      `)
      .eq('catalog.is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Mapear campos do schema original para nomes compatíveis com frontend
    const mappedData = (data || []).map(book => ({
      ...book,
      publication_year: book.year,
      category: book.content_type,
      cover_url: book.cover_image_url,
      tags: book.intercessors && book.pastoral_uses
        ? [...(book.intercessors || []), ...(book.pastoral_uses || [])].join(', ')
        : ''
    }));

    res.json({
      success: true,
      data: mappedData
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
    console.log('Tentando criar livro com os dados:', {
      title: titulo,
      author: autor,
      publisher: editora || null,
      year: ano ? parseInt(ano) : null,
      content_type: categoria || null,
      description: descricao || null,
      cover_image_url: capa_url || null,
      index_text: indice || null,
      catalog_id: catalogId
    });

    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title: titulo,
          author: autor,
          publisher: editora || null,
          year: ano ? parseInt(ano) : null,
          content_type: categoria || null,
          description: descricao || null,
          cover_image_url: capa_url || null,
          index_text: indice || null,
          catalog_id: catalogId
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro detalhado do Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Livro criado com sucesso:', data);

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
    console.log('Atualizando livro ID:', id, 'com capa_url:', capa_url);

    const { data, error } = await supabase
      .from('books')
      .update({
        title: titulo,
        author: autor,
        publisher: editora || null,
        year: ano ? parseInt(ano) : null,
        content_type: categoria || null,
        description: descricao || null,
        cover_image_url: capa_url || null,
        index_text: indice || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    console.log('Livro atualizado:', data);

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

/**
 * Limpar categoria de todos os livros que possuem uma categoria específica
 */
export async function clearCategoryFromBooks(req, res) {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Categoria é obrigatória'
      });
    }

    // Atualizar todos os livros que têm essa categoria, setando content_type como null
    const { data, error } = await supabase
      .from('books')
      .update({ content_type: null })
      .eq('content_type', category)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: `Categoria removida de ${data?.length || 0} livro(s)`,
      affected_count: data?.length || 0
    });
  } catch (error) {
    console.error('Erro ao limpar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao limpar categoria dos livros'
    });
  }
}
