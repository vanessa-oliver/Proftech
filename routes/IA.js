const express = require('express');
const router = express.Router();
const Questao = require('../models/Questao');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const apiKey = process.env.KEY_GEMINI;
const genAI = new GoogleGenerativeAI(apiKey);

router.get('/chat', (req, res) => {
    res.render('IA/chat', { messages: [] });
});

router.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log(`Mensagem do usuário: ${userMessage}`);

        // Primeira interação com a IA para gerar o enunciado
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use o modelo adequado
        const chat = model.startChat();

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;

        const enunciado = response.text(); // Enunciado gerado pela IA
        console.log(`Enunciado gerado pela IA: ${enunciado}`);

        // Agora, envia o enunciado para a IA gerar uma segunda resposta
        const resultSave = await chat.sendMessage(enunciado + " resumidamente");
        const responseSave = await resultSave.response;

        const resposta = responseSave.text(); // Resposta gerada com base no enunciado
        console.log(`Resposta gerada com base no enunciado: ${resposta}`);

        // Retorna tanto o comando quanto as respostas
        res.json({ comando: userMessage, enunciado: enunciado, resposta: resposta });

    } catch (error) {
        console.error("Erro ao se comunicar com o serviço de IA:", error);
        res.status(500).send("Erro ao processar a mensagem do chatbot.");
    }
});

router.post('/save-conversation', async (req, res) => {
    try {
        const { enunciado, resposta } = req.body;
        console.log(`Recebido enunciado: ${enunciado}`);
        console.log(`Recebida resposta: ${resposta}`);

        if (!enunciado || !resposta) {
            return res.status(400).json({ message: 'Enunciado e resposta são obrigatórios.' });
        } else {
            console.log(`Salvando conversa: ${enunciado} -> ${resposta}`);
        }

        Questao.create({
            enunciado,
            resposta,
            cod_usuario: 1,  
            cod_assunto: 1   
        });

        res.status(200).json({ message: 'Conversa salva com sucesso.' });
    } catch (error) {
        console.error("Erro ao salvar a conversa:", error);
        res.status(500).json({ message: 'Erro ao salvar a conversa no banco de dados.' });
    }
});

module.exports = router;