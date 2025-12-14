// Carregando módulos
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/auth')(passport);

// Configurando dotenv para variáveis de ambiente
require('dotenv').config();
const fs = require('fs');
let envPort;
try {
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    const match = envContent.match(/^\s*PORT\s*=\s*('?\"?)(\d+)\1/m);
    if (match) envPort = match[2];
} catch (e) {
}
const port = envPort || process.env.PORT || 3001;

// Configurando sessão
app.use(session({
    secret: "projetoproftechpi",
    resave: true,
    saveUninitialized: true
}))

// Configurando Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurando Flash
app.use(flash());

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

// Configurando Template Engine
app.engine('handlebars', exphbs.engine({ 
    defaultLayout: 'main',
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
}));
app.set('view engine', 'handlebars');

// Definindo o diretório de views
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurando Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Importando rotas
const adminRoutes = require('./routes/admin');
const examRoutes = require('./routes/exam');
const userRoutes = require('./routes/user');
const questRoutes = require('./routes/quest');
const IARoutes = require('./routes/IA');
const subjectRoutes = require('./routes/subject');
//const headersRoutes = require('./routes/headers');

// Configurando rotas
app.use('/user', userRoutes);
app.use('/quest', questRoutes);
app.use('/IA', IARoutes);
app.use('/admin', adminRoutes);
app.use('/exam', examRoutes);
app.use('/subject', subjectRoutes);
//app.use('/headers', headersRoutes);

// Servidor
app.listen(port, function(err) {
    if (err) {
        console.error('Erro ao iniciar o servidor:', err);
        return;
    }
    console.log(`Servidor rodando na porta ${port}`);
});
