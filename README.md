# 📚 Biblioteca Católica

**Plataforma de catalogação e consulta de livros religiosos católicos**

Sistema web completo para gerenciar e consultar acervos de livros católicos, com foco em busca avançada e filtros estruturados.

---

## 🙏 Sobre o Projeto

A Biblioteca Católica é uma plataforma digital desenvolvida para catalogar e disponibilizar o acervo pessoal de livros religiosos do **Pe. Carlos Alberto Pereira**, da Arquidiocese de Campo Grande – MS.

### Atuação Pastoral

- Paróquia Pessoal Nossa Senhora da Saúde (Capelania Hospitalar)
- Paróquia Imaculado Coração de Maria

---

## ✨ Funcionalidades

### Versão Atual (v1.0)

- ✅ **Catálogo público** acessível por link (sem necessidade de login)
- ✅ **Busca avançada** por título, autor e palavra-chave
- ✅ **Filtros estruturados**:
  - Tipo de Conteúdo (Bíblia, Teologia, Espiritualidade, etc)
  - Intercessor / Devoção (Jesus Cristo, Maria Santíssima, Santos, etc)
  - Uso Pastoral (Catequese, Formação, Capelania Hospitalar, etc)
  - Editora
  - Ano de Publicação (range)
- ✅ **Detalhes completos** de cada livro (capa, autor, índice, descrição)
- ✅ **Design sóbrio e pastoral** focado na experiência de busca

### Futuro (Planejado, não implementado)

- 🔜 Sistema de login e autenticação
- 🔜 Cadastro de usuários
- 🔜 Níveis de permissão (Admin, Editor, Leitor)
- 🔜 Edição e cadastro de livros via interface
- 🔜 Múltiplos catálogos (outros padres, paróquias, bibliotecas)
- 🔜 Upload de capa e índice via IA

---

## 🏗️ Arquitetura

```
catalogo-livros-catolicos/
├── backend/              # API Node.js + Express + Supabase
│   ├── src/
│   │   ├── config/      # Configuração do Supabase
│   │   ├── controllers/ # Lógica de negócio
│   │   ├── routes/      # Rotas da API
│   │   ├── db/          # Seeds e utilitários
│   │   └── server.js    # Servidor Express
│   ├── supabase-schema.sql
│   └── package.json
│
└── frontend/             # React + Vite + TailwindCSS
    ├── src/
    │   ├── components/  # Componentes React
    │   ├── pages/       # Páginas da aplicação
    │   ├── config/      # Configuração da API
    │   └── main.jsx     # Entry point
    ├── index.html
    └── package.json
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd catalogo-livros-catolicos
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Copie `.env.example` para `.env` e configure:

```env
PORT=3000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
NODE_ENV=development
```

**Configurar banco de dados:**

1. Acesse https://app.supabase.com
2. Crie um projeto (ou use existente)
3. Vá em SQL Editor
4. Execute o conteúdo de `supabase-schema.sql`
5. Execute o seed: `npm run seed`

**Iniciar backend:**

```bash
npm run dev
```

Backend rodando em `http://localhost:3000`

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Copie `.env.example` para `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

**Iniciar frontend:**

```bash
npm run dev
```

Frontend rodando em `http://localhost:5173`

---

## 🌐 Deploy

### Backend (Render)

1. Crie conta no Render: https://render.com
2. Conecte seu repositório GitHub
3. Crie novo **Web Service**
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Adicione variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (URL do Vercel)
6. Deploy!

### Frontend (Vercel)

1. Crie conta no Vercel: https://vercel.com
2. Conecte seu repositório GitHub
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Adicione variável de ambiente:
   - `VITE_API_URL`: URL da API no Render
5. Deploy!

---

## 🎨 Design e Estilo

### Princípios

- Moderno, mas sóbrio
- Inspirado em bibliotecas e ambiente pastoral
- **Foco absoluto na busca** (elemento principal da UI)
- Tipografia legível e confortável
- Ícones discretos com temática religiosa

### Paleta de Cores

