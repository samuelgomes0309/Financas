# 💰 FinançasGomes — Backend

API REST para gerenciamento de finanças pessoais, com controle de transações, cálculo automático de saldo e autenticação JWT.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?style=flat&logo=postgresql&logoColor=white)

---

## � Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Rotas](#-rotas)
- [Serviços e Arquitetura](#-serviços-e-arquitetura)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação](#-documentação)

---

## 🎯 Sobre o Projeto

O **FinançasGomes Backend** é uma API REST para controle financeiro pessoal. O sistema cobre o fluxo completo de gestão de finanças: desde o cadastro e autenticação de usuários até o controle detalhado de receitas e despesas com atualização automática de saldo.

### Características principais

- ✅ Arquitetura em camadas — Controller → Service → Prisma
- ✅ Autenticação JWT com middleware de proteção de rotas
- ✅ Hashing seguro de senhas com bcrypt
- ✅ Atualização automática de saldo a cada transação criada ou removida
- ✅ Operações atômicas com `prisma.$transaction` para garantir consistência
- ✅ Tratamento global de erros centralizado no `server.ts`
- ✅ Suporte a filtro de transações e balanço por período (mês/ano)

---

## 🚀 Tecnologias

| Categoria           | Tecnologia           | Versão | Descrição                                  |
| ------------------- | -------------------- | ------ | ------------------------------------------ |
| **Core**            | Node.js              | 18+    | Ambiente de execução JavaScript            |
| **Linguagem**       | TypeScript           | 5.9    | Superset JavaScript com tipagem estática   |
| **Framework**       | Express              | 4.18.2 | Framework web minimalista e flexível       |
| **ORM**             | Prisma               | 6      | ORM moderno com migrations e client tipado |
| **Banco**           | PostgreSQL           | latest | Banco de dados relacional                  |
| **Auth**            | jsonwebtoken         | 9.0.2  | Geração e verificação de tokens JWT        |
| **Segurança**       | bcryptjs             | 3.0.2  | Hashing seguro de senhas                   |
| **Utilitários**     | cors                 | 2.8.5  | Liberação de Cross-Origin Resource Sharing |
| **Utilitários**     | dotenv               | 17.3.1 | Carregamento de variáveis de ambiente      |
| **Utilitários**     | express-async-errors | 3.1.1  | Propagação automática de erros assíncronos |
| **Utilitários**     | date-fns             | 4.1.0  | Manipulação de datas                       |
| **Desenvolvimento** | ts-node-dev          | 2.0.0  | Execução de TypeScript com hot reload      |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Registro de novos usuários com senha hasheada via bcrypt
- Login com email e senha retornando token JWT (validade: 30 dias)
- Middleware `isAuthenticated` protegendo todas as rotas privadas
- Token enviado no header `Authorization: Bearer <token>`

### 👤 Usuários

- Consulta dos dados do usuário autenticado
- Saldo atualizado em tempo real a cada transação criada ou removida

### 💸 Transações

- Criação de transações do tipo `revenue` (receita) ou `expense` (despesa)
- Listagem de transações filtradas por período (formato `YYYY-MM`)
- Exclusão de transações com estorno automático do saldo

### 📊 Balanço

- Relatório consolidado por período com totais separados de receitas e despesas
- Saldo atual do usuário incluído no retorno

---

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma                        # Modelos User e Transactions
│   └── migrations/                          # Histórico de migrations SQL
│       ├── migration_lock.toml
│       ├── 20251028233514_create_tables/
│       ├── 20251031004828_create_new_migration/
│       └── 20251102142506_att_tables/
│
├── src/
│   ├── server.ts                            # Ponto de entrada e middleware global de erros
│   ├── routes.ts                            # Definição de todas as rotas
│   │
│   ├── @types/
│   │   └── express/
│   │       └── index.d.ts                   # Extensão do Request com user_id
│   │
│   ├── controllers/                         # Camada de entrada HTTP
│   │   ├── user/
│   │   │   ├── CreateUserController.ts
│   │   │   ├── AuthUserController.ts
│   │   │   ├── DetailUserController.ts
│   │   │   └── ListBalanceController.ts
│   │   └── transaction/
│   │       ├── CreateTransactionController.ts
│   │       ├── ListTransactionController.ts
│   │       └── DeleteTransactionController.ts
│   │
│   ├── services/                            # Camada de regras de negócio
│   │   ├── user/
│   │   │   ├── CreateUserService.ts
│   │   │   ├── AuthUserService.ts
│   │   │   ├── DetailUserService.ts
│   │   │   └── ListBalanceService.ts
│   │   └── transaction/
│   │       ├── CreateTransactionService.ts
│   │       ├── ListTransactionService.ts
│   │       └── DeleteTransactionService.ts
│   │
│   ├── middlewares/
│   │   └── isAuthenticated.ts               # Validação do token JWT
│   │
│   ├── prisma/
│   │   └── index.ts                         # Instância global do PrismaClient
│   │
│   └── generated/
│       └── prisma/                          # Client gerado automaticamente pelo Prisma
│
├── .env                                     # Variáveis de ambiente (git ignored)
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **PostgreSQL** rodando localmente ou em nuvem

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/samuelgomes0309/financas

# Acesse a pasta do projeto
cd backend

# Instale as dependências
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# String de conexão com o banco PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Chave secreta para assinar tokens JWT
JWT_SECRET="sua-chave-secreta-aqui"

# Porta do servidor
PORT=3333
```

---

## 💻 Execução

```bash
# Inicia o servidor de desenvolvimento com hot reload
npm run dev

# Aplica as migrations e cria as tabelas no banco
npx prisma migrate dev

# Abre o Prisma Studio (interface visual do banco)
npx prisma studio
```

O servidor ficará disponível em **http://localhost:3333**.

---

## 🗺️ Rotas

| Rota                   | Método   | Protegida | Controller                    | Descrição                             |
| ---------------------- | -------- | --------- | ----------------------------- | ------------------------------------- |
| `/users/signup`        | `POST`   | ❌        | `CreateUserController`        | Cria um novo usuário                  |
| `/users/session`       | `POST`   | ❌        | `AuthUserController`          | Autentica e retorna token JWT         |
| `/users/me`            | `GET`    | ✅        | `DetailUserController`        | Retorna dados do usuário autenticado  |
| `/users/balance`       | `GET`    | ✅        | `ListBalanceController`       | Retorna balanço detalhado por período |
| `/transactions/create` | `POST`   | ✅        | `CreateTransactionController` | Cria nova transação e atualiza saldo  |
| `/transactions`        | `GET`    | ✅        | `ListTransactionController`   | Lista transações de um período        |
| `/transactions/delete` | `DELETE` | ✅        | `DeleteTransactionController` | Remove transação e estorna o saldo    |

---

## 🏗️ Serviços e Arquitetura

O fluxo de uma requisição segue sempre o padrão:

```
Request → Router → [isAuthenticated?] → Controller → Service → Prisma (DB)
```

### Services de Usuário

| Service              | Método    | Endpoint              | Descrição                                               |
| -------------------- | --------- | --------------------- | ------------------------------------------------------- |
| `CreateUserService`  | `execute` | `POST /users/signup`  | Valida email único, hasheia a senha e cria o usuário    |
| `AuthUserService`    | `execute` | `POST /users/session` | Valida credenciais e assina token JWT de 30 dias        |
| `DetailUserService`  | `execute` | `GET /users/me`       | Busca e retorna dados do usuário pelo `user_id`         |
| `ListBalanceService` | `execute` | `GET /users/balance`  | Agrega receitas e despesas do período e retorna balanço |

### Services de Transação

| Service                    | Método    | Endpoint                      | Descrição                                                     |
| -------------------------- | --------- | ----------------------------- | ------------------------------------------------------------- |
| `CreateTransactionService` | `execute` | `POST /transactions/create`   | Cria a transação e atualiza o saldo em `prisma.$transaction`  |
| `ListTransactionService`   | `execute` | `GET /transactions`           | Lista as transações do usuário filtradas por data             |
| `DeleteTransactionService` | `execute` | `DELETE /transactions/delete` | Remove a transação e estorna o saldo em `prisma.$transaction` |

### Lógica de Saldo

```
Criar receita:   novo_saldo = saldo_atual + valor
Criar despesa:   novo_saldo = saldo_atual - valor

Deletar despesa: novo_saldo = saldo_atual + valor  (estorno)
Deletar receita: novo_saldo = saldo_atual - valor  (estorno)
```

---

## 📜 Scripts Disponíveis

| Comando                     | Descrição                                        |
| --------------------------- | ------------------------------------------------ |
| `npm run dev`               | Inicia o servidor com hot reload (ts-node-dev)   |
| `npx prisma migrate dev`    | Cria e aplica migrations no banco de dados       |
| `npx prisma migrate deploy` | Aplica migrations em ambiente de produção        |
| `npx prisma studio`         | Abre interface visual do banco (localhost:5555)  |
| `npx prisma generate`       | Regenera o Prisma Client após mudanças no schema |

---

## 📚 Documentação

A documentação completa do projeto está na pasta `documentation/backend` na raiz do monorepo:

```
Financas/
├── backend/
├── frontend/
└── documentation/
    └── backend/
          ├── ENDPOINTS.md    # Todos os endpoints com exemplos de request/response
          └── CONTEXTO.md     # Arquitetura, modelagem, regras de negócio e convenções
```

| Documento                                                    | Descrição                                                                                                                           |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **[📡 ENDPOINTS.md](../documentation/backend/ENDPOINTS.md)** | Documentação detalhada de cada endpoint: método, autenticação, body, query params, respostas e erros                                |
| **[📖 CONTEXTO.md](../documentation/backend/CONTEXTO.md)**   | Contexto técnico completo: arquitetura em camadas, modelagem de dados, regras de negócio, fluxo de autenticação e padrões de código |
