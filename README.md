# 🛒 Backend Disco E-commerce

API REST desenvolvida com **NestJS**, **TypeORM** e **MySQL**, para gerenciar todas as operações de um sistema de e-commerce — incluindo produtos, endereços, categorias, clientes, pedidos, pagamentos e itens de pedido.

---

## ⚙️ Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) – framework Node.js modular e escalável  
- [TypeORM](https://typeorm.io/) – ORM para integração com banco de dados  
- [MySQL](https://www.mysql.com/) – banco de dados relacional  
- [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/) – padronização de código  
- [dotenv](https://www.npmjs.com/package/dotenv) – gerenciamento de variáveis de ambiente  

---

## 🧱 Estrutura do Projeto

<img width="580" height="815" alt="image" src="https://github.com/user-attachments/assets/a8c5c77b-73bb-440b-bb02-082db941cd0f" />

> Cada módulo foi gerado via `nest g resource nome`, contendo suas pastas `dto/` e `entities/` para manter o padrão de camadas limpo e escalável.

---

## 🚀 Instalação e Execução

### 🔧 1. Clonar o repositório
git clone https://github.com/alana0vit/backend-disco-ecommerce.git
cd backend-disco-ecommerce

### 📦 2. Instalar dependências
npm install

### ⚙️ 3. Configurar o arquivo `.env`
Crie o arquivo `.env` na raiz do projeto com base no `.env.template`:

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=senha
DB_DATABASE=discoEcommerce
PORT=3000
JWT_SECRET=seu_secret
JWT_EXPIRES_IN=3600s

### ▶️ 4. Executar o projeto

#### Modo desenvolvimento:
npm run start:dev

#### Modo produção:
npm run build
npm run start:prod

---

## 🧩 Principais Scripts

| Comando | Descrição |
|----------|------------|
| `npm run start` | Inicia o servidor em modo padrão |
| `npm run start:dev` | Inicia com **hot reload** |
| `npm run build` | Compila o projeto |
| `npm run lint` | Verifica e corrige problemas de estilo |
| `npm run test` | Executa testes automatizados |

---

## 🧠 Principais Módulos

| Módulo | Descrição |
|--------|------------|
| **Produto** | CRUD de produtos, com filtros, relação com categorias e controle de disponibilidade |
| **Categoria** | Gerenciamento das categorias de produtos |
| **Cliente** | Cadastro e consulta de clientes |
| **Endereço** | Endereços associados aos clientes |
| **Pedido** | Criação e gerenciamento de pedidos |
| **Item Pedido** | Relação entre pedidos e produtos |
| **Pagamento** | Processamento e status de pagamentos |

---

## 📡 Rotas Principais (Exemplos)

| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/produto` | Lista todos os produtos ativos |
| `POST` | `/produto` | Cria um novo produto |
| `GET` | `/produto/disponiveis` | Lista produtos com estoque disponível |
| `GET` | `/produto/:id/disponivel` | Traz a quantidade reservada de um produto |
| `GET` | `/produto/:id` | Busca produto por ID |
| `GET` | `/produto/filtro` | Filtra produtos por nome, categoria e min/max de preço |
| `PATCH` | `/produto/:id` | Atualiza dados de um produto |
| `DELETE` | `/produto/:id` | Remove um produto |
| `GET` | `/cliente` | Lista todos os clientes ativos |
| `POST` | `/cliente` | Cria um novo cliente |
| `GET` | `/cliente/:id` | Busca cliente por ID |
| `PATCH` | `/cliente/:id` | Atualiza dados de um cliente |
| `DELETE` | `/cliente/:id` | Remove um cliente |
| `GET` | `/endereco` | Lista todos os endereços |
| `POST` | `/endereco` | Cria um novo endereço |
| `GET` | `/endereco/:id` | Busca endereço por ID |
| `PATCH` | `/endereco/:id` | Atualiza dados de um endereço |
| `PATCH` | `/endereco/padrao/:id` | Define um endereço como padrão |
| `DELETE` | `/endereco/:id` | Remove um endereço |
| `GET` | `/categoria` | Lista todos os categorias |
| `POST` | `/categoria` | Cria uma nova categoria |
| `GET` | `/categoria/:id` | Busca categoria por ID |
| `PATCH` | `/categoria/:id` | Atualiza dados de uma categoria |
| `DELETE` | `/categoria/:id` | Remove uma categoria |
| `GET` | `/pedido/lista/:id` | Lista todos os pedidos de um cliente|
| `POST` | `/pedido` | Cria um novo pedido |
| `GET` | `/pedido/:id` | Busca pedido por ID |
| `PATCH` | `/pedido/:id` | Atualiza dados de um pedido |
| `DELETE` | `/pedido/:id` | Remove um pedido |
| `GET` | `/pagamento` | Lista todos os pagamentos|
| `POST` | `/pagamento` | Cria um novo pagamento |
| `GET` | `/pagamento/:id` | Busca pagamento por ID |
| `PATCH` | `/pagamento/:id` | Atualiza dados de um pagamento |
| `DELETE` | `/pagamento/:id` | Remove um pagamento |
| `GET` | `/item-pedido` | Lista todos os itens de um pedido |
| `POST` | `/item-pedido` | Cria um novo item|
| `GET` | `/item-pedido/:id` | Busca item por ID |
| `PATCH` | `/item-pedido/:id` | Atualiza dados de um item |
| `DELETE` | `/item-pedido/:id` | Remove um item |

> O projeto roda na URL: http://localhost:3000

---

## 🧱 Banco de Dados

- Utiliza **TypeORM** com **MySQL**.  
- As entidades são sincronizadas automaticamente com o banco.  
- O parâmetro `synchronize: true` facilita o desenvolvimento inicial (recomendado desativar em produção).

---

## 💬 Contato

👤 **Alana Silva**  
📧 [alana.vit.ms@gmail.com](mailto:alana.vit.ms@gmail.com)  
🌐 [linkedin.com/in/alana-silva-ms](https://linkedin.com/in/alana-silva-ms)
