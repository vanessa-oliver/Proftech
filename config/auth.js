const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

module.exports = function(passport) {

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha', 
    }, async (email, senha, done) => {
        try {
            console.log('Email informado:', email);

            // Busque o usuário no banco de dados com o email fornecido
            const usuario = await Usuario.findOne({ where: { email: email } });
            
            if (!usuario) {
                console.log('Usuário não encontrado.');
                return done(null, false, { message: 'Usuário não encontrado.' });
            }

            console.log(`Usuário encontrado: ${usuario.email}`);
            // A senha armazenada no banco já deve ser criptografada, então não logue ela diretamente
            // Agora comparamos a senha fornecida com a senha criptografada armazenada no banco
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            
            if (!senhaValida) {
                console.log('Senha incorreta.');
                return done(null, false, { message: 'Senha incorreta.' });
            } else {
                console.log('Login bem-sucedido.');
                return done(null, usuario); // Passando o usuário para a sessão
            }
        } catch (error) {
            console.error('Erro de autenticação:', error);
            return done(error);
        }
    }));
    
    // Serializa o usuário para armazenar seu identificador na sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.cod_usuario); // Usando o id do usuário como identificador único
    });

    // Desserializa o usuário a partir do identificador para carregar os dados do usuário da sessão
    passport.deserializeUser(async (cod_usuario, done) => {
        try {
            const usuario = await Usuario.findByPk(cod_usuario);
            done(null, usuario); // O usuário é passado para a sessão
        } catch (err) {
            done(err); // Se houver erro, passa para o próximo middleware de erro
        }
    });
};
