-- =====================================================
-- POLÍTICAS PARA PERMITIR INSERT/UPDATE/DELETE
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- para permitir cadastro, edição e exclusão de livros

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir INSERT público em catálogos" ON catalogs;
DROP POLICY IF EXISTS "Permitir UPDATE público em catálogos" ON catalogs;
DROP POLICY IF EXISTS "Permitir DELETE público em catálogos" ON catalogs;
DROP POLICY IF EXISTS "Permitir INSERT público em livros" ON books;
DROP POLICY IF EXISTS "Permitir UPDATE público em livros" ON books;
DROP POLICY IF EXISTS "Permitir DELETE público em livros" ON books;

-- Permitir INSERT em catálogos (publicamente)
CREATE POLICY "Permitir INSERT público em catálogos"
  ON catalogs FOR INSERT
  TO public
  WITH CHECK (true);

-- Permitir UPDATE em catálogos (publicamente)
CREATE POLICY "Permitir UPDATE público em catálogos"
  ON catalogs FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Permitir DELETE em catálogos (publicamente)
CREATE POLICY "Permitir DELETE público em catálogos"
  ON catalogs FOR DELETE
  TO public
  USING (true);

-- Permitir INSERT em livros (publicamente)
CREATE POLICY "Permitir INSERT público em livros"
  ON books FOR INSERT
  TO public
  WITH CHECK (true);

-- Permitir UPDATE em livros (publicamente)
CREATE POLICY "Permitir UPDATE público em livros"
  ON books FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Permitir DELETE em livros (publicamente)
CREATE POLICY "Permitir DELETE público em livros"
  ON books FOR DELETE
  TO public
  USING (true);

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('catalogs', 'books')
ORDER BY tablename, cmd;
