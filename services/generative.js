const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;
// Define o modelo diretamente para garantir compatibilidade
const MODEL = "gemini-1.5-pro-latest";

if (!API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY não definida no .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL });

async function callGenerateText(prompt) {
  if (!API_KEY) {
    throw new Error("Chave de API do Gemini não configurada");
  }
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    throw new Error("Falha ao gerar conteúdo com a API do Gemini.");
  }
}

async function generateExamQuestions(options) {
  const { assunto, quantidade, dificuldade, formato } = options;

  const prompt = `
    Gere uma lista de ${quantidade} questões de prova sobre o assunto "${assunto}".
    A dificuldade das questões deve ser ${dificuldade}.
    O formato das questões deve ser ${formato}.

    A resposta deve ser um JSON contendo uma lista de objetos, onde cada objeto representa uma questão e possui as seguintes chaves:
    - "enunciado": O enunciado da questão.
    - "resposta": A resposta correta para a questão.

    Exemplo de formato de resposta:
    [
      {
        "enunciado": "Qual a capital da França?",
        "resposta": "Paris"
      },
      {
        "enunciado": "Quem descobriu o Brasil?",
        "resposta": "Pedro Álvares Cabral"
      }
    ]
  `;

  try {
    const jsonResponse = await callGenerateText(prompt);
    // Extrai o conteúdo do JSON do texto, pois a API pode retornar o JSON dentro de um bloco de código
    const jsonString = jsonResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(jsonString);
    return questions;
  } catch (error) {
    console.error("Erro ao gerar e parsear questões de prova:", error);
    throw new Error("Falha ao gerar ou parsear as questões da prova.");
  }
}

module.exports = {
  callGenerateText,
  generateExamQuestions,
};
