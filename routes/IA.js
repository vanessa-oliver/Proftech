const express = require("express");
const router = express.Router();
const generative = require("../services/generative");

require("dotenv").config();

/**
 * GET - Tela do chat
 */
router.get("/chat", (req, res) => {
  res.render("IA/chat", { messages: [] });
});

/**
 * POST - Chat com Gemini
 */
router.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    // Chama o serviço generativo para obter uma resposta da IA
    const aiResponse = await generative.callGenerateText(userMessage);

    // Retorna a resposta da IA como um JSON
    return res.json({
      text: aiResponse,
    });

  } catch (error) {
    console.error("Erro ao se comunicar com o Gemini:", error);
    res.status(500).json({
      error: "Erro ao processar a mensagem do chatbot: " + error.message,
    });
  }
});

module.exports = router;
