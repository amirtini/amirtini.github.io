// Переменная для хранения ID последнего полученного сообщения
let lastUpdateId = 0;

// Функция для получения ответов от бота
async function getBotResponses() {
    const botToken = '7610888013:AAFmGvkW5W8ycHOQas0fpa2CDnJoY1h6YHs';
    const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}&limit=100`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.ok) {
            const updates = data.result;
            const responsesContainer = document.getElementById('responsesContainer');
            const noResponses = responsesContainer.querySelector('.no-responses');
            
            if (updates.length > 0) {
                if (noResponses) {
                    responsesContainer.innerHTML = '';
                }
                
                // Обрабатываем все сообщения
                updates.forEach(update => {
                    if (update.message && update.message.text) {
                        const message = update.message.text;
                        const timestamp = update.message.date * 1000;
                        const isBot = update.message.from.is_bot;
                        
                        const responseItem = document.createElement('div');
                        responseItem.className = 'response-item';
                        
                        const date = new Date(timestamp);
                        const formattedDate = date.toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        responseItem.innerHTML = `
                            <div class="response-header">
                                <span>${isBot ? 'Ответ от бота' : 'Ваше сообщение'}</span>
                                <span>${formattedDate}</span>
                            </div>
                            <div class="response-content">${message}</div>
                        `;
                        
                        responsesContainer.insertBefore(responseItem, responsesContainer.firstChild);
                        
                        // Обновляем ID последнего сообщения
                        lastUpdateId = update.update_id;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Ошибка при получении ответов:', error);
    }
}

// Функция для добавления ответа в контейнер
function addResponse(name, message, timestamp) {
    const responsesContainer = document.getElementById('responsesContainer');
    const noResponses = responsesContainer.querySelector('.no-responses');
    
    if (noResponses) {
        responsesContainer.innerHTML = '';
    }
    
    const responseItem = document.createElement('div');
    responseItem.className = 'response-item';
    
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    responseItem.innerHTML = `
        <div class="response-header">
            <span>${name}</span>
            <span>${formattedDate}</span>
        </div>
        <div class="response-content">${message}</div>
    `;
    
    responsesContainer.insertBefore(responseItem, responsesContainer.firstChild);
}

// Обработчик отправки формы
document.getElementById('telegramForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const statusDiv = document.getElementById('formStatus');
    
    const botToken = '7610888013:AAFmGvkW5W8ycHOQas0fpa2CDnJoY1h6YHs';
    const chatId = '2140171543';
    
    const text = `Новое сообщение от ${name}:\n\n${message}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            statusDiv.textContent = 'Сообщение успешно отправлено!';
            statusDiv.className = 'success';
            document.getElementById('telegramForm').reset();
            
            // Добавляем сообщение в список
            addResponse(name, message, new Date().getTime());
            
            // Запускаем проверку ответов
            setTimeout(getBotResponses, 1000);
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        statusDiv.textContent = 'Ошибка при отправке сообщения. Попробуйте позже.';
        statusDiv.className = 'error';
    }
});

// Запускаем проверку ответов при загрузке страницы
document.addEventListener('DOMContentLoaded', getBotResponses);

// Периодически проверяем новые ответы
setInterval(getBotResponses, 5000); 