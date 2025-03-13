const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

module.exports = function(passport) {

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha', 

    }, async (email, senha, done) => {
        try {
            console.log(email);
            console.log(senha);

            const usuario = await Usuario.findOne({ where: { email: email } });
            console.log(usuario);
    
            if (!usuario) {
                console.log('Usuário não encontrado.');
                return done(null, false, { message: 'Usuário não encontrado.' });
            }
            
            console.log(`Usuário encontrado: ${usuario.email}`);
            console.log(`Senha informada: ${senha}`);
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            
            if (!senhaValida) {
                console.log('Senha incorreta.');
                return done(null, false, { message: 'Senha incorreta.' });
            }else{
                console.log('Login bem-sucedido.');
                return done(null, usuario);
            }
    
        } catch (error) {
            return done(error);
        }
    }));
    
    passport.serializeUser((usuario, done) => {
        done(null, usuario.cod_usuario);
    });

    passport.deserializeUser(async (cod_usuario, done) => {
        try {
            const usuario = await Usuario.findByPk(cod_usuario);
            done(null, usuario);
        } catch (err) {
            done(err);
        }
    });
};
