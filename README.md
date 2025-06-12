# API de Integração com ClickUp - Teste Prático

Esta é uma API RESTful desenvolvida em **Node.js** como parte de um teste prático. O objetivo é fornecer uma interface para integrar sistemas internos com a plataforma de gerenciamento de tarefas **ClickUp**.

O projeto inclui uma documentação interativa com **Swagger**, um **cliente de frontend para testes visuais** e está preparado para deploy em produção utilizando **Docker**.

## Como Testar a API

Existem duas maneiras de testar esta API, uma online e outra localmente.

### Opção 1 (Recomendada): Usando a API em Produção

A API já está implantada e em execução na plataforma Render. Você pode testar todas as suas funcionalidades imediatamente, sem precisar configurar nada na sua máquina.

> Acesse a **[Documentação Interativa (Swagger)](https://challenge-clickup-api.onrender.com/api-docs)** para começar os testes.

### Opção 2: Executando o Projeto Localmente

Se preferir inspecionar o código e rodar a aplicação em seu próprio ambiente, siga os passos de instalação detalhados na seção "Começando".

* **Importante:** Para executar localmente, será necessário criar seu próprio arquivo `.env` e configurá-lo com suas credenciais do ClickUp, conforme instruído na seção "Como Obter as Credenciais do ClickUp".

---

## Ferramentas de Interação

Para interagir com a API (seja a versão em produção ou a local), você pode usar as seguintes ferramentas:

### 1. Documentação Interativa (Swagger)

A documentação completa e interativa da API foi criada com Swagger (OpenAPI) e é a principal ferramenta para testes.

* **URL (Produção):** [https://challenge-clickup-api.onrender.com/api-docs](https://challenge-clickup-api.onrender.com/api-docs)
* **URL (Local):** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### 2. Frontend de Teste Visual

Um cliente de frontend simples e desacoplado foi criado para demonstrar as funcionalidades de forma visual.

* **Localização:** O código está na pasta separada `clickup-web`
* **Como Usar:**
    1.  Com a API em execução (localmente ou na nuvem), abra o arquivo `index.html` diretamente no seu navegador.
    2.  **Importante:** Por padrão, este cliente está configurado para se comunicar com a API local (`http://localhost:3000`). Para apontá-lo para a API em produção, basta alterar a constante `API_BASE_URL` no topo do arquivo `script.js`.

---

## Arquitetura e Design

A arquitetura deste projeto foi uma decisão consciente para demonstrar a construção de um software robusto, escalável e de fácil manutenção, mesmo para um escopo definido.

### Clean Architecture & DDD

O projeto segue os princípios da **Clean Architecture** e do **Domain-driven Design (DDD)**. A principal regra é a da dependência, que aponta sempre para o centro, protegendo a lógica de negócio de detalhes externos.

* **Domain:** A camada mais interna, contendo a entidade `Task` com suas regras de negócio puras, sem dependências externas. Este é o coração da aplicação.
* **Application (app):** Orquestra os fluxos de dados e contém os **Casos de Uso** (Use Cases), que representam todas as funcionalidades que o sistema pode executar (ex: `CreateTaskUseCase`). Esta camada depende apenas do Domínio.
* **Infrastructure (infra):** A camada mais externa, onde residem os detalhes de implementação como o servidor web (Express), acesso a banco de dados, e serviços de terceiros (ClickUp API). Ela depende das camadas internas.

Essa separação garante que o núcleo da aplicação seja independente de frameworks e tecnologias, tornando-o altamente testável e duradouro.

### Flexibilidade do Armazenamento

Para simplificar a execução, as tarefas são persistidas localmente em um arquivo `database.json`. No entanto, graças à arquitetura adotada, este método de armazenamento pode ser facilmente substituído por um banco de dados mais robusto (como MongoDB ou PostgreSQL).

Isso é possível porque os Casos de Uso não dependem da implementação `JsonFileTaskRepository`, mas sim da interface `ITaskRepository`. Para trocar o banco de dados, bastaria:
1.  Criar uma nova classe, como `MongoTaskRepository`, que implemente a mesma interface.
2.  Trocar uma única linha no arquivo `src/main.js`, onde a dependência é injetada.

Nenhuma outra parte da aplicação precisaria ser alterada.

---

## Estrutura da API

```text

clickup-api/
├── database/
│   └── database.json
│
├── src/
│   ├── app/
│   │   ├── use-cases/
│   │   │   ├── ClearAllLocalTasks/
│   │   │   │   └── ClearAllLocalTasksUseCase.js
│   │   │   ├── CreateTask/
│   │   │   │   └── CreateTaskUseCase.js
│   │   │   ├── DeleteLocalTask/
│   │   │   │   └── DeleteLocalTaskUseCase.js
│   │   │   ├── GetAllLocalTasks/
│   │   │   │   └── GetAllLocalTasksUseCase.js
│   │   │   └── SyncAndGetAllTasks/
│   │   │       └── SyncAndGetAllTasksUseCase.js
│   │   ├── repositories/
│   │   │   └── ITaskRepository.js
│   │   └── services/
│   │       └── IClickUpService.js
│   │
│   ├── core/
│   │   └── errors/
│   │       ├── ApplicationError.js
│   │       ├── NotFoundError.js
│   │       ├── ServiceError.js
│   │       └── ValidationError.js
│   │
│   ├── domain/
│   │   └── entities/
│   │       ├── Task.js
│   │       └── Task.test.js
│   │
│   ├── infra/
│   │   ├── config/
│   │   │   └── index.js
│   │   ├── database/
│   │   │   └── json-file/
│   │   │       └── JsonFileTaskRepository.js
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   │   ├── StorageController.js
│   │   │   │   └── TaskController.js
│   │   │   ├── routes/
│   │   │   │   ├── storage.routes.js
│   │   │   │   └── task.routes.js
│   │   │   └── server.js
│   │   └── services/
│   │       └── ClickUpApiService.js
│   │
│   └── main.js
│
├── .env
├── .env.example
├── .gitignore
├── openapi.yaml
├── Dockerfile
├── .dockerignore
├── package.json
└── package-lock.json

```

---

## Visão Detalhada das Rotas

A API foi projetada com uma separação clara entre as operações que lidam com o recurso principal (Tarefas) e as operações de manutenção do estado interno da aplicação.

### Recurso Principal: `/api/tasks`

Estes endpoints representam as operações centrais sobre o recurso **Tarefa** e envolvem comunicação com a API do ClickUp.

* `GET /api/tasks`: Sincroniza e retorna a lista completa de tarefas.
* `POST /api/tasks`: Cria uma nova tarefa no ClickUp e a persiste localmente.
* `DELETE /api/tasks/:id`: Exclui uma tarefa específica do armazenamento local. A rota está neste escopo por operar diretamente sobre um recurso de Tarefa identificado por seu ID.

### Manutenção do Armazenamento: `/api/storage`

Estes endpoints foram criados intencionalmente como uma **ferramenta de diagnóstico e gerenciamento** do armazenamento de dados local. Eles são desacoplados da lógica de negócio principal e permitem que um desenvolvedor (ou um sistema automatizado) inspecione e gerencie o estado do cache da aplicação sem interagir com o ClickUp.

* `GET /api/storage`: Retorna a lista completa de tarefas diretamente do arquivo `database.json`, servindo como um "snapshot" do estado atual.
* `DELETE /api/storage`: Limpa completamente o armazenamento local, útil para resetar o estado da aplicação durante testes ou manutenção.

---

## Começando

Siga as instruções abaixo para configurar e executar o projeto localmente.

- Requisitos:
    - Node.js (v18 ou superior) ou Docker
    - git

- Comece clonando o repositório e entrando no diretório da API:

```bash
git clone https://github.com/igorservo159/challenge-clickup-api
cd clickup-api
```

- Configure as Variáveis de Ambiente:

Este projeto requer variáveis de ambiente para se conectar à API do ClickUp. Um arquivo de exemplo chamado `.env.example` é fornecido.

Faça uma cópia deste arquivo e renomeie-a para `.env`:
```bash
cp .env.example .env
```

Abra o novo arquivo `.env` e preencha as variáveis com seus próprios dados do ClickUp. As instruções para obter cada valor estão abaixo.

### Como Obter as Credenciais do ClickUp

* **`PERSONAL_TOKEN`**:
    1.  Acesse sua conta do ClickUp.
    2.  Clique no seu avatar no canto inferior esquerdo e vá para **"My Settings"**.
    3.  No menu esquerdo, clique em **"Apps"**.
    4.  Clique no botão **"Generate"** para criar um novo token de API. Copie este valor.

* **`LIST_ID`**:
    1.  Navegue até a lista de tarefas que você deseja usar no ClickUp.
    2.  Olhe para a URL no seu navegador. Ela terá um formato como `https://app.clickup.com/123456/v/li/987654321`.
    3.  O `LIST_ID` é a sequência de números após `/li/`. No exemplo acima, seria `987654321`.

### Instalação com Docker

- Construa a imagem Docker:

```bash
docker build -t clickup-api .
```

- Execute o contêiner:

```bash
docker run --env-file ./.env -p 3000:3000 -d --name clickup-api-container clickup-api
```

Ele utilizará seu arquivo .env local de forma segura, sem copiá-lo para dentro da imagem.

> Para ver os logs, utilize: 

```bash
docker logs clickup-api-container
```

Já para parar o contêiner, utilize:
```bash
docker stop clickup-api-container
```

### Instalação sem Docker

- Instale as dependências:
```bash
npm install
```

- Com as dependências instaladas e o arquivo `.env` configurado, inicie o servidor:

```bash
npm run dev
```

O servidor será iniciado em modo de desenvolvimento. As seguintes mensagens devem aparecer no console:

```text
🚀 API Server rodando em http://localhost:3000
📄 Documentação Swagger disponível em http://localhost:3000/api-docs
```

### Testes

Para executar os testes unitários da camada de domínio, utilize o comando:

```bash
npm test
```
