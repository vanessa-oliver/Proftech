const messageInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('messages');
const sendButton = document.getElementById('send-button');

const sendMessage = async () => {
    const userMessage = messageInput.value.trim();
    messageInput.value = '';

    if (userMessage !== '') {
        // Exibe a mensagem do usuário
        messagesContainer.innerHTML += `<div class="user-message"><b>Você:</b><br>${userMessage}</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        try {
            // Envia a mensagem para o backend
            const response = await fetch('/IA/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição HTTP! Status: ${response.status}`);
            }
            
            const data = await response.json();

            // Exibe a resposta da IA
            if (data.text) {
                messagesContainer.innerHTML += `<div class="bot-message"><b>IA:</b><br>${data.text}</div>`;
            } else {
                throw new Error("A resposta da IA não contém a propriedade 'text'.");
            }
            
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

