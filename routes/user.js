const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Rota para a página inicial
router.get('/listuser', function(req, res) {
    Usuario.findAll().then(function(usuarios) {
        res.render('User/user', { usuarios: usuarios });
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar os usuários.");
    });
});

// Rota para deletar um usuário
router.get('/del/:cod_usuario', function(req, res) {
    Usuario.destroy({ where: {'cod_usuario': req.params.cod_usuario} })
    .then(function() {
        res.redirect('Admin/index');
    }).catch(function(erro) {
        res.send("Erro ao deletar usuário: " + erro);
    });
});

// Rota para a página de cadastro
router.get('/cadastro', function(req, res) {
    res.render('User/register');
});

// Rota para a página de login
router.get('/login', function(req, res) {
    res.render('User/login');
});

// Rota para adicionar um novo usuário
router.post('/adduser', function(req, res) {
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        password: req.body.password
    }).then(function() {
        res.redirect('User/login');
    }).catch(function(erro) {
        res.send("Erro ao cadastrar usuario: " + erro);
    });
});

module.exports = router;