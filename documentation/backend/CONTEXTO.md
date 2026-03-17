# 📖 CONTEXTO TÉCNICO — FinançasGomes Backend

Documento de referência técnica do backend do sistema de controle financeiro. Descreve a arquitetura, modelagem de dados, regras de negócio, fluxos e convenções do projeto.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Modelagem de Dados](#-modelagem-de-dados)
- [Regras de Negócio](#-regras-de-negócio)
- [Sistema de Autenticação](#-sistema-de-autenticação)
- [Módulos do Sistema](#-módulos-do-sistema)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Convenções e Padrões](#-convenções-e-padrões)

---

## 🎯 Visão Geral

O **FinançasGomes Backend** é uma API REST para controle financeiro pessoal. Cada usuário possui sua conta isolada, com saldo próprio e histórico de transações. O sistema garante consistência dos dados através de operações atômicas (transações Prisma) a cada criação ou exclusão de lançamento financeiro.

### Domínios da aplicação

| Domínio        | Responsabilidade                                    |
| -------------- | --------------------------------------------------- |
| **Usuários**   | Cadastro, autenticação, consulta de perfil e saldo  |
| **Transações** | Criação, listagem e exclusão de receitas e despesas |
| **Balanço**    | Consolidação de receitas e despesas por período     |

---

## 🚀 Stack Tecnológica

| Camada         | Tecnologia           | Versão | Papel                                           |
| -------------- | -------------------- | ------ | ----------------------------------------------- |
| Runtime        | Node.js              | 18+    | Ambiente de execução                            |
| Linguagem      | TypeScript           | 5.9    | Tipagem estática e segurança em desenvolvimento |
| Framework HTTP | Express              | 4.18.2 | Roteamento e middlewares                        |
| ORM            | Prisma               | 6      | Acesso ao banco, migrations e client tipado     |
| Banco de Dados | PostgreSQL           | latest | Persistência relacional                         |
| Autenticação   | jsonwebtoken         | 9.0.2  | Geração e verificação de tokens JWT             |
| Hash de senhas | bcryptjs             | 3.0.2  | Criptografia segura de senhas (salt 8)          |
| CORS           | cors                 | 2.8.5  | Liberação de origens cruzadas                   |
| Env vars       | dotenv               | 17.3.1 | Carregamento do arquivo `.env`                  |
| Async errors   | express-async-errors | 3.1.1  | Propagação automática de erros em async/await   |
| Datas          | date-fns             | 4.1.0  | Manipulação de datas                            |
| Dev            | ts-node-dev          | 2.0.0  | Hot reload em desenvolvimento                   |

---

## 🏗️ Arquitetura

### Padrão de Camadas

O projeto segue uma arquitetura em camadas bem definida:

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

### Tratamento Global de Erros

Todos os erros de regra de negócio são lançados com `throw new Error("mensagem")` dentro dos Services. O middleware global em `server.ts` os captura e retorna a resposta padronizada:

```typescript
// server.ts
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof Error) {
		return res.status(400).json({ error: err.message });
	}
	return res
		.status(500)
		.json({ status: "error", message: "Internal server error" });
});
```

Isso é possível graças ao `express-async-errors`, que intercepta erros lançados em funções `async` e os encaminha para o middleware.

---

## 🗄️ Modelagem de Dados

### Diagrama de Relacionamento

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

**Relacionamento:** Um usuário possui zero ou mais transações (`1:N`).

### Tabela `users`

| Campo       | Tipo      | Constraints         | Descrição                                  |
| ----------- | --------- | ------------------- | ------------------------------------------ |
| `id`        | String    | PK, UUID, auto      | Identificador único gerado automaticamente |
| `name`      | String    | NOT NULL            | Nome do usuário                            |
| `email`     | String    | NOT NULL, UNIQUE    | Email — chave de autenticação              |
| `password`  | String    | NOT NULL            | Senha armazenada como **hash bcrypt**      |
| `balance`   | Float     | NOT NULL, default 0 | Saldo atual, atualizado a cada transação   |
| `createAt`  | DateTime? | default now()       | Data de criação do registro                |
| `updatedAt` | DateTime? | default now()       | Data da última atualização                 |

### Tabela `transactions`

| Campo         | Tipo      | Constraints    | Descrição                                      |
| ------------- | --------- | -------------- | ---------------------------------------------- |
| `id`          | String    | PK, UUID, auto | Identificador único gerado automaticamente     |
| `description` | String    | NOT NULL       | Descrição da transação                         |
| `value`       | Float     | NOT NULL       | Valor sempre positivo (nunca negativo)         |
| `type`        | String    | NOT NULL       | `"revenue"` (receita) ou `"expense"` (despesa) |
| `user_id`     | String    | FK → users.id  | Vínculo com o usuário dono da transação        |
| `date`        | String    | NOT NULL       | Período no formato `YYYY-MM` (ex: `"2026-03"`) |
| `createdAt`   | DateTime? | default now()  | Data de criação do registro                    |
| `updatedAt`   | DateTime? | default now()  | Data da última atualização                     |

> **Observação sobre `date`:** O campo é do tipo `String` (não `DateTime`) para facilitar o filtro por período (mês/ano) sem necessidade de manipulação de datas complexa.

---

## 📐 Regras de Negócio

### Cadastro de Usuário

- O campo `email` é obrigatório e deve ser único no sistema
- A senha é hasheada com `bcrypt` antes de ser persistida (salt: 8)
- O saldo inicial é sempre `0` (definido no controller)
- Não é possível criar dois usuários com o mesmo email

### Autenticação

- Login realizado com `email` + `password`
- Senha comparada com o hash armazenado via `bcrypt.compare`
- Em caso de email não encontrado ou senha incorreta, a mensagem retornada é sempre a mesma (`"Invalid email or password"`) — isso evita enumeração de usuários
- Token JWT gerado com validade de **30 dias**, assinado com `JWT_SECRET`
- Payload do token: `{ name, email, sub: user_id }`

### Criação de Transação

- Campos `type` e `value` são obrigatórios
- O `value` não pode ser negativo
- O usuário deve existir no banco para criar uma transação
- O saldo é atualizado de acordo com a regra:
  ```
  revenue (receita):  novo_saldo = saldo_atual + value
  expense (despesa):  novo_saldo = saldo_atual - value
  ```
- Criação da transação + atualização do saldo são executadas em uma **transação atômica** (`prisma.$transaction`): se uma falhar, ambas são revertidas

### Exclusão de Transação

- A transação deve existir e pertencer ao usuário autenticado
- O saldo é estornado de acordo com a regra:
  ```
  Remover expense: novo_saldo = saldo_atual + value  (devolve o dinheiro)
  Remover revenue: novo_saldo = saldo_atual - value  (retira o dinheiro)
  ```
- Exclusão da transação + atualização do saldo são executadas em uma **transação atômica** (`prisma.$transaction`)

### Balanço e Listagem

- Transações são sempre filtradas por `user_id` + `date` (formato `YYYY-MM`)
- O balanço retorna `revenue` e `expense` com seus respectivos itens e totais, além do `balance` (saldo atual) do usuário
- Resultados são ordenados por `createdAt` decrescente (mais recentes primeiro)

---

## 🔐 Sistema de Autenticação

### Fluxo Completo

```
1. Cliente: POST /users/session { email, password }
      │
2. AuthUserService: verifica email no banco
      │
3. AuthUserService: compara senha com bcrypt.compare
      │
4. AuthUserService: gera JWT (sub = user_id, exp = 30d)
      │
5. Resposta: { id, name, email, balance, token }
      │
6. Próximas requisições: Authorization: Bearer <token>
      │
7. isAuthenticated: verify(token, JWT_SECRET)
      │
8. isAuthenticated: injeta req.user_id = sub
      │
9. Controller → Service: usa req.user_id para isolar dados
```

### Middleware `isAuthenticated`

Localizado em `src/middlewares/isAuthenticated.ts`. Aplicado em todas as rotas privadas:

```typescript
// Extrai o token do header Authorization
const authToken = req.headers.authorization;
if (!authToken) {
	return res.status(401).end;
}

// Separa "Bearer" do token
const [, token] = authToken.split(" ");

// Verifica assinatura e decodifica o payload
const { sub } = verify(token, process.env.JWT_SECRET) as Payload;

// Injeta o user_id no request para uso nos controllers/services
req.user_id = sub;
```

A interface `Request` do Express é extendida em `src/@types/express/index.d.ts` para incluir `user_id`:

```typescript
declare namespace Express {
	export interface Request {
		user_id: string;
	}
}
```

---

## 📦 Módulos do Sistema

### Módulo de Usuários

| Arquivo                    | Responsabilidade                                             |
| -------------------------- | ------------------------------------------------------------ |
| `CreateUserController.ts`  | Extrai `name`, `email`, `password` do body e chama o service |
| `CreateUserService.ts`     | Valida unicidade do email, hasheia senha e cria o usuário    |
| `AuthUserController.ts`    | Extrai `email`, `password` do body e chama o service         |
| `AuthUserService.ts`       | Valida credenciais, gera e retorna o token JWT               |
| `DetailUserController.ts`  | Lê `user_id` do request e chama o service                    |
| `DetailUserService.ts`     | Busca e retorna os dados do usuário pelo `user_id`           |
| `ListBalanceController.ts` | Lê `user_id` e `date` (query) e chama o service              |
| `ListBalanceService.ts`    | Consulta receitas e despesas do período e retorna o balanço  |

### Módulo de Transações

| Arquivo                          | Responsabilidade                                                  |
| -------------------------------- | ----------------------------------------------------------------- |
| `CreateTransactionController.ts` | Extrai dados do body/request e chama o service                    |
| `CreateTransactionService.ts`    | Valida dados, cria a transação e atualiza o saldo atomicamente    |
| `ListTransactionController.ts`   | Extrai `user_id` e `date` (query) e chama o service               |
| `ListTransactionService.ts`      | Filtra e retorna as transações do usuário pelo período            |
| `DeleteTransactionController.ts` | Extrai `item_id` (query) e `user_id` do request e chama o service |
| `DeleteTransactionService.ts`    | Valida a transação, a exclui e reverte o saldo atomicamente       |

---

## ⚙️ Variáveis de Ambiente

| Variável       | Obrigatória | Exemplo                                          | Descrição                                 |
| -------------- | ----------- | ------------------------------------------------ | ----------------------------------------- |
| `DATABASE_URL` | ✅          | `postgresql://user:pass@localhost:5432/financas` | String de conexão com o PostgreSQL        |
| `JWT_SECRET`   | ✅          | `minha-chave-secreta-256bits`                    | Chave para assinar e verificar tokens JWT |
| `PORT`         | ✅          | `3333`                                           | Porta em que o servidor HTTP escuta       |

> **Boa prática:** Gere um JWT_SECRET forte com:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 📐 Convenções e Padrões

### Nomenclatura

| Contexto           | Padrão      | Exemplo                        |
| ------------------ | ----------- | ------------------------------ |
| Classes            | PascalCase  | `CreateUserService`            |
| Arquivos de classe | PascalCase  | `CreateUserController.ts`      |
| Arquivos de config | camelCase   | `index.ts`, `prisma.config.ts` |
| Variáveis          | camelCase   | `user_id`, `passwordHash`      |
| Rotas              | kebab-case  | `/transactions/create`         |
| Env vars           | UPPER_SNAKE | `JWT_SECRET`, `DATABASE_URL`   |

### Mensagens de Erro Padronizadas

| Situação                                  | Mensagem                                             |
| ----------------------------------------- | ---------------------------------------------------- |
| Campo email ausente                       | `"Email is required"`                                |
| Email já cadastrado                       | `"Email already registered"`                         |
| Credencial inválida (email ou senha)      | `"Invalid email or password"`                        |
| Usuário não encontrado / não autorizado   | `"Not authorized"`                                   |
| Parâmetro `date` ausente                  | `"Date is required"`                                 |
| Campos `type` ou `value` ausentes         | `"Type and value are required"`                      |
| Valor negativo                            | `"Value cannot be negative"`                         |
| Usuário não encontrado no banco           | `"User not found"`                                   |
| `item_id` ausente                         | `"Item ID is required"`                              |
| Transação não encontrada ou de outro user | `"Transaction not found or does not belong to user"` |

### Estrutura de um Service

```typescript
class XxxService {
  async execute({ param1, param2 }: XxxRequest) {
    // 1. Validações de entrada
    if (!param1) throw new Error("Mensagem de erro");

    // 2. Consultas ao banco
    const record = await prismaClient.model.findFirst({ where: { ... } });
    if (!record) throw new Error("Not found");

    // 3. Regra de negócio

    // 4. Persistência (com $transaction quando necessário)
    const result = await prismaClient.model.create({ data: { ... } });

    // 5. Retorno
    return result;
  }
}
```

### Operações Atômicas

Sempre que uma operação envolver múltiplas tabelas, usar `prisma.$transaction`:

```typescript
const [transacao, usuario] = await prismaClient.$transaction([
  prismaClient.transactions.create({ data: { ... } }),
  prismaClient.user.update({ where: { id: user_id }, data: { balance } }),
]);
```

Isso garante que, se qualquer uma das operações falhar, todas são revertidas — mantendo a consistência entre o registro da transação e o saldo do usuário.
