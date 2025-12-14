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

// Rota para listar provas
router.get('/listprova', function(req, res) {
    Prova.findAll().then(function(provas) {
        const provasData = provas.map(prova => prova.get({ plain: true }));
        res.render('Exam/listprova', { provas: provasData});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar as provas. " + error);
    });
});

// Rota para exibir prova
router.get('/readprova/:cod_prova', async (req, res) =>{
    try {
        const cod_prova = req.params.cod_prova;
        console.log('Buscando prova com código: ' + cod_prova);
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
            res.status(404).send("Prova não encontrada!");
            return;
        }
        res.render('Exam/prova', { prova: prova.dataValues, questoes: lista_questoes.filter(q => q !== null) });
    } catch (error) {
        console.error("Erro ao buscar prova:", error);
        res.status(500).send('Erro ao buscar a prova. ' + error);   
    }
});

// Rota para adicionar questão a prova
router.get('/adicionar_questao/:cod_prova', (req, res) => {
    const cod_prova = req.params.cod_prova;
    res.render('Exam/adicionar_a_prova', { cod_prova });
});

// Rota para adicionar questão a prova
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

// Rota para remover questão da prova
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

// Rota para criar prova - mostra apenas o formulário de criar nova prova
router.get('/createprova', async (req, res) => {
    try {
        const questoes = await Questao.findAll();
        const assuntos = await Assunto.findAll();
        const questoesData = questoes.map(q => q.get({ plain: true }));
        const assuntosData = assuntos.map(a => a.get({ plain: true }));
        
        res.render('Exam/criar-prova', { 
            questoes: questoesData,
            assuntos: assuntosData
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        req.flash("error_msg", "Erro ao carregar página de criação");
        res.redirect('/exam/listprova');
    }
});

// Rota para adicionar prova 
router.post('/addprova', async (req, res) => {
    try {
        const { nome_prova, data, cod_assunto, questoes_selecionadas } = req.body;

        // Validações
        if (!nome_prova || !data || !cod_assunto) {
            req.flash("error_msg", "Preencha todos os campos obrigatórios!");
            return res.redirect('/exam/createprova');
        }

        // Usar usuário logado ou padrão
        let cod_usuario = req.user ? req.user.cod_usuario : 1;

        // Criar prova
        const novaProva = await Prova.create({
            nome_prova: nome_prova,
            data: data,
            cod_usuario: cod_usuario,
            cod_assunto: cod_assunto
        });

        // Adicionar questões à prova
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
        
        // Redirecionar para download de PDF
        res.redirect('/exam/downloadprova/' + novaProva.cod_prova);

    } catch (error) {
        console.error('Erro ao criar prova:', error);
        req.flash("error_msg", "Erro ao cadastrar prova: " + error.message);
        res.redirect('/exam/createprova');
    }
});

// Rota para deletar prova
router.post('/del_prova/:cod_prova', function(req, res) {
    const { cod_prova } = req.params;
    console.log('[DEBUG] Requisição DELETE prova recebida. cod_prova=', cod_prova, ' ip=', req.ip, ' time=', new Date().toISOString());
    
    questaoprova.destroy({ where: { cod_prova } }).then(() => {
        return Prova.destroy({ where: { cod_prova: cod_prova } });
    }).then(function(deleted) {
        if (deleted) {
            console.log('[DEBUG] Prova deletada com sucesso:', cod_prova);
            req.flash("success_msg", "Prova deletada com sucesso!");
            res.redirect('/exam/listprova');
        } else {
            console.log('[DEBUG] Prova não encontrada ao deletar:', cod_prova);
            req.flash("error_msg", "Prova não encontrada");
            res.redirect('/exam/listprova');
        }
    }).catch(function(error){
        console.error('[DEBUG] Erro ao deletar prova:', error);
        req.flash("error_msg", "Erro ao deletar prova: " + error);
        res.redirect('/exam/listprova');
    });
});

// Rota para exibir página de atualizar prova
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

// Rota para atualizar provas
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

// Rota para gerar e fazer download do PDF da prova
router.get('/downloadprova/:cod_prova', async (req, res) => {
    console.log('[DEBUG] Requisição download prova recebida. params=', req.params, ' ip=', req.ip, ' time=', new Date().toISOString());
    try {
        const cod_prova = req.params.cod_prova;
        const prova = await Prova.findByPk(cod_prova);

        if (!prova) {
            req.flash("error_msg", "Prova não encontrada");
            return res.redirect('/exam/listprova');
        }

        // Buscar questões da prova
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

        // Buscar informações adicionais
        const assunto = await Assunto.findByPk(prova.cod_assunto);
        const usuario = await Usuario.findByPk(prova.cod_usuario);

        // Gerar PDF
        const doc = new PDFDocument();
        const filename = `prova_${cod_prova}_${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../public', filename);

        const stream = fs.createWriteStream(filepath);

        doc.pipe(stream);

        // Cabeçalho
        doc.fontSize(20).font('Helvetica-Bold').text('PROVA', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(`Título: ${prova.nome_prova}`, { align: 'center' });
        doc.text(`Data: ${new Date(prova.data).toLocaleDateString('pt-BR')}`, { align: 'center' });
        doc.text(`Assunto: ${assunto ? assunto.nome : 'N/A'}`, { align: 'center' });
        doc.text(`Professor: ${usuario ? usuario.nome : 'N/A'}`, { align: 'center' });
        
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text(`Total de Questões: ${questoes.filter(q => q).length}`);
        doc.moveDown();

        // Questões
        questoes.filter(q => q).forEach((questao, index) => {
            doc.fontSize(12).font('Helvetica-Bold').text(`Questão ${index + 1}:`, { indent: 20 });
            doc.fontSize(11).font('Helvetica').text(questao.enunciado, { indent: 40, width: 450 });
            doc.moveDown(0.5);
        });

        // Rodapé
        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

        // Finalizar PDF
        doc.end();

        // Quando o arquivo for escrito, fazer download
        stream.on('finish', () => {
            console.log('[DEBUG] PDF escrito em', filepath);
            res.download(filepath, `prova_${prova.nome_prova}.pdf`, (err) => {
                if (err) {
                    console.error('Erro ao fazer download:', err);
                }
                // Deletar arquivo após download
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

// Rota para visualizar questões da prova
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
