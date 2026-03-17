# 💰 FinançasGomes — Frontend

Interface web para gerenciamento de finanças pessoais, com dashboard interativo, registro de transações, filtro por período e autenticação JWT.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.16-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Arquitetura e Padrões](#-arquitetura-e-padrões)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação](#-documentação)

---

## 🎯 Sobre o Projeto

O **FinançasGomes Frontend** é uma SPA (Single Page Application) que consome a API REST do backend para oferecer controle financeiro pessoal completo. Desde o cadastro e login até a visualização de saldos, receitas e despesas filtradas por período — tudo numa interface responsiva e moderna.

### Características principais

- ✅ Arquitetura baseada em componentes reutilizáveis
- ✅ Autenticação via JWT com rotas protegidas (Private/Public)
- ✅ Gerenciamento de estado global com Context API
- ✅ Validação de formulários com Zod + React Hook Form
- ✅ Dashboard com cards de saldo, receitas e despesas
- ✅ Filtro de transações por período com calendário interativo
- ✅ Notificações toast para feedback ao usuário
- ✅ Layout responsivo mobile-first com Tailwind CSS

---

## 🚀 Tecnologias

| Categoria       | Tecnologia         | Versão  | Descrição                                        |
| --------------- | ------------------ | ------- | ------------------------------------------------ |
| **UI**          | React              | 19.1.1  | Biblioteca para construção de interfaces         |
| **Linguagem**   | TypeScript         | 5.9     | Superset JavaScript com tipagem estática         |
| **Build**       | Vite               | 7.1.7   | Bundler e dev server ultrarrápido                |
| **Estilização** | Tailwind CSS       | 4.1.16  | Framework CSS utility-first                      |
| **Ícones**      | Lucide React       | 0.552.0 | Biblioteca de ícones SVG                         |
| **Formulários** | React Hook Form    | 7.66.0  | Gerenciamento performático de formulários        |
| **Validação**   | Zod                | 4.1.12  | Validação de schemas TypeScript-first            |
| **Roteamento**  | React Router DOM   | 7.9.5   | Roteamento declarativo para SPAs                 |
| **HTTP**        | Axios              | 1.13.1  | Cliente HTTP para comunicação com a API          |
| **Datas**       | Day.js             | 1.11.19 | Manipulação leve de datas                        |
| **Calendário**  | React Calendar     | 6.0.0   | Componente de calendário interativo              |
| **Notificações**| React Hot Toast    | 2.6.0   | Notificações toast elegantes                     |
| **Lint**        | ESLint             | 9.39.0  | Linter para qualidade do código                  |
| **Formatação**  | Prettier           | 3.6.2   | Formatador de código opinativo                   |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Cadastro de novos usuários com validação de campos
- Login com email e senha retornando token JWT
- Validação automática de sessão ao carregar a aplicação
- Logout com limpeza de token do `localStorage`
- Rotas protegidas (Private) e públicas (Public) com redirecionamento

### 📊 Dashboard

- Cards de saldo total, receitas e despesas do período
- Listagem de transações recentes ordenadas por data
- Exclusão de transações com estorno automático do saldo
- Filtro por data via modal com calendário interativo
- Link rápido para registro de nova transação

### 💸 Registro de Transações

- Seleção visual do tipo: receita ou despesa (radio cards)
- Campos de valor (aceita vírgula e ponto) e descrição
- Validação em tempo real com feedback visual nos campos
- Conversão automática de string para número antes do envio

### 👤 Perfil

- Exibição dos dados do usuário autenticado (nome e email)

---

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── main.tsx                             # Ponto de entrada — providers e router
│   ├── App.tsx                              # Definição das rotas (createBrowserRouter)
│   ├── App.css                              # Estilos globais e tema Tailwind (@theme)
│   │
│   ├── api/
│   │   └── api.ts                           # Instância Axios com baseURL configurável
│   │
│   ├── contexts/
│   │   └── authContext.tsx                  # AuthContext — login, signup, logout, validação
│   │
│   ├── routes/
│   │   ├── PrivateRoute.tsx                 # Guard: redireciona para /login se não autenticado
│   │   ├── PublicRoute.tsx                  # Guard: redireciona para / se já autenticado
│   │   └── components/
│   │       └── routerLoader.tsx             # Spinner de carregamento durante validação
│   │
│   ├── components/                          # Componentes reutilizáveis globais
│   │   ├── errorMsg/
│   │   │   └── index.tsx                    # Mensagem de erro inline
│   │   ├── header/
│   │   │   └── index.tsx                    # Header com título e dados do usuário
│   │   ├── sidebar/
│   │   │   ├── index.tsx                    # Sidebar com navegação e logout
│   │   │   └── components/
│   │   │       └── itemLink.tsx             # Item de link com ícone e destaque ativo
│   │   └── submitBtn/
│   │       └── index.tsx                    # Botão de submit com spinner de loading
│   │
│   └── pages/
│       ├── login/                           # Página de autenticação
│       │   ├── index.tsx                    # Alterna entre SignIn e SignUp
│       │   ├── schema.ts                    # Schemas Zod (signInSchema, signUpSchema)
│       │   ├── signin/
│       │   │   └── index.tsx                # Formulário de login
│       │   ├── signup/
│       │   │   └── index.tsx                # Formulário de cadastro
│       │   └── components/
│       │       ├── footerMsg.tsx            # Mensagem de rodapé com link alternativo
│       │       ├── headerMsg.tsx            # Cabeçalho com logo e subtítulo
│       │       ├── inputForm.tsx            # Input genérico com ícone e foco visual
│       │       └── labelMsg.tsx             # Label estilizada
│       │
│       ├── dashboard/                       # Página principal
│       │   ├── index.tsx                    # Dashboard com balanço e transações
│       │   └── components/
│       │       ├── cardBalance.tsx          # Card de saldo/receita/despesa
│       │       ├── cardItem.tsx             # Linha de transação com botão de deletar
│       │       └── filterModal.tsx          # Modal com calendário para filtro por data
│       │
│       ├── register/                        # Página de registro de transações
│       │   ├── index.tsx                    # Formulário de criação de transação
│       │   ├── schema.ts                    # Schemas Zod (formInputSchema, formRegisterSchema)
│       │   └── components/
│       │       ├── cardTypeReg.tsx          # Card radio para tipo (receita/despesa)
│       │       ├── inputReg.tsx             # Input do formulário de registro
│       │       └── labelReg.tsx             # Label do formulário de registro
│       │
│       └── profile/                         # Página de perfil
│           └── index.tsx                    # Exibição dos dados do usuário
│
├── index.html                               # HTML base com entrada do React
├── package.json                             # Dependências e scripts
├── vite.config.ts                           # Configuração do Vite + plugins
├── tsconfig.json                            # Referências de configuração TS
├── tsconfig.app.json                        # Config TS da aplicação (src/)
├── tsconfig.node.json                       # Config TS do tooling (vite.config.ts)
└── eslint.config.js                         # Configuração do ESLint
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **Backend do FinançasGomes** rodando (API em `http://localhost:3333`)

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/samuelgomes0309/financas

# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do frontend com a seguinte variável:

```env
# URL da API Backend
VITE_API_URL=http://localhost:3333
```

> **Nota:** Se `VITE_API_URL` não for definida, o Axios usará `http://localhost:3333` como fallback.

---

## 💻 Execução

```bash
# Inicia o servidor de desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Preview da build de produção
npm run preview
```

A aplicação estará disponível em **http://localhost:5173**.

---

## 🗺️ Rotas da Aplicação

| Rota        | Guard   | Página      | Descrição                                |
| ----------- | ------- | ----------- | ---------------------------------------- |
| `/`         | Private | Dashboard   | Visão geral: saldo, transações e filtros |
| `/register` | Private | Register    | Formulário de criação de transação       |
| `/profile`  | Private | Profile     | Dados do usuário autenticado             |
| `/login`    | Public  | Login       | Telas de login e cadastro                |

- **Private**: redireciona para `/login` se o usuário não estiver autenticado
- **Public**: redireciona para `/` se o usuário já estiver autenticado

---

## 🏗️ Arquitetura e Padrões

### Fluxo de uma Requisição

```
Ação do Usuário → Página/Componente → Context/API (Axios) → Backend REST → Resposta → Atualiza Estado → Re-render
```

### Gerenciamento de Estado

| Escopo         | Solução                  | Uso                                          |
| -------------- | ------------------------ | -------------------------------------------- |
| **Global**     | Context API (AuthContext) | Dados do usuário, login, signup, logout      |
| **Local**      | useState                 | Formulários, modais, loading, filtros        |
| **Formulários**| React Hook Form          | Valores, validação, submissão                |

### Validação de Formulários

Todos os formulários utilizam **Zod** para definição de schemas e **@hookform/resolvers** para integração com React Hook Form:

- `signInSchema` / `signUpSchema` — Login e Cadastro
- `formInputSchema` / `formRegisterSchema` — Registro de transações (com transform de string → number)

### Layout

O layout das páginas autenticadas segue o padrão: **Sidebar + Header + Conteúdo**.

- **Mobile**: Sidebar no topo como barra horizontal, Header abaixo
- **Desktop (md+)**: Sidebar fixa à esquerda, Header e conteúdo à direita

---

## 📜 Scripts Disponíveis

| Comando           | Descrição                                          |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento (Vite)        |
| `npm run build`   | Compila TypeScript e gera build de produção        |
| `npm run lint`    | Executa o ESLint em todos os arquivos              |
| `npm run preview` | Serve a build de produção localmente para preview  |

---

## 📚 Documentação

A documentação completa do projeto está na pasta `documentation/` na raiz do monorepo:

```
Financas/
├── backend/
├── frontend/
└── documentation/
    ├── backend/
    │   ├── ENDPOINTS.md
    │   └── CONTEXTO.md
    └── frontend/
        └── CONTEXTO.md
```

| Documento                                                               | Descrição                                                                                     |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **[📖 CONTEXTO.md (Frontend)](../documentation/frontend/CONTEXTO.md)** | Arquitetura, componentes, fluxos, tema, validação e convenções do frontend                    |
| **[📖 CONTEXTO.md (Backend)](../documentation/backend/CONTEXTO.md)**   | Arquitetura em camadas, modelagem de dados, regras de negócio e padrões do backend            |
| **[📡 ENDPOINTS.md](../documentation/backend/ENDPOINTS.md)**           | Documentação detalhada de cada endpoint da API: método, body, query params, respostas e erros |
