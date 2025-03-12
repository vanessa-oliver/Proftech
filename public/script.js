const messageInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
const saveButton = document.getElementById('save-button');

let comando, enunciado, resposta;

const sendMessage = async () => {
    comando = messageInput.value;
    messageInput.value = ''; // Limpa o campo de input

    if (comando.trim() !== '') {
        // Exibe a mensagem do usuário na tela
        messagesContainer.innerHTML += `<div class="user-message">usuario:<br>${comando}</div><br>`;
        try {
            // Primeira requisição: envia o comando do usuário para a IA
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

            // Exibe o enunciado gerado pela IA
            enunciado = data.enunciado;
            messagesContainer.innerHTML += `<div class="bot-message">chat:<br>${enunciado}</div><br>`;

            // Exibe a resposta gerada com base no enunciado
            resposta = data.resposta;
            messagesContainer.innerHTML += `<div class="bot-message">resposta:<br>${resposta}</div>`;

            // Salva a conversa (enunciado e resposta gerada) no banco, se necessário
            // Aqui você pode chamar outra função para salvar a conversa se desejar

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
        console.log(`Salvando conversa: ${enunciado} -> ${resposta}`);
        try {
            // Envia uma requisição POST para o servidor com enunciado e resposta
            const response = await fetch('/IA/save-conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ enunciado, resposta })
            });

            // Verifica se a resposta da requisição foi bem-sucedida
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

// Event listener para o botão de salvar conversa
saveButton.addEventListener('click', saveConversation);
