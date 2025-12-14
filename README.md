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
