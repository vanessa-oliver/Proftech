const express = require('express');
const router = express.Router();
const Assunto = require('../models/Assunto');
const Prova = require('../models/Prova');

// Rota para listar assuntos
router.get('/listassunto', function(req, res) {
    Assunto.findAll().then(function(assuntos) {
        const assuntosData = assuntos.map(assunto => assunto.get({ plain: true }));
        res.render('Subject/listassunto', { assuntos: assuntosData});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar os assuntos. " + error);
    });
});

// Rota para criar assunto
router.get('/createassunto', function(req, res) {
    res.render('Subject/addassunto');
});

// Rota para adicionar assunto 
router.post('/addassunto', function(req, res) {
    if(!req.body.nome_assunto) {
        return res.render('Subject/addassunto', {erros: [{texto: "Nome do assunto é obrigatório!"}]});
    }

    Assunto.create({
        nome_assunto: req.body.nome_assunto,
    }).then(function() {
        req.flash("success_msg", "Assunto criado com sucesso!");
        res.redirect('/subject/listassunto');
    }).catch(function(erro) {
        req.flash("error_msg", "Erro ao cadastrar assunto: " + erro);
        res.redirect('/subject/createassunto');
    });
});

// Rota para deletar assunto
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

// Rota para exibir página de atualizar assunto
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

// Rota para atualizar assunto
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