- **Primary**: Roxo/violeta pastoral (`#8b5cf6`)
- **Background**: Cinza muito claro (`#f9fafb`)
- **Texto**: Cinza escuro para boa legibilidade

### Tipografia

- **Interface**: Inter (sans-serif)
- **Títulos e conteúdo**: Merriweather (serif)

---

## 📊 Estrutura do Banco de Dados

### Tabela: `catalogs`

- `id` (UUID)
- `name` (VARCHAR)
- `slug` (VARCHAR, único)
- `description` (TEXT)
- `is_public` (BOOLEAN)
- `created_at`, `updated_at`

### Tabela: `books`

- `id` (UUID)
- `catalog_id` (UUID, FK)
- `title`, `author`, `publisher`, `year`
- `content_type` (VARCHAR) - Tipo estruturado
- `intercessors` (TEXT[]) - Array de intercessores
- `pastoral_uses` (TEXT[]) - Array de usos pastorais
- `index_text` (TEXT) - Índice do livro
- `description` (TEXT)
- `cover_image_url` (TEXT)
- `created_at`, `updated_at`

**Índices:**
- Full Text Search em `title`, `author`, `description`, `index_text`
- Índices em `content_type`, `year`, `catalog_id`

---

## 📖 API Endpoints

### Catálogos

- `GET /api/catalogs` - Listar catálogos públicos
- `GET /api/catalogs/:slug` - Buscar catálogo por slug
- `GET /api/catalogs/:slug/books` - Livros de um catálogo

### Livros

- `GET /api/books` - Listar todos os livros
- `GET /api/books/recent` - Livros recentes
- `GET /api/books/:id` - Buscar livro por ID

### Busca

- `GET /api/search` - Busca avançada
  - Query params: `q`, `content_type`, `intercessor`, `pastoral_use`, `publisher`, `year_min`, `year_max`
- `GET /api/search/filters` - Opções de filtros disponíveis

---

## 🛠️ Tecnologias Utilizadas

### Backend

- Node.js
- Express
- Supabase (PostgreSQL)
- CORS
- dotenv

### Frontend

- React 18
- Vite
- TailwindCSS
- React Router
- Google Fonts (Inter, Merriweather)

### Infraestrutura

- Supabase (Banco de dados)
- Render (Backend API)
- Vercel (Frontend)

---

## 📝 Dados de Exemplo

O sistema vem com seed data contendo 12 livros católicos clássicos:

- Bíblia Sagrada (CNBB)
- Introdução à Vida Devota (São Francisco de Sales)
- Tratado da Verdadeira Devoção (São Luís de Montfort)
- História de uma Alma (Santa Teresinha)
- Confissões (Santo Agostinho)
- Imitação de Cristo (Tomás de Kempis)
- Catecismo da Igreja Católica
- Suma Teológica (São Tomás de Aquino)
- Exercícios Espirituais (Santo Inácio)
- E outros...

---

## 👨‍💻 Desenvolvimento

### Padrões de Código

- **Backend**: ESM modules, async/await, separação em camadas (routes, controllers)
- **Frontend**: Componentes funcionais React, hooks, separação de responsabilidades
- **Comentários**: Código limpo com comentários explicativos em português

### Boas Práticas

- Separação clara entre frontend e backend
- Arquitetura escalável para futuras funcionalidades
- Row Level Security (RLS) no Supabase
- Filtros estruturados (não tags genéricas)
- Busca otimizada com Full Text Search

---

## 📄 Licença

Este projeto foi desenvolvido para fins pastorais.

**Nota sobre Direitos Autorais:**
Este catálogo tem finalidade exclusivamente informativa. Não disponibilizamos textos completos.
Todas as obras são propriedade de suas respectivas editoras e autores.

---

## ✝️ Rodapé

**Biblioteca Católica** – Plataforma de catalogação e consulta de livros religiosos católicos.

**Feito para a glória de Deus.**

---

## 📞 Contato

Para mais informações, contate:

- Paróquia Imaculado Coração de Maria
- Capelania Hospitalar Nossa Senhora da Saúde
- Campo Grande – MS

---

**Ad Maiorem Dei Gloriam** 🙏
