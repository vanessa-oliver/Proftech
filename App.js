// Carregando módulos
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
// Configurando dotenv para variáveis de ambiente
require('dotenv').config();
const port = process.env.PORT || 3000;
const apiKey = process.env.KEY_GEMINI;
// Criando API do Google
const genAI = new GoogleGenerativeAI(apiKey);

// Configurando Template Engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Definindo o diretório de views
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurando Body Parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Importando rotas
const userRoutes = require('./routes/user');
const questRoutes = require('./routes/quest');
const IARoutes = require('./routes/IA');
const adminRoutes = require('./routes/admin');

// Configurando rotas
app.use('/user', userRoutes);
app.use('/quest', questRoutes);
app.use('/IA', IARoutes);
app.use('/admin', adminRoutes);

// Servidor
app.listen(port, function() {
    console.log(`Servidor rodando na porta ${port}`);
});
