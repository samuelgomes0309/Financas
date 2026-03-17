# 📖 CONTEXTO TÉCNICO — FinançasGomes Frontend

Documento de referência técnica do frontend do sistema de controle financeiro. Descreve a arquitetura, componentes, fluxos, validação, tema e convenções do projeto.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Roteamento e Guards](#-roteamento-e-guards)
- [Autenticação (AuthContext)](#-autenticação-authcontext)
- [Comunicação com a API](#-comunicação-com-a-api)
- [Páginas da Aplicação](#-páginas-da-aplicação)
- [Componentes Reutilizáveis](#-componentes-reutilizáveis)
- [Validação de Formulários](#-validação-de-formulários)
- [Tema e Estilização](#-tema-e-estilização)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Convenções e Padrões](#-convenções-e-padrões)

---

## 🎯 Visão Geral

O **FinançasGomes Frontend** é uma SPA (Single Page Application) em React que consome a API REST do backend. A interface permite cadastro, login, gerenciamento de transações financeiras (receitas e despesas), visualização de saldo e filtro por período — tudo com design responsivo.

### Domínios da aplicação

| Domínio          | Responsabilidade                                            |
| ---------------- | ----------------------------------------------------------- |
| **Autenticação** | Cadastro, login, validação de sessão, logout                |
| **Dashboard**    | Visão de saldo, receitas, despesas e listagem de transações |
| **Registro**     | Formulário de criação de transações (receita ou despesa)    |
| **Perfil**       | Exibição dos dados do usuário autenticado                   |

---

## 🚀 Stack Tecnológica

| Camada       | Tecnologia          | Versão  | Papel                                             |
| ------------ | ------------------- | ------- | ------------------------------------------------- |
| UI           | React               | 19.1.1  | Renderização de componentes e gerenciamento de UI |
| Linguagem    | TypeScript          | 5.9     | Tipagem estática e segurança em desenvolvimento   |
| Build        | Vite                | 7.1.7   | Bundler, dev server com HMR ultrarrápido          |
| Estilização  | Tailwind CSS        | 4.1.16  | Classes utilitárias CSS com tema customizado      |
| Ícones       | Lucide React        | 0.552.0 | Ícones SVG como componentes React                 |
| Formulários  | React Hook Form     | 7.66.0  | Gerenciamento performático de formulários         |
| Validação    | Zod                 | 4.1.12  | Schemas de validação TypeScript-first             |
| Resolvers    | @hookform/resolvers | 5.2.2   | Integração Zod ↔ React Hook Form                  |
| Roteamento   | React Router DOM    | 7.9.5   | Navegação entre páginas (SPA)                     |
| HTTP         | Axios               | 1.13.1  | Cliente HTTP para chamadas à API backend          |
| Datas        | Day.js              | 1.11.19 | Manipulação leve de datas                         |
| Calendário   | React Calendar      | 6.0.0   | Componente de calendário para seleção de datas    |
| Notificações | React Hot Toast     | 2.6.0   | Toast notifications para feedback ao usuário      |
| Lint         | ESLint              | 9.39.0  | Linter para qualidade e padronização do código    |
| Formatação   | Prettier            | 3.6.2   | Formatador automático de código                   |

---

## 🏗️ Arquitetura

### Visão Geral do Fluxo

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

### Estrutura de Camadas

| Camada          | Diretório            | Responsabilidade                                          |
| --------------- | -------------------- | --------------------------------------------------------- |
| **Entrada**     | `main.tsx`           | Monta providers (AuthContext, Toaster) e o RouterProvider |
| **Roteamento**  | `App.tsx`, `routes/` | Define rotas e aplica guards de autenticação              |
| **Páginas**     | `pages/`             | Composição de layout, estado local e chamadas à API       |
| **Componentes** | `components/`        | Elementos de UI reutilizáveis (Header, Sidebar, botões)   |
| **Contexto**    | `contexts/`          | Estado global da aplicação (autenticação)                 |
| **API**         | `api/`               | Instância Axios configurada                               |

### Ponto de Entrada (`main.tsx`)

```typescript
createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    <RouterProvider router={router} />
  </AuthContextProvider>
);
```

- `AuthContextProvider` envolve toda a aplicação, tornando os dados de autenticação acessíveis em qualquer componente
- `Toaster` provê notificações toast globais
- `RouterProvider` inicializa o sistema de rotas do React Router

---

## 🛣️ Roteamento e Guards

### Definição das Rotas (`App.tsx`)

O roteamento é definido com `createBrowserRouter` do React Router DOM v7:

| Rota        | Guard     | Componente  | Descrição                               |
| ----------- | --------- | ----------- | --------------------------------------- |
| `/`         | `Private` | `Dashboard` | Página principal com saldo e transações |
| `/register` | `Private` | `Register`  | Formulário de criação de transação      |
| `/profile`  | `Private` | `Profile`   | Dados do usuário autenticado            |
| `/login`    | `Public`  | `Login`     | Telas de login e cadastro               |

### Guards de Rota

#### `PrivateRoute`

Protege rotas que exigem autenticação:

```
1. Verifica loadingAuth → exibe RouterLoader (spinner)
2. Verifica signed → se false, redireciona para /login
3. Se autenticado → renderiza children
```

#### `PublicRoute`

Protege rotas que só devem ser acessadas por usuários não autenticados:

```
1. Verifica loadingAuth → exibe RouterLoader (spinner)
2. Verifica signed → se true, redireciona para /
3. Se não autenticado → renderiza children
```

#### `RouterLoader`

Componente de loading exibido enquanto o `AuthContext` valida o token do usuário. Exibe um spinner animado com a mensagem "Carregando...".

---

## 🔐 Autenticação (AuthContext)

### Visão Geral

O `AuthContext` é o contexto global que gerencia todo o estado de autenticação da aplicação. Ele é provido pelo `AuthContextProvider` e consumido via `useContext(AuthContext)`.

### Interface do Contexto

```typescript
interface ContextProps {
	user: UserProps | null; // Dados do usuário logado (ou null)
	handleSignUp: (data: SignUpData) => Promise<boolean>;
	handleLogin: (data: SignInData) => Promise<boolean>;
	signed: boolean; // true se user !== null
	logOut: () => Promise<void>;
	loadingAuth: boolean; // true enquanto valida o token
}
```

### Interface do Usuário

```typescript
interface UserProps {
	user_id: string;
	name: string;
	email: string;
	balance: number;
}
```

### Fluxo Completo de Autenticação

```
1. App carrega → AuthContextProvider monta
      │
2. useEffect chama validateUser()
      │
3. Verifica localStorage("@financeT")
      │
4a. Se não há token → setUser(null), loadingAuth = false
      │
4b. Se há token → GET /users/me com o token
      │
5a. Se API aceita → seta user e configura Axios default header
5b. Se API rejeita → setUser(null) (token expirado/inválido)
      │
6. loadingAuth = false → guards liberam a navegação
```

### Métodos

#### `handleSignUp(data: SignUpData): Promise<boolean>`

1. Envia `POST /users/signup` com `{ name, email, password }`
2. Se sucesso, chama `handleLogin` automaticamente com as mesmas credenciais
3. Retorna `true` se tudo OK, `false` em caso de erro
4. Exibe toast de erro em caso de falha

#### `handleLogin(data: SignInData): Promise<boolean>`

1. Envia `POST /users/session` com `{ email, password }`
2. Recebe `{ id, name, email, balance, token }`
3. Seta `user` no estado, configura `Authorization` header no Axios
4. Salva token no `localStorage` com chave `@financeT`
5. Retorna `true` se OK, `false` em caso de erro

#### `logOut(): Promise<void>`

1. Remove `@financeT` do `localStorage`
2. Seta `user` como `null`
3. Guards redirecionam para `/login`

### Persistência do Token

| Ação               | Storage                                    |
| ------------------ | ------------------------------------------ |
| Login bem-sucedido | `localStorage.setItem("@financeT", token)` |
| Logout             | `localStorage.removeItem("@financeT")`     |
| Validação ao abrir | `localStorage.getItem("@financeT")`        |

---

## 📡 Comunicação com a API

### Instância Axios (`api/api.ts`)

```typescript
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});
```

- A `baseURL` é configurável via variável de ambiente `VITE_API_URL`
- Fallback para `http://localhost:3333` se não definida
- Após o login, o header `Authorization` é configurado globalmente:

```typescript
api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

### Chamadas à API por Página

| Página      | Endpoint                      | Método | Quando                             |
| ----------- | ----------------------------- | ------ | ---------------------------------- |
| Dashboard   | `GET /users/balance`          | GET    | Ao montar e ao filtrar por data    |
| Dashboard   | `GET /transactions`           | GET    | Ao montar e ao filtrar por data    |
| Dashboard   | `DELETE /transactions/delete` | DELETE | Ao clicar em excluir transação     |
| Register    | `POST /transactions/create`   | POST   | Ao submeter o formulário           |
| AuthContext | `POST /users/signup`          | POST   | Ao submeter formulário de cadastro |
| AuthContext | `POST /users/session`         | POST   | Ao submeter formulário de login    |
| AuthContext | `GET /users/me`               | GET    | Ao carregar a app (validar token)  |

---

## 📄 Páginas da Aplicação

### Login (`pages/login/`)

Página que alterna entre dois sub-componentes: **SignIn** e **SignUp**.

#### Estrutura

- `index.tsx` — Controla o estado `isLogin` que determina qual formulário exibir
- `signin/index.tsx` — Formulário de login (email + senha)
- `signup/index.tsx` — Formulário de cadastro (nome + email + senha)
- `schema.ts` — Schemas Zod (`signinSchema`, `signUpSchema`)
- `components/` — Componentes compartilhados entre SignIn e SignUp

#### Fluxo do Login

```
1. Usuário preenche email e senha
2. Zod valida os campos (signinSchema)
3. Se válido → handleLogin(data) via AuthContext
4. Se API retorna sucesso → toast de sucesso → nav("/")
5. Se API retorna erro → toast de erro
```

#### Fluxo do Cadastro

```
1. Usuário preenche nome, email e senha
2. Zod valida os campos (signUpSchema)
3. Se válido → handleSignUp(data) via AuthContext
4. handleSignUp cria o usuário e faz login automático
5. Se sucesso → toast de sucesso → nav("/")
6. Se erro → toast de erro
```

#### Componentes Internos

| Componente  | Arquivo         | Descrição                                                |
| ----------- | --------------- | -------------------------------------------------------- |
| `HeaderMsg` | `headerMsg.tsx` | Logo, título "Bem-Vindo" e subtítulo descritivo          |
| `InputForm` | `inputForm.tsx` | Input genérico com ícone, foco visual e integração RHF   |
| `LabelMsg`  | `labelMsg.tsx`  | Label estilizada para campos de formulário               |
| `FooterMsg` | `footerMsg.tsx` | Mensagem de rodapé com botão para alternar SignIn/SignUp |

---

### Dashboard (`pages/dashboard/`)

Página principal da aplicação. Exibe o resumo financeiro e a lista de transações do período.

#### Estado Local

| Estado          | Tipo                     | Descrição                                    |
| --------------- | ------------------------ | -------------------------------------------- |
| `balance`       | `BalanceData \| null`    | Dados do balanço (saldo, receitas, despesas) |
| `transactions`  | `TransactionItemProps[]` | Lista de transações do período               |
| `date`          | `string`                 | Data atual do filtro (formato `dd/MM/yyyy`)  |
| `filterDate`    | `Date \| null`           | Data selecionada no calendário do filtro     |
| `modalVisible`  | `boolean`                | Controla exibição do modal de filtro         |
| `loadingFilter` | `boolean`                | Loading durante a aplicação do filtro        |

#### Interfaces de Dados

```typescript
interface BalanceData {
	balance: number;
	revenue: { items: []; total: number };
	expense: { items: []; total: number };
}

interface TransactionItemProps {
	id: string;
	type: string;
	date: string;
	description: string;
	user_id: string;
	value: number;
}
```

#### Fluxo de Carregamento

```
1. Componente monta → useEffect
2. Chama handleSearchBalance() e handleSearchTransactions() em paralelo (Promise.all)
3. Ambas as requisições usam a data atual como parâmetro
4. Atualiza os estados balance e transactions
```

#### Fluxo de Filtro

```
1. Usuário clica em "Filtro" → abre FilterModal
2. Seleciona uma data no calendário
3. Clica em "Selecionar"
4. handleFilter() → chama handleSearchTransactions(filter) e handleSearchBalance(filter)
5. Atualiza date, fecha o modal
```

#### Fluxo de Exclusão

```
1. Usuário clica no ícone de lixeira em um CardItem
2. handleDeleteItem(item_id) → DELETE /transactions/delete?item_id=...
3. Após exclusão → recarrega transações e balanço do período atual
```

#### Componentes Internos

| Componente    | Arquivo           | Descrição                                               |
| ------------- | ----------------- | ------------------------------------------------------- |
| `CardBalance` | `cardBalance.tsx` | Card com ícone e valor: saldo, receita ou despesa       |
| `CardItem`    | `cardItem.tsx`    | Linha de transação com descrição, valor e botão excluir |
| `FilterModal` | `filterModal.tsx` | Modal overlay com calendário e botões Selecionar/Sair   |

#### CardBalance — Lógica de Estilo

O `CardBalance` recebe a prop `type` e aplica cores dinamicamente:

| Tipo      | Cor de fundo do ícone | Cor do ícone     | Valor exibido               |
| --------- | --------------------- | ---------------- | --------------------------- |
| `balance` | `bg-blue-200`         | `text-blue-700`  | Saldo (com `-` se negativo) |
| `revenue` | `bg-green-200`        | `text-green-700` | Total de receitas           |
| `expense` | `bg-red-200`          | `text-red-700`   | Total de despesas           |

---

### Register (`pages/register/`)

Formulário para criação de novas transações financeiras.

#### Fluxo de Criação

```
1. Usuário seleciona o tipo (despesa/receita) via CardTypeReg
2. Preenche valor e descrição
3. Zod valida com formInputSchema (valor é string)
4. submit() converte para formRegisterSchema (valor vira number com parseFloat)
5. POST /transactions/create com { date, description, type, value }
6. Sucesso → toast + reset do formulário
```

#### Schema de Validação (Duplo)

O registro usa dois schemas por conta da conversão de tipos:

1. **`formInputSchema`**: tipo do formulário (value é `string`)
   - Valida que value não é vazio, não é negativo, é um número válido
   - Aceita vírgula e ponto como separador decimal
2. **`formRegisterSchema`**: estende o input, transforma value em `number`
   - `transform((val) => parseFloat(val.replace(",", ".")))`
   - Valida que o valor final é > 0

#### Componentes Internos

| Componente    | Arquivo           | Descrição                                            |
| ------------- | ----------------- | ---------------------------------------------------- |
| `CardTypeReg` | `cardTypeReg.tsx` | Radio card visual para selecionar receita ou despesa |
| `InputReg`    | `inputReg.tsx`    | Input com ícone e feedback visual (foco/erro)        |
| `LabelReg`    | `labelReg.tsx`    | Label estilizada para o formulário de registro       |

---

### Profile (`pages/profile/`)

Página simples que exibe os dados do usuário autenticado.

- Consome `user` do `AuthContext`
- Exibe `name` e `email` em campos read-only estilizados
- Layout: Sidebar + Header + Card com informações

---

## 🧩 Componentes Reutilizáveis

### `Header` (`components/header/`)

Barra superior presente em todas as páginas autenticadas.

| Prop    | Tipo   | Descrição                 |
| ------- | ------ | ------------------------- |
| `title` | string | Título exibido à esquerda |

Exibe o título da página e os dados do usuário (nome + email) à direita. Consome `user` do `AuthContext`.

---

### `Sidebar` (`components/sidebar/`)

Menu de navegação lateral (desktop) ou barra horizontal (mobile).

#### Itens de Navegação

| Ícone          | Label     | Rota        |
| -------------- | --------- | ----------- |
| `Home`         | Dashboard | `/`         |
| `ListPlus`     | Registrar | `/register` |
| `UserRoundPen` | Perfil    | `/profile`  |

Inclui botão de **Sair** (logout) que chama `logOut()` do `AuthContext`.

#### `ItemLink` (`components/sidebar/components/itemLink.tsx`)

Link individual do menu. Recebe `icon`, `label` e `linkTo`. Destaca visualmente a rota ativa comparando `location.pathname` com `linkTo`.

---

### `ErrorMsg` (`components/errorMsg/`)

Componente inline para exibir mensagens de erro de validação abaixo dos campos.

```typescript
<ErrorMsg>{errors.email?.message}</ErrorMsg>
```

---

### `SubmitBtn` (`components/submitBtn/`)

Botão de submit reutilizável com estado de loading.

| Prop       | Tipo    | Descrição                                   |
| ---------- | ------- | ------------------------------------------- |
| `label`    | string  | Texto do botão quando habilitado            |
| `disabled` | boolean | Se `true`, exibe spinner e desabilita click |

---

## ✅ Validação de Formulários

Todos os formulários utilizam o padrão **Zod + React Hook Form + @hookform/resolvers**.

### Schemas Disponíveis

#### Login (`pages/login/schema.ts`)

| Schema         | Campos                      | Validação                                     |
| -------------- | --------------------------- | --------------------------------------------- |
| `signinSchema` | `email`, `password`         | Email válido, senha obrigatória (min 6 chars) |
| `signUpSchema` | `name`, `email`, `password` | Nome obrigatório, email válido, senha min 6   |

#### Registro (`pages/register/schema.ts`)

| Schema               | Campos                         | Validação                                                         |
| -------------------- | ------------------------------ | ----------------------------------------------------------------- |
| `formInputSchema`    | `value`, `description`, `type` | Value string não vazia/negativa/NaN, description min 1, type enum |
| `formRegisterSchema` | Estende `formInputSchema`      | Transforma value string → number, valida > 0                      |

### Padrão de Uso

```typescript
const {
	register,
	handleSubmit,
	formState: { errors, isSubmitting },
} = useForm<T>({
	resolver: zodResolver(schema),
});
```

### Feedback Visual

- Campo com foco: borda `outline-primary`
- Campo com erro: borda `outline-danger`
- Mensagem de erro: `<ErrorMsg>` abaixo do campo
- Botão desabilitado durante submissão (`isSubmitting`)

---

## 🎨 Tema e Estilização

### Configuração do Tema (`App.css`)

O Tailwind CSS é configurado com cores customizadas via `@theme`:

```css
@import "tailwindcss";

@theme {
	--color-background-light: #f0f4ff;
	--color-white: #ffffff;
	--color-success: #00b94a;
	--color-primary: #3b3dbf;
	--color-danger: #ef463a;
	--color-black: #171717;
	--color-secondary: #6567dd;
}
```

### Paleta de Cores

| Token              | Hex       | Uso                                                 |
| ------------------ | --------- | --------------------------------------------------- |
| `background-light` | `#f0f4ff` | Fundo de todas as páginas e inputs                  |
| `white`            | `#ffffff` | Cards, sidebar, header                              |
| `success`          | `#00b94a` | Logo/ícone da carteira, receitas                    |
| `primary`          | `#3b3dbf` | Botões principais, bordas de foco, link ativo       |
| `danger`           | `#ef463a` | Erros, botão de sair, despesas                      |
| `black`            | `#171717` | Textos principais                                   |
| `secondary`        | `#6567dd` | Links de ação, hover de botões, borda ativa sidebar |

### Responsividade

O layout usa abordagem **mobile-first**. O breakpoint principal é `md` (768px):

| Viewport      | Sidebar                     | Header                   |
| ------------- | --------------------------- | ------------------------ |
| Mobile        | Barra horizontal no topo    | Abaixo da sidebar        |
| Desktop (md+) | Coluna fixa à esquerda (64) | Topo do conteúdo direito |

---

## ⚙️ Variáveis de Ambiente

| Variável       | Obrigatória | Exemplo                 | Descrição               |
| -------------- | ----------- | ----------------------- | ----------------------- |
| `VITE_API_URL` | ❌          | `http://localhost:3333` | URL base da API backend |

> Se `VITE_API_URL` não for definida, o Axios usa `http://localhost:3333` como fallback.

---

## 📐 Convenções e Padrões

### Nomenclatura

| Contexto               | Padrão      | Exemplo                           |
| ---------------------- | ----------- | --------------------------------- |
| Componentes            | PascalCase  | `CardBalance`, `ItemLink`         |
| Arquivos de componente | camelCase   | `cardBalance.tsx`, `itemLink.tsx` |
| Páginas (index)        | camelCase   | `index.tsx`                       |
| Schemas                | camelCase   | `signinSchema`, `formInputSchema` |
| Interfaces             | PascalCase  | `UserProps`, `BalanceData`        |
| Contextos              | PascalCase  | `AuthContext`                     |
| Hooks de estado        | camelCase   | `loadingAuth`, `filterDate`       |
| Variáveis de ambiente  | UPPER_SNAKE | `VITE_API_URL`                    |

### Estrutura de uma Página Autenticada

Todas as páginas autenticadas seguem o mesmo padrão de layout:

```tsx
<div className="... flex min-h-screen ... flex-col md:flex-row">
	<Sidebar />
	<main className="flex w-full flex-col">
		<Header title="Título da Página" />
		<section className="p-4">{/* Conteúdo da página */}</section>
	</main>
</div>
```

### Padrão de Formulário

```tsx
// 1. Schema Zod
const schema = z.object({ ... });

// 2. Hook useForm com resolver
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(schema),
});

// 3. Função de submit
async function submit(data) {
  // chamada à API
}

// 4. JSX
<form onSubmit={handleSubmit(submit)}>
  <Input register={register} name="campo" error={errors.campo?.message} />
  <ErrorMsg>{errors.campo?.message}</ErrorMsg>
  <SubmitBtn label="Enviar" disabled={isSubmitting} />
</form>
```

### Notificações (Toast)

O projeto usa `react-hot-toast` para feedback ao usuário:

| Tipo                 | Quando                                          |
| -------------------- | ----------------------------------------------- |
| `toast.success(msg)` | Login/cadastro/criação de transação com sucesso |
| `toast.error(msg)`   | Erros de validação, falhas de API               |

Configuração global: posição `top-right`, duração `3000ms`.

### Tratamento de Erros

- Erros de validação: exibidos inline via `<ErrorMsg>` abaixo de cada campo
- Erros de API: capturados via `try/catch` e exibidos como toast
- Erros Zod no Register: capturados separadamente (`instanceof z.ZodError`)
- Console: erros também são logados via `console.log` para depuração
