const messageInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
const saveButton = document.getElementById('save-button');

let comando, enunciado, resposta;

const sendMessage = async () => {
    comando = messageInput.value;
    messageInput.value = '';

    if (comando.trim() !== '') {
        messagesContainer.innerHTML += `<div class="user-message">usuario:<br>${comando}</div><br>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        try {
            const response = await fetch('/IA/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: comando })
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição HTTP! Status: ${response.status}`);
            }
            const data = await response.json();

            enunciado = data.enunciado;
            messagesContainer.innerHTML += `<div class="bot-message">chat:<br>${enunciado}</div><br>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            resposta = data.resposta;
            messagesContainer.innerHTML += `<div class="bot-message">resposta:<br>${resposta}</div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            messagesContainer.innerHTML += `<div class="bot-message" style="color: red;">Erro ao processar a mensagem. Tente novamente.</div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    } else {
        console.warn('Mensagem vazia, não enviada.');
    }
};

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

const saveConversation = async () => {
    if (enunciado && resposta) {
        console.log(`Salvando conversa: ${enunciado} -> ${resposta}`);
        try {
            const response = await fetch('/IA/save-conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ enunciado, resposta })
            });

            if (response.ok) {
                console.log("Conversa salva com sucesso.");
                alert("Conversa salva com sucesso!");
            } else {
                throw new Error('Erro ao salvar a conversa no banco de dados.');
            }
        } catch (error) {
            console.error("Erro ao salvar a conversa:", error);
            alert("Erro ao salvar a conversa. Tente novamente.");
        }
    } else {
        console.warn('Enunciado ou resposta estão vazios.');
        alert("Enunciado ou resposta estão vazios. Não é possível salvar.");
    }
};

saveButton.addEventListener('click', saveConversation);
