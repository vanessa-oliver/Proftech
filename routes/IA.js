const express = require('express');
const router = express.Router();
const Questao = require('../models/Questao');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.KEY_GEMINI;
let genAI = null;
if (apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
    } catch (err) {
        console.error('Erro ao inicializar GoogleGenerativeAI:', err);
        genAI = null;
    }
}

// Rota para exibir página de chat
router.get('/chat', (req, res) => {
    res.render('IA/chat', { messages: [] });
});

// Rota para processar mensagens do chat
router.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log(`Mensagem do usuário: ${userMessage}`);

        if (!userMessage || userMessage.trim() === '') {
            return res.status(400).json({ error: 'Mensagem vazia' });
        }

        // Primeira interação com a IA para gerar o enunciado
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat();

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;

        const enunciado = response.text();
        console.log(`Enunciado gerado pela IA: ${enunciado}`);

        // Segunda interação para gerar a resposta
        const resultSave = await chat.sendMessage(enunciado + " resumidamente");
        const responseSave = await resultSave.response;

        const resposta = responseSave.text();
        console.log(`Resposta gerada com base no enunciado: ${resposta}`);

        // Retorna as respostas
        res.json({ comando: userMessage, enunciado: enunciado, resposta: resposta });

    } catch (error) {
        console.error("Erro ao se comunicar com o serviço de IA:", error);
        res.status(500).json({ error: "Erro ao processar a mensagem do chatbot." });
    }
});

// Rota para salvar conversa como questão
router.post('/save-conversation', async (req, res) => {
    try {
        const { enunciado, resposta, cod_usuario, cod_assunto } = req.body;
        
        console.log(`Recebido enunciado: ${enunciado}`);
        console.log(`Recebida resposta: ${resposta}`);

        if (!enunciado || !resposta) {
            return res.status(400).json({ message: 'Enunciado e resposta são obrigatórios.' });
        }

        const cod_usuario_final = cod_usuario || 1;
        const cod_assunto_final = cod_assunto || 1;

        console.log(`Salvando conversa: ${enunciado} -> ${resposta}`);

        await Questao.create({
            enunciado,
            resposta,
            cod_usuario: cod_usuario_final,  
            cod_assunto: cod_assunto_final   
        });

        res.status(200).json({ message: 'Questão criada com sucesso!' });
    } catch (error) {
        console.error("Erro ao salvar a conversa:", error);
        res.status(500).json({ message: 'Erro ao salvar a questão no banco de dados.' });
    }
});

module.exports = router;
