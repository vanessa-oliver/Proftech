const express = require('express');
const router = express.Router(); const Questao = require('../models/Questao');

// Rota para exibir questão
router.get('readquest/:cod_questao', async (req, res) =>{
    try {
        const cod_questao = req.params.cod_questao;
        console.log(`Buscando questão com código: ${cod_questao}`);
        const questao = await Questao.findByPk(cod_questao);
        console.log(`Questão encontrada: ${questao}`);
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
        res.render('Quest/listquest', { questoes: questoes});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar as questões.");
    });
});

//Rota para deletar questão
router.get('/delquest/:cod_questao', function(req, res) {
    Questao.destroy({ where: {'cod_questao': req.params.cod_questao} })
    .then(function() {
        res.redirect('Quest/listquest');
    }).catch(function(erro) {
        res.send("Erro ao deletar questão: " + erro);
    });
});

// Rota para criar questão
router.get('/createquest', function(req, res) {
    res.render('Quest/addquest');
});

// Rota para adicionar questão 
router.post('/addquest', function(req, res) {
    Questao.create({
        enunciado: req.body.enunciado,
        resposta: req.body.resposta,
        cod_usuario: req.body.cod_usuario,
        cod_assunto: req.body.cod_assunto
    }).then(function() {
        res.redirect('Quest/listquest');
    }).catch(function(erro) {
        res.send("Erro ao cadastrar questão: " + erro);
    });
});


module.exports = router;