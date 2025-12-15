const express = require('express');
const router = express.Router();
const Assunto = require('../models/Assunto');
const Prova = require('../models/Prova');

router.get('/listassunto', function(req, res) {
    Assunto.findAll().then(function(assuntos) {
        const assuntosData = assuntos.map(assunto => assunto.get({ plain: true }));
        res.render('Subject/listassunto', { assuntos: assuntosData});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar os assuntos. " + error);
    });
});

router.get('/createassunto', function(req, res) {
    const redirect = req.query.redirect || '/subject/listassunto';
    res.render('Subject/addassunto', { redirect });
});

router.post('/addassunto', function(req, res) {
    const redirect = req.body.redirect || '/subject/listassunto';
    
    if(!req.body.nome_assunto) {
        return res.render('Subject/addassunto', {erros: [{texto: "Nome do assunto é obrigatório!"}], redirect});
    }

    Assunto.create({
        nome_assunto: req.body.nome_assunto,
    }).then(function() {
        req.flash("success_msg", "Assunto criado com sucesso!");
        res.redirect(redirect);
    }).catch(function(erro) {
        req.flash("error_msg", "Erro ao cadastrar assunto: " + erro);
        res.redirect('/subject/createassunto?redirect=' + encodeURIComponent(redirect));
    });
});

// API: retornar lista de assuntos em JSON
router.get('/api/assuntos', async (req, res) => {
    try {
        const assuntos = await Assunto.findAll();
        res.json(assuntos.map(a => a.get({ plain: true })));
    } catch (error) {
        console.error('Erro ao buscar assuntos (API):', error);
        res.status(500).json({ error: 'Erro ao buscar assuntos' });
    }
});

// API: criar assunto via JSON (usado por formulário dinâmico)
router.post('/api/assuntos', async (req, res) => {
    try {
        const { nome_assunto } = req.body;
        if (!nome_assunto || nome_assunto.trim() === '') {
            return res.status(400).json({ error: 'nome_assunto é obrigatório' });
        }
        const novo = await Assunto.create({ nome_assunto });
        res.status(201).json(novo.get({ plain: true }));
    } catch (error) {
        console.error('Erro ao criar assunto (API):', error);
        res.status(500).json({ error: 'Erro ao criar assunto' });
    }
});

router.post('/del_assunto/:cod_assunto', function(req, res) {
    const { cod_assunto } = req.params;
    
    Prova.destroy({ where: { cod_assunto } }).then(() => {
        return Assunto.destroy({ where: { cod_assunto: cod_assunto } });
    }).then(function(deleted) {
        if (deleted) {
            req.flash("success_msg", "Assunto deletado com sucesso!");
            res.redirect('/subject/listassunto');
        } else {
            req.flash("error_msg", "Assunto não encontrado");
            res.redirect('/subject/listassunto');
        }
    }).catch(function(error){
        req.flash("error_msg", "Erro ao deletar assunto: " + error);
        res.redirect('/subject/listassunto');
    });
});

router.get('/updateassunto/:cod_assunto', async(req, res)=> {
    try{
        const cod_assunto = req.params.cod_assunto;
        const assunto = await Assunto.findByPk(cod_assunto);
        if(assunto){
            res.render('Subject/updateassunto', { assunto: assunto.dataValues });
        } else {
            res.redirect('/subject/listassunto');
        }
    } catch(erro) {
        res.redirect('/subject/listassunto');
    }    
});

router.post('/atualizarassunto/:cod_assunto', async (req, res) => {
    const {nome_assunto} = req.body;
    const {cod_assunto} = req.params;
    
    if(!nome_assunto) {
        return res.render('Subject/updateassunto', {
            erros: [{texto: "Nome do assunto é obrigatório!"}],
            assunto: { cod_assunto, nome_assunto }
        });
    }

    try {
        await Assunto.update(
            {nome_assunto},
            { where: { cod_assunto: cod_assunto } }
        );
        req.flash("success_msg", "Assunto atualizado com sucesso!");
        res.redirect('/subject/listassunto');
    } catch (error) {
        req.flash("error_msg", "Erro ao atualizar assunto: " + error);
        res.redirect('/subject/listassunto');
    }
});

module.exports = router;
