-- =====================================================
-- BIBLIOTECA CATÓLICA - SCHEMA DO BANCO DE DADOS
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- https://app.supabase.com/project/_/sql

-- Tabela de Catálogos
-- Permite múltiplos catálogos no futuro (diferentes padres, paróquias, etc)
CREATE TABLE IF NOT EXISTS catalogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Livros
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id UUID REFERENCES catalogs(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255),
  publisher VARCHAR(255),
  year INTEGER,

  -- Categorização estruturada
  content_type VARCHAR(100), -- Bíblia, Teologia, Espiritualidade, etc
  intercessors TEXT[], -- Array de intercessores: Jesus Cristo, Maria Santíssima, etc
  pastoral_uses TEXT[], -- Array de usos pastorais: Catequese infantil, etc

  -- Conteúdo textual
  index_text TEXT, -- Índice do livro (para busca)
  description TEXT,

  -- Imagem
  cover_image_url TEXT,

  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para otimizar buscas
CREATE INDEX IF NOT EXISTS idx_books_catalog_id ON books(catalog_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('portuguese', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON books USING gin(to_tsvector('portuguese', author));
CREATE INDEX IF NOT EXISTS idx_books_description ON books USING gin(to_tsvector('portuguese', description));
CREATE INDEX IF NOT EXISTS idx_books_index_text ON books USING gin(to_tsvector('portuguese', index_text));
CREATE INDEX IF NOT EXISTS idx_books_content_type ON books(content_type);
CREATE INDEX IF NOT EXISTS idx_books_year ON books(year);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_catalogs_updated_at BEFORE UPDATE ON catalogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de acesso (Row Level Security)
-- Por enquanto, acesso público para leitura

ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública de catálogos públicos
CREATE POLICY "Catálogos públicos são visíveis para todos"
  ON catalogs FOR SELECT
  USING (is_public = true);

-- Permitir leitura pública de livros de catálogos públicos
CREATE POLICY "Livros de catálogos públicos são visíveis para todos"
  ON books FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = books.catalog_id
      AND catalogs.is_public = true
    )
  );

-- Comentários nas tabelas para documentação
COMMENT ON TABLE catalogs IS 'Catálogos de livros - permite múltiplos acervos no futuro';
COMMENT ON TABLE books IS 'Livros catalogados com informações bibliográficas e pastorais';

COMMENT ON COLUMN books.content_type IS 'Tipo: Bíblia, Teologia, Espiritualidade, Catequese, Liturgia, História da Igreja, Doutrina Social, Vida de Santos, Documentos da Igreja';
COMMENT ON COLUMN books.intercessors IS 'Array de intercessores: Jesus Cristo, Espírito Santo, Maria Santíssima, São José, Santos';
COMMENT ON COLUMN books.pastoral_uses IS 'Array de usos: Uso pessoal, Catequese infantil, Catequese adulta, Formação de adultos, Formação sacerdotal, Capelania Hospitalar, Liturgia';
