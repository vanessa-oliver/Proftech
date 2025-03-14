const express = require('express');
const router = express.Router();
const Assunto = require('../models/Assunto');
const Prova = require('../models/Prova')

router.get('/listassunto', function(req, res) {
    Assunto.findAll().then(function(assuntos) {
        res.render('Subject/listassunto', { assuntos: assuntos});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar os assuntos." + error);
    });
});

// rota para criar assunto
router.get('/createassunto', function(req, res) {
    res.render('Subject/addassunto');
});

// Rota para adicionar assunto 
router.post('/addassunto', function(req, res) {
    Assunto.create({
        nome_assunto: req.body.nome_assunto,
    }).then(function() {
        res.redirect('/Subject/listassunto');
    }).catch(function(erro) {
        res.send("Erro ao cadastrar assunto: " + erro);
    });
});

// rota para deletar assunto
router.post('/del_assunto/:cod_assunto', function(req, res) {
    const { cod_assunto } = req.params;
    Prova.destroy({ where: { cod_assunto } })
    
    Assunto.destroy({ where: {'cod_assunto': req.params.cod_assunto} })

    .then(function(deleted) {
        if (deleted) {
            res.redirect('/Subject/listassunto');
        } else {
            res.status(404).send('assunto não encontrada');
        }
    }).catch(function(error){
        res.status(500).send('erro ao deletar assunto.' + error);
        console.log('erro ao deletar assunto.' + error);
    });
});

//  rota de autalização de assuntos 
router.get('/updateassunto/:cod_assunto', async(req, res)=> {
    try{
        const cod_assunto = req.params.cod_assunto;
        assunto = await Assunto.findByPk(cod_assunto);
        if(assunto){
            res.render('Subject/updateassunto', { assunto: assunto.dataValues });
        }else{
            console.log('assunto não encontrado')
        }
    }catch{
        console.log('assunto não encontrado!')
    }    
});


// Rota para atualizar assunto
router.post('/atualizarassunto/:cod_assunto', async (req, res) => {
    console.log('entrou no atualizar assunto')
    const {nome_assunto} = req.body;
    const {cod_assunto} = req.params;
    
    try {
        await Assunto.update(
            {nome_assunto},
            { where: { cod_assunto: req.params.cod_assunto } }
        );
        res.redirect('/Subject/listassunto');
    } catch (error) {
        res.status(500).send('erro ao atualizar assunto');
    }
});

module.exports = router;