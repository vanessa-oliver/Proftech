const express = require('express');
const router = express.Router();

router.get('/chat', (req, res) => {
    res.render('IA/chat', { messages: [] }); // Renderiza a página inicialmente com um array vazio de mensagens
});

router.post('/chat', async (req, res) => {
    try{
        const userMessage = req.body.message;
        // console.log(`Mensagem do usuário: ${userMessage}`);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat();
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();
        // console.log(`Resposta do chatbot: ${text}`);
        res.json({ enunciado: userMessage, resposta: text });
    }catch (error){
        console.error("Erro ao se comunicar com o serviço de IA:", error);
        res.status(500).send("Erro ao processar a mensagem do chatbot.");
    }
});

router.post('/save-conversation', async (req, res) => {
    try{
        const {enunciado, resposta} = req.body;
        const cod_usuario = 1; 
        const cod_assunto = 1; 
        // console.log(`Salvar no BD - Enunciado: ${enunciado}, Resposta: ${resposta}, Cod_usuario: ${cod_usuario}, Cod_assunto: ${cod_assunto}`);
        await Questao.create({ enunciado, resposta, cod_usuario, cod_assunto });
        res.status(200).send('Conversa salva com sucesso.');
    }catch (error){
        console.error("Erro ao salvar a conversa:", error);
        res.status(500).send("Erro ao salvar a conversa.");
    }
});

module.exports = router;