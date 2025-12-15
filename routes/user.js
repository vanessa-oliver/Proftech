const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.get('/cadastro', function(req, res) {
    const redirect = req.query.redirect || '/user/login';
    res.render('User/register', { redirect });
});

router.post('/cadastro', function(req, res) {
    const redirect = req.body.redirect || '/user/login';
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

    if(req.body.password != req.body.password2) {
        erros.push({texto: "As senhas não são iguais, tente novamente."});
    }

    if(erros.length > 0) {
        res.render('User/register', {erros: erros, redirect});

    } else {
        Usuario.findOne({ where: {email: req.body.email} }).then(function(usuario) {
            if(usuario) {
                req.flash("error_msg", "Já existe uma conta com este email.");
                res.redirect('/user/cadastro?redirect=' + encodeURIComponent(redirect));
            } else {
                const novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    eAdmin: false,
                    password: req.body.password
                };

                Usuario.create(novoUsuario).then(function() {
                    req.flash("success_msg", "Usuário criado com sucesso.");
                    res.redirect(redirect);
                }).catch(function(erro) {
                    req.flash("error_msg", "Erro ao criar usuário.");
                    res.redirect('/user/cadastro?redirect=' + encodeURIComponent(redirect));
                });
            }
        }).catch(function(erro) {
            req.flash("error_msg", "Erro interno.");
            res.redirect('/user/cadastro?redirect=' + encodeURIComponent(redirect));
        });
    }
});

// API: retornar lista de usuários (id + nome) em JSON
router.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: ['cod_usuario', 'nome'] });
        res.json(usuarios.map(u => u.get({ plain: true })));
    } catch (error) {
        console.error('Erro ao buscar usuarios (API):', error);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
    }
});

// API: criar usuário simples via JSON
router.post('/api/usuarios', async (req, res) => {
    try {
        const { nome, email, password } = req.body;
        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'nome, email e password são obrigatórios' });
        }
        const existing = await Usuario.findOne({ where: { email } });
        if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

        const novo = await Usuario.create({ nome, email, password, eAdmin: false });
        res.status(201).json({ cod_usuario: novo.cod_usuario, nome: novo.nome });
    } catch (error) {
        console.error('Erro ao criar usuario (API):', error);
        res.status(500).json({ error: 'Erro ao criar usuario' });
    }
});

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