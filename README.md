# Gerenciador de Tarefas - API

## Descrição

Esta API permite gerenciar tarefas em equipes, onde os usuários podem criar contas, autenticar-se e gerenciar suas tarefas. As tarefas podem ser atribuídas a membros do time, categorizadas por status e prioridade, e acompanhadas ao longo do tempo.

## Tecnologias e Recursos

### **Backend Node.js**
- **Framework:** Express.js
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma

### **Outros**
- Docker/Docker-Compose (banco de dados PostgreSQL rodando em `5432:5432`)
- TypeScript
- Validação com Zod
- JWT para autenticação

## Funcionalidades da Aplicação

### **Autenticação e Autorização**
- Cadastro e login de usuários
- JWT para autenticação
- Níveis de acesso:
  - **Administrador**: Gerencia usuários e equipes
  - **Membro**: Gerencia tarefas atribuídas

### **Gerenciamento de Times**
- Apenas administradores podem criar e editar times
- Apenas administradores podem adicionar ou remover membros do time

### **Tarefas**
- CRUD de tarefas (criação, leitura, atualização, exclusão)
- Status das tarefas: `Pendente`, `Em progresso`, `Concluído`
- Prioridade: `Alta`, `Média`, `Baixa`
- Atribuição de tarefas para membros específicos

### **Usuário Administrador**
- Visualiza e gerencia todas as tarefas, usuários e times

### **Membro**
- Visualiza tarefas do time
- Pode editar apenas suas tarefas

## **Rotas da Aplicação**

- Users:

```javascript
POST (Cria usuário): /users/
GET (Exibe usuários): /users/
GET (Pesquisa usuário): "/users/:id
PUT (Atualiza usuário): /users/:id
DELETE (Exclui usuário): /users/:id
```

- Sessions:

```javascript
POST (Gera o token de autenticação): /sessions/
```

- Teams:

```javascript
POST (Cria equipe): /teams/
GET (Exibe equipes): /teams/
GET (Pesquisa equipe): "/teams/:id
PUT (Atualiza equipe): /teams/:id
DELETE (Exclui equipe): /teams/:id
```

- Team members:

```javascript
POST (Cria membro de time): /team-members/
GET (Exibe membros de times): /team-members/
GET (Pesquisa membro de time): "/team-members/:id
DELETE (Exclui membro de time): /team-members/:id
```

- Tasks:

```javascript
POST (Cria tarefa): /tasks/
GET (Exibe tarefas): /tasks/
GET (Pesquisa tarefa): "/tasks/:id
PUT (Atualiza tarefa): /tasks/:id
DELETE (Exclui tarefa): /tasks/:id

PATCH (Atualiza atribuído a): /tasks/:id/assigned-to
PATCH (Atualiza status): /tasks/:id/status
PATCH (Atualiza prioridade): /tasks/:id/priority
```

- Task history:

```javascript
GET (Exibe histórico das tarefas): /task-history/
```

## **Instalação e Uso**

### **Pré-requisitos**
- Node.js instalado
- Docker instalado

### **Passos para Rodar o Projeto**

1. Clone o repositório:
   ```sh
   git clone https://github.com/igorferreira007/gerenciador-de-tarefas.git
   cd seu-repositorio
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Suba o banco de dados PostgreSQL com Docker:
   ```sh
   docker-compose up -d
   ```

4. Configure as variáveis de ambiente (`.env`):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/seu_banco
   JWT_SECRET=sua_chave_secreta
   PORT=porta_da_aplicação
   ```

5. Rode as migrações do banco de dados:
   ```sh
   npx prisma migrate dev
   ```

6. Inicie a aplicação:
   ```sh
   npm run dev
   ```
