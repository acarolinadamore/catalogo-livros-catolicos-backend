# Biblioteca Católica - Backend

Backend da plataforma de catalogação de livros religiosos católicos.

## Tecnologias

- Node.js
- Express
- Supabase (PostgreSQL)

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:

```env
PORT=3000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
NODE_ENV=development
```

### 3. Configurar banco de dados

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em SQL Editor
3. Execute o conteúdo do arquivo `supabase-schema.sql`

### 4. Popular banco com dados de exemplo

```bash
npm run seed
```

## Executar

### Desenvolvimento (com hot reload)

```bash
npm run dev
```

### Produção

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## Endpoints da API

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
  - Query params:
    - `q` - Termo de busca
    - `content_type` - Filtro por tipo de conteúdo
    - `intercessor` - Filtro por intercessor
    - `pastoral_use` - Filtro por uso pastoral
    - `publisher` - Filtro por editora
    - `year_min` / `year_max` - Filtro por ano
    - `limit` / `offset` - Paginação

- `GET /api/search/filters` - Opções de filtros disponíveis

## Deploy no Render

1. Crie uma conta no Render: https://render.com
2. Conecte seu repositório GitHub
3. Crie um novo Web Service
4. Configure as variáveis de ambiente
5. Deploy automático!

## Estrutura do projeto

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Configuração do Supabase
│   ├── controllers/
│   │   ├── catalogController.js  # Lógica de catálogos
│   │   ├── bookController.js     # Lógica de livros
│   │   └── searchController.js   # Lógica de busca
│   ├── routes/
│   │   ├── catalogs.js           # Rotas de catálogos
│   │   ├── books.js              # Rotas de livros
│   │   └── search.js             # Rotas de busca
│   ├── db/
│   │   └── seed.js               # Seed data
│   └── server.js                 # Servidor Express
├── supabase-schema.sql           # Schema do banco
├── package.json
└── README.md
```

---

**Feito para a glória de Deus** ✝️
