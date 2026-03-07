# Configuração de Produção - Catálogo de Livros Católicos

## Problema Comum: "Erro ao fazer upload da imagem"

Se você está vendo este erro no console ao tentar cadastrar um livro em produção:
```
Erro no upload: Error: Erro ao fazer upload da imagem
```

É porque o **backend não está acessível** ou as **variáveis de ambiente não estão configuradas**.

---

## Passo a Passo para Deploy Completo

### 1️⃣ Deploy do Backend (Render.com - Recomendado)

#### A. Criar conta e novo Web Service
1. Acesse https://render.com e faça login
2. Clique em **New +** → **Web Service**
3. Conecte seu repositório: `https://github.com/acarolinadamore/catalogo-livros-catolicos-backend`

#### B. Configurações do Web Service
- **Name**: `catalogo-livros-backend` (ou outro nome)
- **Region**: Choose closest to you
- **Branch**: `master`
- **Root Directory**: deixe vazio
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (para teste)

#### C. Variáveis de Ambiente (Environment Variables)
Adicione as seguintes variáveis:

```
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://rrghucnqxuurknlhxifn.supabase.co
SUPABASE_ANON_KEY=sb_publishable_4p1VTn1pA5HxW94iewXRDA_LDZdTkrg
```

#### D. Deploy
1. Clique em **Create Web Service**
2. Aguarde o deploy (leva ~5 minutos)
3. Anote a URL gerada, será algo como: `https://catalogo-livros-backend.onrender.com`

---

### 2️⃣ Configurar Frontend no Vercel

#### A. Adicionar Variável de Ambiente
1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto `minha-biblioteca-catolica`
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:

```
Name: VITE_API_URL
Value: https://catalogo-livros-backend.onrender.com/api
```

**IMPORTANTE**: Substitua a URL pela URL real do seu backend no Render!

#### B. Redesploy
1. Vá em **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **Redeploy**
4. Aguarde o novo deploy

---

### 3️⃣ Verificar Configurações do Supabase Storage

Execute no **SQL Editor** do Supabase:

```sql
-- 1. Tornar bucket público
UPDATE storage.buckets
SET public = true
WHERE name = 'book-covers';

-- 2. Política de upload
CREATE POLICY "Allow public uploads to book-covers"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'book-covers');

-- 3. Política de leitura
CREATE POLICY "Allow public reads from book-covers"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'book-covers');
```

---

## Testando em Produção

### 1. Verificar Backend
Acesse a URL do backend no navegador:
```
https://catalogo-livros-backend.onrender.com/
```

Você deve ver:
```json
{
  "message": "Biblioteca Católica API",
  "version": "1.0.0",
  "status": "online"
}
```

### 2. Testar Upload
1. Acesse: https://minha-biblioteca-catolica.vercel.app/cadastrar
2. Abra o Console do navegador (F12)
3. Tente cadastrar um livro com imagem
4. Você verá logs detalhados:

```
Enviando imagem para: https://catalogo-livros-backend.onrender.com/api/upload/cover
Resposta do servidor: 200 OK
Upload bem-sucedido: { url: "...", fileName: "..." }
```

---

## Alternativas de Deploy para Backend

### Opção 2: Railway.app
1. Acesse https://railway.app
2. New Project → Deploy from GitHub repo
3. Selecione o repositório backend
4. Adicione as mesmas variáveis de ambiente
5. Railway gera URL automaticamente

### Opção 3: Heroku
1. Acesse https://heroku.com
2. Create new app
3. Connect to GitHub
4. Configure as variáveis de ambiente
5. Deploy

---

## Checklist de Deploy

- [ ] Backend deployado e acessível
- [ ] Variáveis de ambiente configuradas no backend (Render)
- [ ] Variável `VITE_API_URL` configurada no Vercel
- [ ] Frontend redesployado após configurar variável
- [ ] Bucket do Supabase configurado como público
- [ ] Políticas de Storage criadas (INSERT e SELECT)
- [ ] Teste de upload funcionando

---

## Troubleshooting

### "Failed to fetch" ou "Network Error"
- **Causa**: Backend não está rodando ou URL incorreta
- **Solução**: Verifique se a URL do backend está correta no Vercel

### "Erro ao fazer upload da imagem"
- **Causa**: Problema com Supabase Storage ou políticas
- **Solução**: Verifique as políticas do Storage e se o bucket é público

### CORS Error
- **Causa**: Backend não permite requisições do frontend
- **Solução**: Verifique se o CORS está configurado no backend (já está)

### "500 Internal Server Error"
- **Causa**: Erro no backend (variáveis de ambiente incorretas)
- **Solução**: Verifique os logs do Render e as variáveis de ambiente

---

## Monitoramento

### Logs do Backend (Render)
1. Acesse o Dashboard do Render
2. Clique no seu Web Service
3. Vá em **Logs**
4. Você verá os logs detalhados de cada requisição

### Logs do Frontend (Vercel)
1. Abra o Console do navegador (F12)
2. Tente a ação que está falhando
3. Veja os logs detalhados

---

## Custos

### Render (Backend)
- **Free Tier**: 750 horas/mês
- **Limitação**: App "dorme" após 15min de inatividade
- **Solução**: Upgrade para plan pago ($7/mês) ou usar serviço de ping

### Vercel (Frontend)
- **Free**: Ilimitado para projetos pessoais
- **Banda**: 100GB/mês

### Supabase (Database + Storage)
- **Free Tier**:
  - 500MB database
  - 1GB file storage
  - 50MB file uploads
- **Suficiente** para catálogo pequeno/médio
