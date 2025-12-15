const express = require('express');
const router = express.Router();
const Questao = require('../models/Questao');
const { Groq } = require('groq-sdk');
require('dotenv').config();

const apiKey = process.env.GROQ_API_KEY;
let groq = null;
if (apiKey) {
    try {
        groq = new Groq({ apiKey: apiKey });
    } catch (err) {
        console.error('Erro ao inicializar Groq:', err);
        groq = null;
    }
}

router.get('/chat', (req, res) => {
    res.render('IA/chat', { messages: [] });
});

router.post('/chat', async (req, res) => {
    try {
        if (!groq) {
            return res.status(500).json({ error: 'Chave de API da Groq não configurada. Verifique o arquivo .env' });
        }

        const userMessage = req.body.message;

        if (!userMessage || userMessage.trim() === '') {
            return res.status(400).json({ error: 'Mensagem vazia' });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: userMessage
                }
            ],
            model: "mixtral-8x7b-32768-free",
            temperature: 1,
            max_tokens: 1024,
        });

        const enunciado = completion.choices[0]?.message?.content || '';

        const completionResposta = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: enunciado + " resumidamente"
                }
            ],
            model: "mixtral-8x7b-32768-free",
            temperature: 1,
            max_tokens: 1024,
        });

        const resposta = completionResposta.choices[0]?.message?.content || '';

        res.json({ comando: userMessage, enunciado: enunciado, resposta: resposta });

    } catch (error) {
        console.error("Erro ao se comunicar com o serviço de IA:", error);
        res.status(500).json({ error: "Erro ao processar a mensagem do chatbot: " + error.message });
    }
});

router.post('/save-conversation', async (req, res) => {
    try {
        const { enunciado, resposta, cod_usuario, cod_assunto } = req.body;
        
        if (!enunciado || !resposta) {
            return res.status(400).json({ message: 'Enunciado e resposta são obrigatórios.' });
        }

        const cod_usuario_final = cod_usuario || 1;
        const cod_assunto_final = cod_assunto || 1;

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
