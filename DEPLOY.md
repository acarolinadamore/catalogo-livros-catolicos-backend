# 🚀 Guia de Deploy - Biblioteca Católica

Este guia explica passo a passo como fazer o deploy completo do sistema.

---

## 📋 Visão Geral

- **Banco de Dados**: Supabase (PostgreSQL)
- **Backend API**: Render (Web Service)
- **Frontend**: Vercel

---

## 1️⃣ Supabase (Banco de Dados)

### Criar Projeto

1. Acesse https://app.supabase.com
2. Faça login ou crie uma conta (gratuita)
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: biblioteca-catolica
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: South America)
5. Clique em **"Create new project"**
6. Aguarde a criação (1-2 minutos)

### Executar Schema

1. No painel do projeto, vá em **"SQL Editor"** (menu lateral)
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `backend/supabase-schema.sql`
4. Cole no editor
5. Clique em **"Run"** (ou F5)
6. Aguarde a mensagem de sucesso

### Obter Credenciais

1. Vá em **"Settings"** (ícone de engrenagem) > **"API"**
2. Copie e anote:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon / public key**: `eyJhbGciOi...` (chave grande)

---

## 2️⃣ Render (Backend API)

### Preparar Repositório

1. Faça commit de todo o código no GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Biblioteca Católica"
   git branch -M main
   git remote add origin <sua-url-do-github>
   git push -u origin main
   ```

### Criar Web Service

1. Acesse https://render.com
2. Faça login com GitHub
3. Clique em **"New +"** > **"Web Service"**
4. Conecte seu repositório
5. Configure:

   **Básico:**
   - **Name**: biblioteca-catolica-api
   - **Region**: escolha próxima (ex: Ohio/Oregon)
   - **Branch**: main
   - **Root Directory**: `backend`

   **Build:**
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

   **Plano:**
   - Escolha **"Free"** (gratuito)

6. Clique em **"Advanced"**

### Adicionar Variáveis de Ambiente

Clique em **"Add Environment Variable"** e adicione:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `SUPABASE_URL` | (cole a URL do Supabase) |
| `SUPABASE_ANON_KEY` | (cole a chave anon do Supabase) |
| `FRONTEND_URL` | `https://seu-dominio.vercel.app` (deixe vazio por ora) |

7. Clique em **"Create Web Service"**
8. Aguarde o deploy (3-5 minutos)
9. **Anote a URL da API**: `https://biblioteca-catolica-api.onrender.com`

### Popular o Banco (Seed)

**Opção 1: Via terminal local**

```bash
cd backend
npm install
# Configure o .env com as credenciais do Supabase
npm run seed
```

**Opção 2: Via Shell do Render**

1. No painel do Render, vá em **"Shell"**
2. Execute:
   ```bash
   npm run seed
   ```

---

## 3️⃣ Vercel (Frontend)

### Criar Projeto

1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New..."** > **"Project"**
4. Selecione seu repositório
5. Clique em **"Import"**

### Configurar Projeto

**Framework Preset:** Vite (detectado automaticamente)

**Root Directory:**
- Clique em **"Edit"**
- Digite: `frontend`

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`

### Adicionar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://biblioteca-catolica-api.onrender.com/api` |

(Use a URL do Render que você anotou)

### Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. **Anote a URL do frontend**: `https://biblioteca-catolica.vercel.app`

### Atualizar CORS no Backend

1. Volte ao Render
2. Vá em **"Environment"**
3. Edite a variável `FRONTEND_URL`
4. Cole a URL do Vercel: `https://biblioteca-catolica.vercel.app`
5. Salve (o backend vai redeployar automaticamente)

---

## 4️⃣ Testar o Sistema

### Verificar API

1. Acesse: `https://biblioteca-catolica-api.onrender.com`
2. Deve retornar JSON com informações da API

### Verificar Frontend

1. Acesse: `https://biblioteca-catolica.vercel.app`
2. Deve carregar a página inicial
3. Teste a busca
4. Teste os filtros
5. Clique em um livro
6. Acesse a página "Sobre"

---

## 🔄 Atualizações Futuras

### Deploy Automático

Ambos Render e Vercel fazem **deploy automático** quando você faz push no GitHub:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

- **Frontend (Vercel)**: deploya em ~2 minutos
- **Backend (Render)**: deploya em ~3-5 minutos

### Monitorar Logs

**Render:**
- Vá no dashboard > Logs

**Vercel:**
- Vá no projeto > Deployments > Clique no deployment > Function Logs

---

## 🐛 Troubleshooting

### Frontend não carrega livros

- Verifique se a variável `VITE_API_URL` está correta
- Abra o Console do navegador (F12) e veja erros
- Teste a API diretamente no navegador

### Erro de CORS

- Verifique se `FRONTEND_URL` está configurada no Render
- URL deve ser exata (sem barra final)

### Banco de dados vazio

- Execute o seed: `npm run seed` no backend
- Verifique se o schema foi executado corretamente no Supabase

### API não conecta com Supabase

- Verifique as credenciais (`SUPABASE_URL` e `SUPABASE_ANON_KEY`)
- Verifique se o projeto Supabase não foi pausado

---

## 💰 Custos

Todos os serviços têm planos gratuitos generosos:

- **Supabase Free**: 500 MB storage, 2 GB bandwidth/mês
- **Render Free**: 750 horas/mês (suficiente para 1 serviço 24/7)
- **Vercel Free**: 100 GB bandwidth/mês, builds ilimitados

**Ideal para projetos pequenos/médios!**

---

## 🎯 Próximos Passos

1. ✅ Sistema no ar!
2. 📊 Monitore uso e performance
3. 📚 Adicione mais livros ao catálogo
4. 🎨 Personalize conforme necessário
5. 🔐 Implemente login (futuro)

---

## 📞 Suporte

Se tiver dúvidas:

- Documentação Supabase: https://supabase.com/docs
- Documentação Render: https://render.com/docs
- Documentação Vercel: https://vercel.com/docs

---

**Feito para a glória de Deus** ✝️
