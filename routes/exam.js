const express = require('express');
const router = express.Router();
const Prova = require('../models/Prova');
const Questao = require('../models/Questao');
const questaoprova = require('../models/QuestãoProva');

router.get('/listprova', function(req, res) {
    Prova.findAll().then(function(provas) {
        res.render('Exam/listprova', { provas: provas});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar as provas.");
    });
});

// rota para exibir prova
router.get('/readprova/:cod_prova', async (req, res) =>{
    try {
        const cod_prova = req.params.cod_prova;
        console.log('Buscando prova com código: ${cod_prova})');
        const prova = await Prova.findByPk(cod_prova);

        lista_prova_questao = await questaoprova.findAll({
            where: {
              cod_prova: prova.dataValues.cod_prova,
            },
          });

        const lista_questoes = await Promise.all(lista_prova_questao.map(async (item) => {
            const questao = await Questao.findByPk(item.cod_questao);
            return questao ? { cod_questao: questao.cod_questao, enunciado: questao.enunciado } : null;
        }));

        console.log(lista_questoes);

        console.log('prova encontrada: ' + prova);
        if (!prova) {
            res.status(404).send("prova não encontrada!");
            return;
        }
        res.render('prova', { prova: prova.dataValues, questoes: lista_questoes.filter(q => q !== null) });
    } catch (error) {
        // console.error("Erro ao buscar prova11:", error);
        res.status(500).send('Erro ao buscar a prova. ' + error);   
    }
});

// rota para adicionar questão a prova
router.get('/adicionar_questao/:cod_prova', (req, res) => {
    const cod_prova = req.params.cod_prova;
    res.render('Exam/adicionar_a_prova', { cod_prova });
});

// rota para adicionar questão a prova
router.post('/adicionar_questao', function(req, res) {
    const { cod_prova, cod_questao } = req.body;

    if (!cod_prova || !cod_questao) {
        return res.status(400).send('erro ao add questao');
    }
    questaoprova.create({
        cod_prova: cod_prova,
        cod_questao: cod_questao
    }).then(function() {
        res.redirect('/readprova/' + cod_prova);
    }).catch(function(erro) {
        res.send("codigo questao não reconhecido");
    });
});

// rota para remover questão da prova
router.post('/remover_questao', function(req, res) {
    const { cod_prova, cod_questao } = req.body;

    questaoprova.destroy({
        where: {
            cod_prova: cod_prova,
            cod_questao: cod_questao
        }
    }).then(function(deleted) {
        if (deleted) {
            res.redirect('/readprova/' + cod_prova);
        } else {
            res.status(404).send('questao não encontrada.');
        }
    }).catch(function(error) {
        res.status(500).send("erro ao remover questao da prova: " + error);
    });
});

// rota para criar prova
router.get('/createprova', function(req, res) {
    res.render('Exam/addprova');
});

// Rota para adicionar prova 
router.post('/addprova', function(req, res) {
    Prova.create({
        nome_prova: req.body.nome_prova,
        data: req.body.data,
        cod_usuario: req.body.cod_usuario,
        cod_assunto: req.body.cod_assunto
    }).then(function() {
        res.redirect('/listprova');
    }).catch(function(erro) {
        res.send("Erro ao cadastrar prova: " + erro);
    });
});

// rota para deletar prova
router.post('/del_prova/:cod_prova', function(req, res) {
    const { cod_prova } = req.params;
    questaoprova.destroy({ where: { cod_prova } })
    
    Prova.destroy({ where: {'cod_prova': req.params.cod_prova} })

    .then(function(deleted) {
        if (deleted) {
            res.redirect('/listprova');
        } else {
            res.status(404).send('prova não encontrada');
        }
    }).catch(function(error){
        res.status(500).send('erro ao deletar prova.' + error);
        console.log('erro ao deletar prova.' + error);
    });
});

//  rota de autalização de provas 
router.get('/updateprova/:cod_prova', async(req, res)=> {
    try{
        const cod_prova = req.params.cod_prova;
        prova= await Prova.findByPk(cod_prova);
        if(cod_prova){
            res.render('Exam/updateprova', { prova: prova.dataValues });
        }else{
            console.log('prova não encontrada')
        }
    }catch{
        console.log('prova não encontrada!')
    }  
});

// Rota para atualizar provas
router.post('/atualizarprova/:cod_prova', async (req, res) => {
    const {nome_prova, data, cod_assunto, cod_usuario} = req.body;
    const {cod_prova} = req.params;
    
    try {
        await Prova.update(
            {nome_prova, data, cod_assunto, cod_usuario},
            { where: {cod_prova: req.params.cod_prova} }
        );
        res.redirect('/listprova');
    } catch (error) {
        res.status(500).send('erro ao atualizar prova' + error);
    }
});

module.exports = router;
