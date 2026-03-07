/**
 * Controlador de Busca
 * Implementa busca textual e filtros estruturados
 * CORE do sistema - foco principal na experiência de busca
 */

import { supabase } from '../config/supabase.js';

/**
 * Busca avançada de livros
 * Combina busca textual (título, autor, descrição, índice) com filtros estruturados
 */
export async function searchBooks(req, res) {
  try {
    const {
      q = '',                    // Query de busca textual
      content_type,              // Filtro: tipo de conteúdo
      intercessor,               // Filtro: intercessor
      pastoral_use,              // Filtro: uso pastoral
      publisher,                 // Filtro: editora
      year_min,                  // Filtro: ano mínimo
      year_max,                  // Filtro: ano máximo
      limit = 50,
      offset = 0
    } = req.query;

    // Construir query base
    let query = supabase
      .from('books')
      .select(`
        *,
        catalog:catalogs!inner(id, name, slug, is_public)
      `, { count: 'exact' })
      .eq('catalog.is_public', true);

    // Aplicar busca textual (título, autor, descrição, índice)
    if (q && q.trim()) {
      const searchTerm = q.trim();

      // Busca usando Full Text Search do PostgreSQL
      // Busca em múltiplos campos: título, autor, descrição, índice
      query = query.or(
        `title.ilike.%${searchTerm}%,` +
        `author.ilike.%${searchTerm}%,` +
        `description.ilike.%${searchTerm}%,` +
        `index_text.ilike.%${searchTerm}%`
      );
    }

    // Aplicar filtros estruturados

    // Filtro: Tipo de Conteúdo
    if (content_type) {
      query = query.eq('content_type', content_type);
    }

    // Filtro: Intercessor
    if (intercessor) {
      query = query.contains('intercessors', [intercessor]);
    }

    // Filtro: Uso Pastoral
    if (pastoral_use) {
      query = query.contains('pastoral_uses', [pastoral_use]);
    }

    // Filtro: Editora
    if (publisher) {
      query = query.ilike('publisher', `%${publisher}%`);
    }

    // Filtro: Ano (range)
    if (year_min) {
      query = query.gte('year', parseInt(year_min));
    }
    if (year_max) {
      query = query.lte('year', parseInt(year_max));
    }

    // Ordenação e paginação
    const { data, error, count } = await query
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
      },
      filters: {
        query: q,
        content_type,
        intercessor,
        pastoral_use,
        publisher,
        year_range: year_min || year_max ? { min: year_min, max: year_max } : null
      }
    });
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao realizar busca'
    });
  }
}

/**
 * Obter opções de filtros disponíveis
 * Retorna valores únicos para popular os filtros no frontend
 */
export async function getFilterOptions(req, res) {
  try {
    // Buscar todos os livros de catálogos públicos
    const { data: books, error } = await supabase
      .from('books')
      .select(`
        content_type,
        intercessors,
        pastoral_uses,
        publisher,
        year,
        catalog:catalogs!inner(is_public)
      `)
      .eq('catalog.is_public', true);

    if (error) throw error;

    // Processar dados para extrair valores únicos
    const contentTypes = new Set();
    const intercessors = new Set();
    const pastoralUses = new Set();
    const publishers = new Set();
    let minYear = Infinity;
    let maxYear = -Infinity;

    books.forEach(book => {
      if (book.content_type) contentTypes.add(book.content_type);

      if (Array.isArray(book.intercessors)) {
        book.intercessors.forEach(i => intercessors.add(i));
      }

      if (Array.isArray(book.pastoral_uses)) {
        book.pastoral_uses.forEach(p => pastoralUses.add(p));
      }

      if (book.publisher) publishers.add(book.publisher);

      if (book.year) {
        minYear = Math.min(minYear, book.year);
        maxYear = Math.max(maxYear, book.year);
      }
    });

    res.json({
      success: true,
      data: {
        contentTypes: Array.from(contentTypes).sort(),
        intercessors: Array.from(intercessors).sort(),
        pastoralUses: Array.from(pastoralUses).sort(),
        publishers: Array.from(publishers).sort(),
        yearRange: {
          min: minYear === Infinity ? null : minYear,
          max: maxYear === -Infinity ? null : maxYear
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar opções de filtros:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar opções de filtros'
    });
  }
}
