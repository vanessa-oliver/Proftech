const express = require('express');
const router = express.Router();
const Prova = require('../models/Prova');
const Questao = require('../models/Questao');
const Assunto = require('../models/Assunto');
const Usuario = require('../models/Usuario');
const questaoprova = require('../models/QuestãoProva');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const generative = require('../services/generative');
const QuestaoModel = require('../models/Questao');
const Questaoprova = require('../models/QuestãoProva');

router.get('/listprova', function(req, res) {
    Prova.findAll().then(function(provas) {
        const provasData = provas.map(prova => prova.get({ plain: true }));
        res.render('Exam/listprova', { provas: provasData});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar as provas. " + error);
    });
});

router.get('/readprova/:cod_prova', async (req, res) =>{
    try {
        const cod_prova = req.params.cod_prova;
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

        if (!prova) {
            res.status(404).send("Prova não encontrada!");
            return;
        }
        res.render('Exam/prova', { prova: prova.dataValues, questoes: lista_questoes.filter(q => q !== null) });
    } catch (error) {
        console.error("Erro ao buscar prova:", error);
        res.status(500).send('Erro ao buscar a prova. ' + error);   
    }
});

router.get('/adicionar_questao/:cod_prova', async (req, res) => {
    try {
        const cod_prova = req.params.cod_prova;
        const questoes = await Questao.findAll();
        const questoesData = questoes.map(q => q.get({ plain: true }));
        res.render('Exam/adicionar_a_prova', { cod_prova, questoes: questoesData });
    } catch (error) {
        console.error('Erro ao buscar questões:', error);
        res.status(500).send('Erro ao carregar questões');
    }
});

router.post('/adicionar_questao', function(req, res) {
    const { cod_prova, cod_questao } = req.body;

    if (!cod_prova || !cod_questao) {
        return res.status(400).send('Erro ao adicionar questão');
    }
    questaoprova.create({
        cod_prova: cod_prova,
        cod_questao: cod_questao
    }).then(function() {
        res.redirect('/exam/readprova/' + cod_prova);
    }).catch(function(erro) {
        res.status(400).send("Código de questão não reconhecido");
    });
});

router.post('/remover_questao', function(req, res) {
    const { cod_prova, cod_questao } = req.body;

    questaoprova.destroy({
        where: {
            cod_prova: cod_prova,
            cod_questao: cod_questao
        }
    }).then(function(deleted) {
        if (deleted) {
            res.redirect('/exam/readprova/' + cod_prova);
        } else {
            res.status(404).send('Questão não encontrada.');
        }
    }).catch(function(error) {
        res.status(500).send("Erro ao remover questão da prova: " + error);
    });
});

