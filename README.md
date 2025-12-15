# 🛒 Backend Disco E-commerce

API REST desenvolvida com **NestJS**, **TypeORM** e **MySQL**, para gerenciar todas as operações de um sistema de e-commerce de discos de vinil.

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

### ▶️ 4. Executar o projeto

#### Modo desenvolvimento:
npm run start:dev

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
