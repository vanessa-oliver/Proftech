# ProfTech - Plataforma Educacional

## 📋 Descrição

ProfTech é uma plataforma web educacional completa para criação e gerenciamento de provas e questões. Com suporte a inteligência artificial para geração automática de questões, a plataforma oferece uma experiência moderna e intuitiva.

## ✨ Funcionalidades

- ✅ **Autenticação de Usuários** - Cadastro e login seguro
- ✅ **Gerenciamento de Questões** - Criar, editar e deletar questões
- ✅ **Gerenciamento de Provas** - Montar provas com questões
- ✅ **IA Integrada** - Gerar questões automaticamente com Gemini AI
- ✅ **Dashboard** - Interface intuitiva e responsiva
- ✅ **Banco de Dados** - PostgreSQL com relacionamentos estruturados

## 🛠️ Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: Handlebars + Bootstrap 5
- **Banco de Dados**: PostgreSQL + Sequelize ORM
- **Autenticação**: Passport.js
- **IA**: Google Generative AI (Gemini)

## 📦 Instalação

### Pré-requisitos
- Node.js v16+
- PostgreSQL 12+
- npm

### Passos de instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd projeto-integrador
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (`.env`):
```env
DB_NAME=proftechant
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
KEY_GEMINI=sua_chave_gemini
PORT=3000
```

4. Crie o banco de dados:
```bash
# Execute o arquivo database.sql no seu PostgreSQL
psql -U postgres -d proftechant -f database.sql
```

5. Inicie a aplicação:
```bash
npm start          # Modo produção
npm run dev        # Modo desenvolvimento (com auto-reload)
```

6. Acesse em `http://localhost:3000`

## 🧪 Testes

Para testar a conectividade do banco de dados:
```bash
node test-database.js
```

## 📁 Estrutura do Projeto

```
projeto-integrador/
├── models/              # Modelos Sequelize
│   ├── Assunto.js
│   ├── Usuario.js
│   ├── Prova.js
│   ├── Questao.js
│   ├── QuestãoProva.js
│   ├── cabecalho.js
│   └── associations.js
├── routes/              # Rotas Express
│   ├── admin.js
│   ├── exam.js
│   ├── user.js
│   ├── quest.js
│   ├── subject.js
│   └── IA.js
├── views/               # Templates Handlebars
│   ├── Layouts/
│   ├── Admin/
│   ├── Exam/
│   ├── Quest/
│   ├── Subject/
│   ├── User/
│   ├── IA/
│   └── partials/
├── public/              # Arquivos estáticos
│   ├── css/
│   ├── js/
│   └── images/
├── config/              # Configurações
│   ├── database.js
│   └── auth.js
├── App.js               # Arquivo principal
├── package.json
└── .env                 # Variáveis de ambiente
```

## 🎨 Design

A interface foi completamente renovada com:
- Paleta de cores moderna (azul violeta e roxo)
- Componentes responsivos
- Animações suaves
- 100% mobile-friendly

## 🔐 Segurança

- ✅ Senhas criptografadas com bcryptjs
- ✅ Autenticação com Passport.js
- ✅ Sessões seguras com express-session
- ✅ Validação de entrada
- ✅ Proteção CSRF com flash messages

## 📝 API Routes

### Usuários
- `GET /user/login` - Página de login
- `POST /user/login` - Autenticar usuário
- `GET /user/cadastro` - Página de cadastro
- `POST /user/cadastro` - Criar nova conta
- `GET /user/logout` - Logout

### Questões
- `GET /quest/listquest` - Listar questões
- `GET /quest/createquest` - Criar questão
- `POST /quest/createquest` - Salvar questão
- `GET /quest/updatequest/:id` - Editar questão
- `POST /quest/updatequest/:id` - Atualizar questão
- `GET /quest/deletequest/:id` - Deletar questão

### Provas
- `GET /exam/listprova` - Listar provas
- `GET /exam/addprova` - Criar prova
- `POST /exam/addprova` - Salvar prova
- `GET /exam/updateprova/:id` - Editar prova
- `POST /exam/updateprova/:id` - Atualizar prova
- `GET /exam/deleteprova/:id` - Deletar prova

### IA
- `GET /IA/chat` - Interface de geração com IA
- `POST /IA/chat` - Gerar questões com IA

## 🐛 Troubleshooting

### Porta 3000 já está em uso
```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3000

# Matar o processo (substitua PID)
taskkill /PID <PID> /F
```

### Erro de conexão com banco de dados
- Verifique se PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Verifique se o banco de dados foi criado

### Erro ao gerar questões com IA
- Verifique se a chave do Gemini é válida
- Confirme se tem saldo/quota disponível

## 📧 Suporte

Para dúvidas ou problemas, entre em contato!

## 📄 Licença

MIT License - Veja LICENSE.md para detalhes

---

**Desenvolvido com ❤️ para educadores**
