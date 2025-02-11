const messageInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
const saveButton = document.getElementById('save-button');
let enunciado, resposta;

// Função para enviar a mensagem ao chatbot
const sendMessage = async () => {
    enunciado = messageInput.value;
    messageInput.value = '';

    if (enunciado.trim() !== '') {
        messagesContainer.innerHTML += `<div class="user-message">${enunciado}</div>`;
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: enunciado })
            });
            if (!response.ok) {
                throw new Error(`Erro na requisição HTTP! Status: ${response.status}`);
            }
            const data = await response.json();
            resposta = data.resposta;
            console.log(`Recebido do chatbot: ${resposta}`);
            messagesContainer.innerHTML += `<div class="bot-message">${resposta}</div>`;
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    } else {
        console.warn('Mensagem vazia, não enviada.');
    }
};

// Event listener para o botão de enviar mensagem
sendButton.addEventListener('click', sendMessage);

// Função para salvar a conversa no banco de dados
const saveConversation = async () => {
    if (enunciado && resposta) {
        try {
            const response = await fetch('/save-conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ enunciado, resposta })
            });
            if (response.ok) {
                console.log("Conversa salva com sucesso.");
            } else {
                throw new Error('Erro ao salvar a conversa no banco de dados.');
            }
        } catch (error) {
            console.error("Erro ao salvar a conversa:", error);
        }
    } else {
        console.warn('Nada para salvar.');
    }
};

// Event listener para o botão de salvar conversa
saveButton.addEventListener('click', saveConversation);
