const express = require('express');
const router = express.Router();
const Questao = require('../models/Questao');

// Rota para exibir questão
router.get('/readquest/:cod_questao', async (req, res) =>{
    try {
        const cod_questao = req.params.cod_questao;
        const questao = await Questao.findByPk(cod_questao);
        if (!questao) {
            res.status(404).send("Questão não encontrada!");
            return;
        }
        res.render('Quest/quest', { questao: questao.dataValues });
    } catch (error) {
        console.error("Erro ao buscar questão:", error);
        res.status(500).send("Erro ao buscar a questão.");
    }
});

// Rota para listar as questões
router.get('/listquest', function(req, res) {
    Questao.findAll().then(function(questoes) {
        const questoesData = questoes.map(questao => questao.get({ plain: true }));
        res.render('Quest/listquest', { questoes: questoesData});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar as questões.");
    });
});

// Rota para deletar questão
router.get('/delquest/:cod_questao', function(req, res) {
    Questao.destroy({ where: {'cod_questao': req.params.cod_questao} })
    .then(function() {
        req.flash("success_msg", "Questão deletada com sucesso!");
        res.redirect('/quest/listquest');
    }).catch(function(erro) {
        req.flash("error_msg", "Erro ao deletar questão: " + erro);
        res.redirect('/quest/listquest');
    });
});

// Rota para criar questão
router.get('/createquest', function(req, res) {
    res.render('Quest/addquest');
});

// Rota para adicionar questão 
router.post('/addquest', function(req, res) {
    var erros = [];

    if(!req.body.enunciado || !req.body.resposta || !req.body.cod_usuario || !req.body.cod_assunto) {
        erros.push({texto: "Preencha todos os campos!"});
    }

    if(erros.length > 0){
        res.render('Quest/addquest', {erros: erros});
    } else {
        Questao.create({
            enunciado: req.body.enunciado,
            resposta: req.body.resposta,
            cod_usuario: req.body.cod_usuario,
            cod_assunto: req.body.cod_assunto
        }).then(function() {
            req.flash("success_msg", "Questão cadastrada com sucesso!");
            res.redirect('/quest/listquest');
        }).catch(function(erro) {
            req.flash("error_msg", "Erro ao cadastrar questão: " + erro);
            res.redirect('/quest/listquest');
        });
    }
});

// Rota para exibir página de atualizar questão
router.get('/updatequest/:cod_questao', function(req, res) {
    Questao.findOne({ where: {"cod_questao": req.params.cod_questao} })
    .then(function(questao) {
        res.render('Quest/updatequest', {questao: questao});
    }).catch(function(erro) {
        req.flash("error_msg", "Erro ao buscar questão: " + erro);
        res.redirect('/quest/listquest');
    });
});

// Rota para atualizar questão
router.post('/updatequest/:cod_questao', async (req, res) => {
    const { enunciado, resposta, cod_usuario, cod_assunto } = req.body;
    const { cod_questao } = req.params;
    
    try {
        await Questao.update(
            { enunciado, resposta, cod_usuario, cod_assunto }, 
            { where: { cod_questao: cod_questao } }
        );
        req.flash("success_msg", "Questão atualizada com sucesso!");
        res.redirect('/quest/listquest');
    } catch (error) {
        req.flash("error_msg", "Erro ao atualizar questão: " + error);
        res.redirect('/quest/listquest');
    }
});

module.exports = router;
