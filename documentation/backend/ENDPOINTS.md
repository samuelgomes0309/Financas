# 📡 ENDPOINTS — FinançasGomes API

Documentação completa de todos os endpoints da API REST do sistema de controle financeiro.

> **Base URL:** `http://localhost:3333`
> **Autenticação:** JWT via header `Authorization: Bearer <token>`

---

## 📋 Índice

- [Usuários](#-usuários)
  - [POST /users/signup](#post-userssignup)
  - [POST /users/session](#post-userssession)
  - [GET /users/me](#get-usersme)
  - [GET /users/balance](#get-usersbalance)
- [Transações](#-transações)
  - [POST /transactions/create](#post-transactionscreate)
  - [GET /transactions](#get-transactions)
  - [DELETE /transactions/delete](#delete-transactionsdelete)
- [Códigos de Status](#-códigos-de-status)

---

## 👤 Usuários

---

### POST /users/signup

Cria um novo usuário no sistema.

- **Autenticação:** ❌ Não requerida
- **Controller:** `CreateUserController`
- **Service:** `CreateUserService`

#### Request Body

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

| Campo      | Tipo   | Obrigatório | Descrição            |
| ---------- | ------ | ----------- | -------------------- |
| `name`     | string | ✅          | Nome completo        |
| `email`    | string | ✅          | Email único          |
| `password` | string | ✅          | Senha (será hasheada)|

#### Response — 200 OK

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@example.com",
  "balance": 0
}
```

#### Erros

| Status | Mensagem                   | Causa                             |
| ------ | -------------------------- | --------------------------------- |
| `400`  | `"Email is required"`      | Campo `email` não enviado         |
| `400`  | `"Email already registered"` | Email já cadastrado no sistema  |

---

### POST /users/session

Autentica um usuário e retorna um token JWT.

- **Autenticação:** ❌ Não requerida
- **Controller:** `AuthUserController`
- **Service:** `AuthUserService`

#### Request Body

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

| Campo      | Tipo   | Obrigatório | Descrição       |
| ---------- | ------ | ----------- | --------------- |
| `email`    | string | ✅          | Email do usuário |
| `password` | string | ✅          | Senha do usuário |

#### Response — 200 OK

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@example.com",
  "balance": 1500.00,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Campo     | Tipo   | Descrição                              |
| --------- | ------ | -------------------------------------- |
| `id`      | string | UUID do usuário                        |
| `name`    | string | Nome do usuário                        |
| `email`   | string | Email do usuário                       |
| `balance` | number | Saldo atual                            |
| `token`   | string | JWT com validade de **30 dias**        |

#### Erros

| Status | Mensagem                    | Causa                                      |
| ------ | --------------------------- | ------------------------------------------ |
| `400`  | `"Invalid email or password"` | Email não encontrado ou senha incorreta  |

---

### GET /users/me

Retorna os dados do usuário atualmente autenticado.

- **Autenticação:** ✅ Requerida
- **Controller:** `DetailUserController`
- **Service:** `DetailUserService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@example.com",
  "balance": 1500.00
}
```

#### Erros

| Status | Mensagem           | Causa                           |
| ------ | ------------------ | ------------------------------- |
| `400`  | `"Not authorized"` | Token inválido ou não enviado   |

---

### GET /users/balance

Retorna o balanço financeiro consolidado do usuário para um determinado período.

- **Autenticação:** ✅ Requerida
- **Controller:** `ListBalanceController`
- **Service:** `ListBalanceService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Exemplo     | Descrição                       |
| --------- | ------ | ----------- | ----------- | ------------------------------- |
| `date`    | string | ✅          | `2026-03`   | Período no formato `YYYY-MM`    |

#### Exemplo de Requisição

```
GET /users/balance?date=2026-03
```

#### Response — 200 OK

```json
{
  "balance": 1500.00,
  "revenue": {
    "total": 5000.00,
    "items": [
      {
        "id": "uuid-da-transacao",
        "description": "Salário",
        "value": 5000.00,
        "type": "revenue",
        "date": "2026-03",
        "user_id": "uuid-do-usuario"
      }
    ]
  },
  "expense": {
    "total": 3500.00,
    "items": [
      {
        "id": "uuid-da-transacao",
        "description": "Aluguel",
        "value": 1500.00,
        "type": "expense",
        "date": "2026-03",
        "user_id": "uuid-do-usuario"
      },
      {
        "id": "uuid-da-transacao",
        "description": "Supermercado",
        "value": 2000.00,
        "type": "expense",
        "date": "2026-03",
        "user_id": "uuid-do-usuario"
      }
    ]
  }
}
```

| Campo             | Tipo   | Descrição                                      |
| ----------------- | ------ | ---------------------------------------------- |
| `balance`         | number | Saldo atual do usuário                         |
| `revenue.total`   | number | Soma de todas as receitas do período           |
| `revenue.items`   | array  | Lista de transações de receita no período      |
| `expense.total`   | number | Soma de todas as despesas do período           |
| `expense.items`   | array  | Lista de transações de despesa no período      |

#### Erros

| Status | Mensagem           | Causa                         |
| ------ | ------------------ | ----------------------------- |
| `400`  | `"Not authorized"` | Token inválido ou não enviado |
| `400`  | `"Date is required"` | Parâmetro `date` não enviado |

---

## 💸 Transações

---

### POST /transactions/create

Cria uma nova transação e atualiza o saldo do usuário automaticamente.

- **Autenticação:** ✅ Requerida
- **Controller:** `CreateTransactionController`
- **Service:** `CreateTransactionService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
  "description": "Salário",
  "value": 5000.00,
  "type": "revenue",
  "date": "2026-03"
}
```

| Campo         | Tipo   | Obrigatório | Valores aceitos         | Descrição                         |
| ------------- | ------ | ----------- | ----------------------- | --------------------------------- |
| `description` | string | ✅          | qualquer string         | Descrição da transação            |
| `value`       | number | ✅          | número positivo         | Valor da transação                |
| `type`        | string | ✅          | `"revenue"`, `"expense"` | Tipo: receita ou despesa         |
| `date`        | string | ✅          | `YYYY-MM`               | Período da transação              |

#### Response — 200 OK

```json
{
  "id": "uuid-da-transacao",
  "description": "Salário",
  "value": 5000.00,
  "type": "revenue",
  "date": "2026-03",
  "user_id": "uuid-do-usuario",
  "createdAt": "2026-03-16T10:00:00.000Z",
  "updatedAt": "2026-03-16T10:00:00.000Z"
}
```

> **Nota:** O saldo do usuário é atualizado atomicamente junto com a criação da transação via `prisma.$transaction`.

#### Erros

| Status | Mensagem                       | Causa                                   |
| ------ | ------------------------------ | --------------------------------------- |
| `400`  | `"Not authorized"`             | Token inválido ou não enviado           |
| `400`  | `"Type and value are required"` | Campos `type` ou `value` não enviados  |
| `400`  | `"Value cannot be negative"`   | Valor inferior a zero                   |
| `400`  | `"User not found"`             | Usuário do token não existe no banco    |

---

### GET /transactions


Lista as transações do usuário autenticado para um período específico.

- **Autenticação:** ✅ Requerida
- **Controller:** `ListTransactionController`
- **Service:** `ListTransactionService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Exemplo   | Descrição                    |
| --------- | ------ | ----------- | --------- | ---------------------------- |
| `date`    | string | ✅          | `2026-03` | Período no formato `YYYY-MM` |

#### Exemplo de Requisição

```
GET /transactions?date=2026-03
```

#### Response — 200 OK

```json
[
  {
    "id": "uuid-da-transacao",
    "description": "Salário",
    "value": 5000.00,
    "type": "revenue",
    "date": "2026-03",
    "user_id": "uuid-do-usuario"
  },
  {
    "id": "uuid-da-transacao-2",
    "description": "Aluguel",
    "value": 1500.00,
    "type": "expense",
    "date": "2026-03",
    "user_id": "uuid-do-usuario"
  }
]
```

> Ordenado por `createdAt` em ordem decrescente (mais recentes primeiro).

#### Erros

| Status | Mensagem             | Causa                         |
| ------ | -------------------- | ----------------------------- |
| `400`  | `"Not authorized"`   | Token inválido ou não enviado |
| `400`  | `"Date is required"` | Parâmetro `date` não enviado  |
| `400`  | `"User not found"`   | Usuário do token não existe   |

---

### DELETE /transactions/delete

Remove uma transação e estorna automaticamente o valor no saldo do usuário.

- **Autenticação:** ✅ Requerida
- **Controller:** `DeleteTransactionController`
- **Service:** `DeleteTransactionService`


#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Descrição                          |
| --------- | ------ | ----------- | ---------------------------------- |
| `item_id` | string | ✅          | UUID da transação a ser removida   |

#### Exemplo de Requisição

```
DELETE /transactions/delete?item_id=uuid-da-transacao
```

#### Response — 200 OK

```json
{
  "message": "Transaction deleted successfully",
  "transactionDeleted": {
    "id": "uuid-da-transacao",
    "description": "Salário",
    "value": 5000.00,
    "type": "revenue",
    "date": "2026-03",
    "user_id": "uuid-do-usuario",
    "createdAt": "2026-03-16T10:00:00.000Z",
    "updatedAt": "2026-03-16T10:00:00.000Z"
  }
}
```

> **Nota:** O saldo é revertido atomicamente junto com a exclusão via `prisma.$transaction`. Despesas são estornadas somando o valor; receitas são estornadas subtraindo.

#### Erros

| Status | Mensagem                                               | Causa                                          |
| ------ | ------------------------------------------------------ | ---------------------------------------------- |
| `400`  | `"Not authorized"`                                     | Token inválido ou não enviado                  |
| `400`  | `"Item ID is required"`                                | Parâmetro `item_id` não enviado                |
| `400`  | `"User not found"`                                     | Usuário do token não existe                    |
| `400`  | `"Transaction not found or does not belong to user"`   | Transação não existe ou pertence a outro usuário |

---

## 🔢 Códigos de Status

| Código | Significado   | Quando ocorre                                              |
| ------ | ------------- | ---------------------------------------------------------- |
| `200`  | OK            | Requisição processada com sucesso                          |
| `400`  | Bad Request   | Erro de validação ou regra de negócio (ver `error` no body)|
| `401`  | Unauthorized  | Token ausente ou inválido no middleware                    |
| `500`  | Server Error  | Erro inesperado no servidor                                |

### Formato de Erro (400)

```json
{
  "error": "Mensagem descritiva do erro"
}
```

### Formato de Erro (500)

```json
{
  "status": "error",
  "message": "Internal server error"
}
```