router.get('/createprova', async (req, res) => {
    try {
        const questoes = await Questao.findAll();
        const assuntos = await Assunto.findAll();
        const usuarios = await Usuario.findAll();
        const questoesData = questoes.map(q => q.get({ plain: true }));
        const assuntosData = assuntos.map(a => a.get({ plain: true }));
        const usuariosData = usuarios.map(u => u.get({ plain: true }));
        
        res.render('Exam/criar-prova', { 
            questoes: questoesData,
            assuntos: assuntosData,
            usuarios: usuariosData
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        req.flash("error_msg", "Erro ao carregar página de criação");
        res.redirect('/exam/listprova');
    }
});

// Página para gerar prova com IA
router.get('/createprova-ia', async (req, res) => {
    try {
        const assuntos = await Assunto.findAll();
        const usuarios = await Usuario.findAll();
        res.render('Exam/generate-prova-ia', { assuntos: assuntos.map(a => a.get({ plain: true })), usuarios: usuarios.map(u => u.get({ plain: true })) });
    } catch (error) {
        console.error('Erro ao carregar página de geração IA:', error);
        req.flash('error_msg', 'Erro ao carregar página IA');
        res.redirect('/exam/createprova');
    }
});

// Gera prova via IA, grava questões e prova no banco
router.post('/generateprova-ia', async (req, res) => {
    try {
        const { nome_prova, data, cod_assunto, cod_usuario, quantidade, dificuldade, formato } = req.body;

        if (!nome_prova || !data || !cod_assunto || !cod_usuario) {
            req.flash('error_msg', 'Preencha todos os campos obrigatórios!');
            return res.redirect('/exam/createprova-ia');
        }

        const num = parseInt(quantidade) || 5;

        const assuntoObj = await Assunto.findByPk(cod_assunto);
        const assuntoNome = assuntoObj ? assuntoObj.nome_assunto : '';

        const questions = await generative.generateExamQuestions({ assunto: assuntoNome || 'assunto genérico', quantidade: num, dificuldade: dificuldade || 'médio', formato: formato || 'discursiva' });

        // cria prova
        const novaProva = await Prova.create({ nome_prova, data, cod_usuario, cod_assunto });

        // cria questões e associa
        for (const q of questions) {
            const enunciado = q.enunciado || q.question || '';
            const resposta = q.resposta || q.answer || '';
            const novaQ = await QuestaoModel.create({ enunciado, resposta, cod_usuario, cod_assunto });
            await Questaoprova.create({ cod_prova: novaProva.cod_prova, cod_questao: novaQ.cod_questao });
        }

        req.flash('success_msg', 'Prova gerada com sucesso!');
        res.redirect('/exam/readprova/' + novaProva.cod_prova);

    } catch (error) {
        console.error('Erro ao gerar prova com IA:', error);
        req.flash('error_msg', 'Erro ao gerar prova com IA: ' + error.message);
        res.redirect('/exam/createprova-ia');
    }
});

router.post('/addprova', async (req, res) => {
    try {
        const { nome_prova, data, cod_assunto, cod_usuario, questoes_selecionadas } = req.body;

        if (!nome_prova || !data || !cod_assunto || !cod_usuario) {
            req.flash("error_msg", "Preencha todos os campos obrigatórios!");
            return res.redirect('/exam/createprova');
        }

        const novaProva = await Prova.create({
            nome_prova: nome_prova,
            data: data,
            cod_usuario: cod_usuario,
            cod_assunto: cod_assunto
        });

        if (questoes_selecionadas && questoes_selecionadas.length > 0) {
            const questoesArray = Array.isArray(questoes_selecionadas) 
                ? questoes_selecionadas 
                : [questoes_selecionadas];

            for (const cod_questao of questoesArray) {
                await questaoprova.create({
                    cod_prova: novaProva.cod_prova,
                    cod_questao: cod_questao
                });
            }
        }

        req.flash("success_msg", "Prova criada com sucesso!");
        
        res.redirect('/exam/downloadprova/' + novaProva.cod_prova);

    } catch (error) {
        console.error('Erro ao criar prova:', error);
        req.flash("error_msg", "Erro ao cadastrar prova: " + error.message);
        res.redirect('/exam/createprova');
    }
});

router.post('/del_prova/:cod_prova', function(req, res) {
    const { cod_prova } = req.params;
    
    questaoprova.destroy({ where: { cod_prova } }).then(() => {
        return Prova.destroy({ where: { cod_prova: cod_prova } });
    }).then(function(deleted) {
        if (deleted) {
            req.flash("success_msg", "Prova deletada com sucesso!");
            res.redirect('/exam/listprova');
        } else {
            req.flash("error_msg", "Prova não encontrada");
            res.redirect('/exam/listprova');
        }
    }).catch(function(error){
        req.flash("error_msg", "Erro ao deletar prova: " + error);
        res.redirect('/exam/listprova');
    });
});

router.get('/updateprova/:cod_prova', async(req, res)=> {
    try{
        const cod_prova = req.params.cod_prova;
        const prova = await Prova.findByPk(cod_prova);
        if(prova){
            res.render('Exam/updateprova', { prova: prova.dataValues });
        } else {
            res.redirect('/exam/listprova');
        }
    } catch(erro) {
        res.redirect('/exam/listprova');
    }  
});

router.post('/atualizarprova/:cod_prova', async (req, res) => {
    const {nome_prova, data, cod_assunto, cod_usuario} = req.body;
    const {cod_prova} = req.params;
    
    try {
        await Prova.update(
            {nome_prova, data, cod_assunto, cod_usuario},
            { where: {cod_prova: cod_prova} }
        );
        req.flash("success_msg", "Prova atualizada com sucesso!");
        res.redirect('/exam/listprova');
    } catch (error) {
        req.flash("error_msg", "Erro ao atualizar prova: " + error);
        res.redirect('/exam/listprova');
    }
});

router.get('/downloadprova/:cod_prova', async (req, res) => {
    try {
        const cod_prova = req.params.cod_prova;
        const prova = await Prova.findByPk(cod_prova);

        if (!prova) {
            req.flash("error_msg", "Prova não encontrada");
            return res.redirect('/exam/listprova');
        }

        const questoesProva = await questaoprova.findAll({
            where: { cod_prova: cod_prova }
        });

        const questoes = await Promise.all(
            questoesProva.map(async (item) => {
                const questao = await Questao.findByPk(item.cod_questao);
                return questao ? {
                    cod_questao: questao.cod_questao,
                    enunciado: questao.enunciado,
                    resposta: questao.resposta
                } : null;
            })
        );

        const assunto = await Assunto.findByPk(prova.cod_assunto);
        const usuario = await Usuario.findByPk(prova.cod_usuario);

        const doc = new PDFDocument();
        const filename = `prova_${cod_prova}_${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../public', filename);

        const stream = fs.createWriteStream(filepath);

        doc.pipe(stream);

        doc.fontSize(20).font('Helvetica-Bold').text('PROVA', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(`Título: ${prova.nome_prova}`, { align: 'center' });
        doc.text(`Data: ${new Date(prova.data).toLocaleDateString('pt-BR')}`, { align: 'center' });
        doc.text(`Assunto: ${assunto ? assunto.nome : 'N/A'}`, { align: 'center' });
        doc.text(`Professor: ${usuario ? usuario.nome : 'N/A'}`, { align: 'center' });
        
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text(`Total de Questões: ${questoes.filter(q => q).length}`);
        doc.moveDown();

        questoes.filter(q => q).forEach((questao, index) => {
            doc.fontSize(12).font('Helvetica-Bold').text(`Questão ${index + 1}:`, { indent: 20 });
            doc.fontSize(11).font('Helvetica').text(questao.enunciado, { indent: 40, width: 450 });
            doc.moveDown(0.5);
        });

        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

        doc.end();

        stream.on('finish', () => {
            res.download(filepath, `prova_${prova.nome_prova}.pdf`, (err) => {
                if (err) {
                    console.error('Erro ao fazer download:', err);
                }
                setTimeout(() => {
                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                    }
                }, 5000);
            });
        });

        stream.on('error', (err) => {
            console.error('Erro ao escrever PDF:', err);
            res.status(500).send('Erro ao gerar PDF');
        });

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        req.flash("error_msg", "Erro ao gerar PDF: " + error.message);
        res.redirect('/exam/listprova');
    }
});

router.get('/visualizar-questoes/:cod_prova', async (req, res) => {
    try {
        const cod_prova = req.params.cod_prova;
        const prova = await Prova.findByPk(cod_prova);

        if (!prova) {
            return res.status(404).json({ error: 'Prova não encontrada' });
        }

        const questoesProva = await questaoprova.findAll({
            where: { cod_prova: cod_prova }
        });

        const questoes = await Promise.all(
            questoesProva.map(async (item) => {
                const questao = await Questao.findByPk(item.cod_questao);
                return questao ? {
                    cod_questao: questao.cod_questao,
                    enunciado: questao.enunciado
                } : null;
            })
        );

        res.json({
            prova: prova,
            questoes: questoes.filter(q => q)
        });
    } catch (error) {
        console.error('Erro ao buscar questões:', error);
        res.status(500).json({ error: 'Erro ao buscar questões' });
    }
});

module.exports = router;
