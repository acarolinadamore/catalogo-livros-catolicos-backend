# Configuração do Supabase Storage para Upload de Capas

## Problema Identificado
O bucket `book-covers` precisa de políticas adequadas para permitir:
1. Upload de imagens (INSERT)
2. Leitura pública de URLs (SELECT)

## Passo a Passo para Corrigir

### 1. Acessar o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Selecione seu projeto
- No menu lateral, clique em **Storage**

### 2. Configurar o Bucket como Público
- Clique no bucket `book-covers`
- Clique nos 3 pontinhos (⋮) ao lado do nome do bucket
- Selecione **Edit bucket**
- Marque a opção **Public bucket**
- Clique em **Save**

### 3. Remover Políticas Antigas
- Ainda na tela do bucket `book-covers`, clique em **Policies**
- Delete a política existente "Allow uploads 179dn28_0"

### 4. Criar Nova Política de Upload (INSERT)
- Clique em **New Policy**
- Selecione **For full customization, create a policy from scratch**
- Preencha:
  - **Policy name**: `Allow public uploads to book-covers`
  - **Allowed operation**: Marque apenas **INSERT**
  - **Target roles**: `public`
  - **USING expression**: `true`
  - **WITH CHECK expression**: `bucket_id = 'book-covers'`
- Clique em **Review** e depois **Save policy**

### 5. Criar Nova Política de Leitura (SELECT)
- Clique em **New Policy** novamente
- Selecione **For full customization, create a policy from scratch**
- Preencha:
  - **Policy name**: `Allow public reads from book-covers`
  - **Allowed operation**: Marque apenas **SELECT**
  - **Target roles**: `public`
  - **USING expression**: `bucket_id = 'book-covers'`
- Clique em **Review** e depois **Save policy**

### 6. (Opcional) Política de Atualização (UPDATE)
Se quiser permitir substituir imagens:
- Clique em **New Policy**
- Selecione **For full customization, create a policy from scratch**
- Preencha:
  - **Policy name**: `Allow public updates to book-covers`
  - **Allowed operation**: Marque apenas **UPDATE**
  - **Target roles**: `public`
  - **USING expression**: `bucket_id = 'book-covers'`
  - **WITH CHECK expression**: `bucket_id = 'book-covers'`
- Clique em **Review** e depois **Save policy**

### 7. (Opcional) Política de Exclusão (DELETE)
Se quiser permitir deletar imagens:
- Clique em **New Policy**
- Selecione **For full customization, create a policy from scratch**
- Preencha:
  - **Policy name**: `Allow public deletes from book-covers`
  - **Allowed operation**: Marque apenas **DELETE**
  - **Target roles**: `public`
  - **USING expression**: `bucket_id = 'book-covers'`
- Clique em **Review** e depois **Save policy**

## Verificação Final

Após configurar as políticas, você deve ter:
- ✅ Bucket `book-covers` configurado como **público**
- ✅ Política para INSERT (upload)
- ✅ Política para SELECT (leitura)

## Teste Rápido via SQL Editor

Para verificar se as políticas estão corretas, você pode executar no **SQL Editor**:

```sql
-- Ver todas as políticas do storage
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Ver configuração do bucket
SELECT * FROM storage.buckets WHERE name = 'book-covers';
```

O bucket deve ter `public = true`.

## Alternativa: Criar Políticas via SQL

Se preferir criar as políticas via SQL, execute no **SQL Editor**:

```sql
-- Tornar o bucket público
UPDATE storage.buckets
SET public = true
WHERE name = 'book-covers';

-- Política de upload
CREATE POLICY "Allow public uploads to book-covers"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'book-covers');

-- Política de leitura
CREATE POLICY "Allow public reads from book-covers"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'book-covers');

-- Política de atualização (opcional)
CREATE POLICY "Allow public updates to book-covers"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'book-covers')
WITH CHECK (bucket_id = 'book-covers');

-- Política de exclusão (opcional)
CREATE POLICY "Allow public deletes from book-covers"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'book-covers');
```

## Após Aplicar as Configurações

1. Teste o upload de uma capa no formulário de cadastro
2. Verifique se a imagem aparece corretamente no catálogo
3. Se ainda houver erro, verifique o console do navegador para mais detalhes
