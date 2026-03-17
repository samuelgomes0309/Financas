<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge" alt="Licença" />
</p>

# 💰 FinançasGomes — Sistema de Controle Financeiro

Sistema fullstack para gerenciamento de finanças pessoais com **API REST** e **painel web interativo**. Controle suas receitas, despesas e saldo com autenticação segura e filtros por período. Desenvolvido por **Samuel Gomes da Silva**.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
</p>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Stack Tecnológica](#-stack-tecnológica)
- [Modelos de Dados](#-modelos-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Monorepo](#-estrutura-do-monorepo)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Fluxo da Transação](#-fluxo-da-transação)
- [Documentação Detalhada](#-documentação-detalhada)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Visão Geral

O **FinançasGomes** é um ecossistema completo para controle financeiro pessoal, dividido em duas aplicações integradas:

| Aplicação    | Público-Alvo    | Função                                                                         |
| ------------ | --------------- | ------------------------------------------------------------------------------ |
| **Backend**  | API central     | Gerencia autenticação, transações, saldo e balanço financeiro                  |
| **Frontend** | Usuários finais | Painel web para cadastro, login, dashboard financeiro e registro de transações |

### Fluxo de Operação

```
  👤 USUÁRIO (Web)                                🔧 API (Backend)
  ┌──────────────────────┐                     ┌──────────────────────┐
  │ • Cadastro / Login   │                     │ • PostgreSQL         │
  │ • Dashboard com saldo│ ──────────────────▶ │ • Prisma ORM         │
  │ • Registra receitas  │                     │ • JWT Auth           │
  │ • Registra despesas  │ ◀────────────────── │ • Transações atômicas│
  │ • Filtra por período │                     │ • Cálculo automático │
  │ • Exclui transações  │                     │   de saldo           │
  └──────────────────────┘                     └──────────────────────┘
            ▲                                          │
            │              REST API (HTTP)             │
            └──────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura do Sistema

```
                    ┌─────────────────────────────┐
                    │       PostgreSQL Database     │
                    │  (users, transactions)        │
                    └──────────────┬───────────────┘
                                   │ Prisma ORM
                    ┌──────────────▼───────────────┐
                    │     Backend (Node/Express)    │
                    │         Porta: 3333           │
                    │                               │
                    │  ┌─────────┐  ┌───────────┐  │
                    │  │ Routes  │→ │Controllers│  │
                    │  └─────────┘  └─────┬─────┘  │
                    │                     │        │
                    │               ┌─────▼─────┐  │
                    │               │ Services  │  │
                    │               └─────┬─────┘  │
                    │                     │        │
                    │               ┌─────▼─────┐  │
                    │               │  Prisma   │  │
                    │               └───────────┘  │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │     Frontend (Web)            │
                    │     React + Vite              │
                    │     Porta: 5173               │
                    │                               │
                    │  • Login / Cadastro           │
                    │  • Dashboard (saldo + lista)  │
                    │  • Registro de transações     │
                    │  • Perfil do usuário          │
                    └──────────────────────────────┘
```

### Padrão Arquitetural (Backend)

O backend segue o padrão **MVC adaptado** com camadas bem definidas:

```
┌─────────────────────────────────────────────┐
│                  HTTP Request               │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│              routes.ts                      │
│  Define as rotas e aplica middlewares       │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│          isAuthenticated (middleware)       │
│  Verifica JWT e injeta user_id no request   │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│              Controller                     │
│  Extrai dados do request (body/query)       │
│  Chama o Service e retorna a resposta HTTP  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│               Service                       │
│  Toda a regra de negócio fica aqui          │
│  Validações, cálculos e operações no banco  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│            PrismaClient                     │
│  Acesso ao banco de dados PostgreSQL        │
└─────────────────────────────────────────────┘
```

### Padrão Arquitetural (Frontend)

O frontend segue uma arquitetura baseada em **Pages + Components + Context**:

```
┌─────────────────────────────────────────────────┐
│               Ação do Usuário                   │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              React Router                       │
│  Resolve a rota e aplica o Guard (Private/Public)│
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              Página (Page)                      │
│  Renderiza layout (Sidebar + Header + Conteúdo) │
│  Gerencia estado local e chama a API            │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│          AuthContext / Axios (api.ts)           │
│  Context para dados do usuário                  │
│  Axios para chamadas HTTP ao backend            │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│           Backend REST (Express)                │
│  Processa a requisição e retorna resposta       │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Stack Tecnológica

### Backend

| Tecnologia           | Versão | Função                                |
| -------------------- | ------ | ------------------------------------- |
| Node.js              | ≥ 18   | Runtime JavaScript                    |
| TypeScript           | 5.9    | Tipagem estática                      |
| Express              | 4.18.2 | Framework HTTP                        |
| Prisma               | 6      | ORM com type-safety                   |
| PostgreSQL           | latest | Banco de dados relacional             |
| JWT (jsonwebtoken)   | 9.0.2  | Autenticação via token                |
| bcryptjs             | 3.0.2  | Hash de senhas                        |
| date-fns             | 4.1.0  | Manipulação de datas                  |
| express-async-errors | 3.1.1  | Propagação automática de erros async  |
| dotenv               | 17.3.1 | Carregamento de variáveis de ambiente |
| cors                 | 2.8.5  | Liberação de origens cruzadas         |

### Frontend

| Tecnologia      | Versão  | Função                    |
| --------------- | ------- | ------------------------- |
| React           | 19.1.1  | Biblioteca de UI          |
| TypeScript      | 5.9     | Tipagem estática          |
| Vite            | 7.1.7   | Build tool com HMR        |
| Tailwind CSS    | 4.1.16  | Estilização utility-first |
| React Router    | 7.9.5   | Roteamento SPA            |
| React Hook Form | 7.66.0  | Formulários performáticos |
| Zod             | 4.1.12  | Validação de schemas      |
| Axios           | 1.13.1  | Cliente HTTP              |
| Day.js          | 1.11.19 | Manipulação leve de datas |
| React Calendar  | 6.0.0   | Componente de calendário  |
| React Hot Toast | 2.6.0   | Notificações toast        |
| Lucide React    | 0.552.0 | Ícones SVG                |
| ESLint          | 9.39.0  | Linter de código          |
| Prettier        | 3.6.2   | Formatação automática     |

---

## 🗄️ Modelos de Dados

O banco de dados PostgreSQL contém 2 tabelas gerenciadas pelo Prisma:

```
┌─────────────────────────┐       ┌──────────────────────────────┐
│         users           │       │        transactions           │
├─────────────────────────┤       ├──────────────────────────────┤
│ id          UUID (PK)   │◄──┐   │ id          UUID (PK)        │
│ name        String      │   │   │ description String           │
│ email       String (UQ) │   │   │ value       Float            │
│ password    String      │   │   │ type        String           │
│ balance     Float       │   └───│ user_id     UUID (FK)        │
│ createAt    DateTime?   │       │ date        String           │
│ updatedAt   DateTime?   │       │ createdAt   DateTime?        │
└─────────────────────────┘       │ updatedAt   DateTime?        │
                                  └──────────────────────────────┘
```

### Relacionamentos

| Relação             | Tipo | Descrição                                   |
| ------------------- | ---- | ------------------------------------------- |
| User → Transactions | 1:N  | Cada usuário possui zero ou mais transações |

### Campos Importantes

| Campo     | Modelo       | Descrição                                                |
| --------- | ------------ | -------------------------------------------------------- |
| `balance` | User         | Saldo atual, atualizado automaticamente a cada transação |
| `type`    | Transactions | `"revenue"` (receita) ou `"expense"` (despesa)           |
| `value`   | Transactions | Valor sempre positivo (Float)                            |
| `date`    | Transactions | Período no formato `YYYY-MM` (ex: `"2026-03"`)           |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Cadastro de usuários com hash bcryptjs (salt: 8)
- Login com geração de token JWT (expiração: 30 dias)
- Middleware `isAuthenticated` protege todas as rotas privadas
- Mensagem genérica em login inválido para evitar enumeração de usuários
- Validação automática do token ao abrir a aplicação (persistido no `localStorage`)

### 💸 Transações

- Criação de transações com descrição, valor, tipo e data
- Tipos: `revenue` (receita) e `expense` (despesa)
- Atualização **atômica** do saldo via `prisma.$transaction`
- Exclusão com estorno automático do valor no saldo do usuário
- Listagem filtrada por período (`YYYY-MM`)
- Validação: valor não pode ser negativo

### 📊 Dashboard

- Cards de resumo: **saldo atual**, **total de receitas** e **total de despesas**
- Listagem de transações do período com ícone e cor por tipo
- Filtro por mês/ano via modal com calendário interativo
- Exclusão de transações diretamente na listagem

### 👤 Perfil

- Exibição dos dados do usuário autenticado (nome e email)

### 📝 Registro de Transações

- Formulário com validação em tempo real (Zod + React Hook Form)
- Seleção visual do tipo (receita/despesa) via cards
- Conversão automática de separador decimal (vírgula → ponto)
- Feedback via toast notifications

---

## 📁 Estrutura do Monorepo

```
finanças/
│
├── 📄 README.md                  ← Você está aqui
├── 📄 LICENSE                    ← Licença MIT
│
├── 📂 backend/                   ← API REST (Node.js + Express)
│   ├── prisma/                   ← Schema e migrations do Prisma
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts             ← Ponto de entrada (porta 3333)
│   │   ├── routes.ts             ← Definição de todas as rotas
│   │   ├── @types/               ← Extensão de tipos do Express
│   │   │   └── express/index.d.ts
│   │   ├── middlewares/
│   │   │   └── isAuthenticated.ts  ← Middleware JWT
│   │   ├── controllers/
│   │   │   ├── user/             ← CreateUser, AuthUser, DetailUser, ListBalance
│   │   │   └── transaction/      ← CreateTransaction, ListTransaction, DeleteTransaction
│   │   ├── services/
│   │   │   ├── user/             ← CreateUser, AuthUser, DetailUser, ListBalance
│   │   │   └── transaction/      ← CreateTransaction, ListTransaction, DeleteTransaction
│   │   ├── prisma/
│   │   │   └── index.ts          ← PrismaClient singleton
│   │   └── generated/prisma/     ← Client Prisma gerado
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma.config.ts
│   └── README.md
│
├── 📂 frontend/                  ← Painel Web (React + Vite)
│   └── src/
│       ├── App.tsx               ← Router com createBrowserRouter
│       ├── App.css               ← Tema Tailwind customizado
│       ├── main.tsx              ← AuthProvider + Toaster + RouterProvider
│       ├── api/
│       │   └── api.ts            ← Instância Axios configurada
│       ├── contexts/
│       │   └── authContext.tsx    ← AuthContext (login, signup, logout, validação)
│       ├── routes/
│       │   ├── PrivateRoute.tsx  ← Guard para rotas autenticadas
│       │   ├── PublicRoute.tsx   ← Guard para rotas públicas
│       │   └── components/
│       │       └── routerLoader.tsx  ← Spinner de carregamento
│       ├── pages/
│       │   ├── dashboard/        ← Saldo, transações, filtro por período
│       │   │   ├── index.tsx
│       │   │   └── components/
│       │   │       ├── cardBalance.tsx
│       │   │       ├── cardItem.tsx
│       │   │       └── filterModal.tsx
│       │   ├── login/            ← Login e cadastro
│       │   │   ├── index.tsx
│       │   │   ├── schema.ts
│       │   │   ├── signin/index.tsx
│       │   │   ├── signup/index.tsx
│       │   │   └── components/
│       │   │       ├── headerMsg.tsx
│       │   │       ├── inputForm.tsx
│       │   │       ├── labelMsg.tsx
│       │   │       └── footerMsg.tsx
│       │   ├── register/         ← Criação de transações
│       │   │   ├── index.tsx
│       │   │   ├── schema.ts
│       │   │   └── components/
│       │   │       ├── cardTypeReg.tsx
│       │   │       ├── inputReg.tsx
│       │   │       └── labelReg.tsx
│       │   └── profile/          ← Dados do usuário
│       │       └── index.tsx
│       └── components/
│           ├── header/index.tsx
│           ├── sidebar/
│           │   ├── index.tsx
│           │   └── components/itemLink.tsx
│           ├── errorMsg/index.tsx
│           └── submitBtn/index.tsx
│
└── 📂 documentation/             ← Documentação detalhada
    ├── backend/
    │   ├── CONTEXTO.md           ← Arquitetura e decisões do backend
    │   └── ENDPOINTS.md          ← Referência completa de todos os endpoints
    └── frontend/
        └── CONTEXTO.md           ← Arquitetura e práticas do frontend
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Requisito           | Versão Mínima | Verificar Instalação               |
| ------------------- | :-----------: | ---------------------------------- |
| **Node.js**         |     18.x      | `node --version`                   |
| **npm** ou **yarn** |       —       | `npm --version` / `yarn --version` |
| **PostgreSQL**      |     13.x      | `psql --version`                   |
| **Git**             |       —       | `git --version`                    |

---

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/samuelgomes0309/financas.git
cd financas
```

### 2. Backend

```bash
cd backend

# Instalar dependências
yarn install  # ou npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/financas"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3333
```

> 💡 **Dica:** Gere um `JWT_SECRET` forte com:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

```bash
# Gerar client Prisma e rodar migrations
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
yarn dev
```

O backend estará rodando em `http://localhost:3333`.

### 3. Frontend

```bash
cd frontend

# Instalar dependências
yarn install  # ou npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_URL="http://localhost:3333"
```

```bash
# Iniciar servidor de desenvolvimento
yarn dev  # ou npm run dev
```

O frontend estará acessível em `http://localhost:5173`.

---

## ▶️ Executando o Projeto

### Inicialização Rápida (2 terminais)

**Terminal 1 — Backend:**

```bash
cd backend && yarn dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend && yarn dev
```

### Scripts Disponíveis

| Projeto  | Comando        | Descrição                                    |
| -------- | -------------- | -------------------------------------------- |
| Backend  | `yarn dev`     | Inicia servidor com hot-reload (ts-node-dev) |
| Frontend | `yarn dev`     | Inicia Vite dev server com HMR               |
| Frontend | `yarn build`   | Build de produção                            |
| Frontend | `yarn lint`    | Executa ESLint                               |
| Frontend | `yarn preview` | Preview do build                             |

---

## 📡 Endpoints da API

> Documentação completa em [documentation/backend/ENDPOINTS.md](documentation/backend/ENDPOINTS.md)

### Visão Geral

| Método   | Rota                   | Descrição                            | Auth |
| -------- | ---------------------- | ------------------------------------ | :--: |
| `POST`   | `/users/signup`        | Cadastrar usuário                    |  ❌  |
| `POST`   | `/users/session`       | Autenticar usuário (login)           |  ❌  |
| `GET`    | `/users/me`            | Dados do usuário logado              |  ✅  |
| `GET`    | `/users/balance`       | Balanço financeiro por período       |  ✅  |
| `POST`   | `/transactions/create` | Criar transação (receita ou despesa) |  ✅  |
| `GET`    | `/transactions`        | Listar transações por período        |  ✅  |
| `DELETE` | `/transactions/delete` | Excluir transação (com estorno)      |  ✅  |

### Exemplos Rápidos

#### Cadastro

```bash
curl -X POST http://localhost:3333/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com", "password": "senha123"}'
```

#### Login

```bash
curl -X POST http://localhost:3333/users/session \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "senha123"}'
```

#### Criar Transação

```bash
curl -X POST http://localhost:3333/transactions/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"description": "Salário", "value": 5000.00, "type": "revenue", "date": "2026-03"}'
```

#### Listar Transações

```bash
curl -X GET "http://localhost:3333/transactions?date=2026-03" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🔑 Variáveis de Ambiente

### Backend (`.env`)

| Variável       | Obrigatória | Descrição                     | Exemplo                                          |
| -------------- | :---------: | ----------------------------- | ------------------------------------------------ |
| `DATABASE_URL` |     ✅      | String de conexão PostgreSQL  | `postgresql://user:pass@localhost:5432/financas` |
| `JWT_SECRET`   |     ✅      | Chave secreta para tokens JWT | `minha_chave_ultra_secreta`                      |
| `PORT`         |     ✅      | Porta do servidor HTTP        | `3333`                                           |

### Frontend (`.env`)

| Variável       | Obrigatória | Descrição               | Exemplo                 |
| -------------- | :---------: | ----------------------- | ----------------------- |
| `VITE_API_URL` |     ❌      | URL base da API backend | `http://localhost:3333` |

> Se `VITE_API_URL` não for definida, o Axios usa `http://localhost:3333` como fallback.

---

## 🔄 Fluxo da Transação

O ciclo de vida de uma transação financeira:

```
  ┌───────────────────────────────────────────────────────────────────┐
  │                        CRIAÇÃO                                    │
  │                                                                   │
  │   POST /transactions/create                                       │
  │   { description, value, type, date }                              │
  │                                                                   │
  │   ┌─────────────────────────────────────────────────┐             │
  │   │           prisma.$transaction (atômico)         │             │
  │   │                                                 │             │
  │   │   1. Cria registro em transactions              │             │
  │   │   2. Atualiza saldo do usuário:                 │             │
  │   │      • revenue → saldo + valor                  │             │
  │   │      • expense → saldo - valor                  │             │
  │   └─────────────────────────────────────────────────┘             │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                      VISUALIZAÇÃO                                 │
  │                                                                   │
  │   GET /transactions?date=YYYY-MM                                  │
  │   → Lista transações do período (ordenadas por data decrescente) │
  │                                                                   │
  │   GET /users/balance?date=YYYY-MM                                 │
  │   → Retorna: saldo, total receitas, total despesas + itens        │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                        EXCLUSÃO                                   │
  │                                                                   │
  │   DELETE /transactions/delete?item_id=UUID                        │
  │                                                                   │
  │   ┌─────────────────────────────────────────────────┐             │
  │   │           prisma.$transaction (atômico)         │             │
  │   │                                                 │             │
  │   │   1. Remove registro de transactions            │             │
  │   │   2. Estorna saldo do usuário:                  │             │
  │   │      • era revenue → saldo - valor              │             │
  │   │      • era expense → saldo + valor              │             │
  │   └─────────────────────────────────────────────────┘             │
  └───────────────────────────────────────────────────────────────────┘
```

### Consistência dos Dados

Todas as operações que envolvem criação ou exclusão de transações são executadas via `prisma.$transaction`, garantindo **atomicidade**: se a criação/exclusão da transação ou a atualização do saldo falhar, ambas as operações são revertidas automaticamente.

---

## 📚 Documentação Detalhada

Cada parte do projeto possui documentação aprofundada:

| Documento                                                                | Descrição                                                      |
| ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| [documentation/backend/CONTEXTO.md](documentation/backend/CONTEXTO.md)   | Arquitetura, regras de negócio e convenções do backend         |
| [documentation/backend/ENDPOINTS.md](documentation/backend/ENDPOINTS.md) | Referência completa de todos os endpoints com request/response |
| [documentation/frontend/CONTEXTO.md](documentation/frontend/CONTEXTO.md) | Arquitetura, componentes e práticas do frontend                |
| [backend/README.md](backend/README.md)                                   | Guia de instalação e uso do backend                            |
| [frontend/README.md](frontend/README.md)                                 | Guia de instalação e uso do frontend                           |

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Samuel Gomes da Silva**

- GitHub: [@samuelgomes0309](https://github.com/samuelgomes0309)

---
