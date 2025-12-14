const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const passport = require('passport');

// Rota para a página de cadastro
router.get('/cadastro', function(req, res) {
    res.render('User/register');
});

// Rota para a página de cadastro
router.post('/cadastro', function(req, res) {
    var erros = [];

    if(req.body.nome == undefined || req.body.nome == null || req.body.nome == "") {
        erros.push({texto: "Nome inválido."});
    }
    if(req.body.email == undefined || req.body.email == null || req.body.email == "") {
        erros.push({texto: "Email inválido."});
    }
    if(req.body.password == undefined || req.body.password == null || req.body.password == "") {
        erros.push({texto: "Senha inválida."});
    }
    if(req.body.password.length < 6) {
        erros.push({texto: "Senha muito curta."});
    }

    if(req.body.password != req.body.password2) {
        erros.push({texto: "As senhas não são iguais, tente novamente."});
    }

    if(erros.length > 0) {
        res.render('User/register', {erros: erros});

    } else {
        Usuario.findOne({ where: {email: req.body.email} }).then(function(usuario) {
            if(usuario) {
                req.flash("error_msg", "Já existe uma conta com este email.");
                res.redirect('/user/cadastro');
            } else {
                const novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    eAdmin: false,
                    password: req.body.password
                };

                bcryptjs.genSalt(10, function(erro, salt) {
                    bcryptjs.hash(novoUsuario.password, salt, function(erro, hash) {
                        if(erro) {
                            req.flash("error_msg", "Erro ao salvar usuário.");
                            res.redirect('/user/cadastro');
                        }

                        novoUsuario.password = hash;
                        console.log(novoUsuario);
                        Usuario.create(novoUsuario).then(function() {
                            req.flash("success_msg", "Usuário criado com sucesso.");
                            res.redirect('/user/login');
                        }).catch(function(erro) {
                            req.flash("error_msg", "Erro ao criar usuário.");
                            res.redirect('/user/cadastro');
                        });
                    });
                });
            }
        }).catch(function(erro) {
            req.flash("error_msg", "Erro interno.");
            res.redirect('/user/cadastro');
        });
    }
});

// Rota para a página de login
router.get('/login', function(req, res, ) {
    res.render('User/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/user/login', 
    failureFlash: true
}));

// Rota para logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) return next(err);
        res.redirect('/');
    });
});

// Rota para a página inicial
// router.get('/listuser', function(req, res) {
//     Usuario.findAll().then(function(usuarios) {
//         res.render('User/user', { usuarios: usuarios });
//     }).catch(function(error) {
//         console.error(error);
//         res.status(500).send("Ocorreu um erro ao buscar os usuários.");
//     });
// });

// Rota para deletar um usuário
router.get('/del/:cod_usuario', (req, res) =>{
    Usuario.destroy({ where: {'cod_usuario': req.params.cod_usuario} })
    .then(function() {
        req.flash("success_msg", "Usuário deletado com sucesso.");
        res.redirect('/user/cadastro');
    }).catch(function(erro) {
        req.flash("error_msg", "Erro ao deletar usuário: " + erro);
        res.redirect('/user/cadastro');
    });
});

router.get('/updateuser/:cod_usuario', async(req, res)=> {
    try{
        const cod_usuario = req.params.cod_usuario;
        usuario = await Usuario.findByPk(cod_usuario);
        if(usuario){
            res.render('User/updateuser', { usuario: usuario.dataValues });
        }else{
            res.redirect('/user/cadastro');
        }
    }catch{
        res.redirect('/user/cadastro');
    }
});

router.post('/updateuser/:cod_usuario', async (req, res) => {
    console.log('entrou no atualizar')
    const { nome, email, password } = req.body;
    const { cod_usuario } = req.params;
    
    try {
        await Usuario.update(
            { nome, email, password }, 
            { where: { cod_usuario: req.params.cod_usuario } }
        );
        res.redirect('/user/cadastro');
    } catch (error) {
        res.status(500).send('erro ao atualizar usuario');
    }
});

module.exports = router;