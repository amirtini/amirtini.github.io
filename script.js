document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const clickableImage = document.getElementById('clickable-image');
    const clickCountDisplay = document.getElementById('click-count');
    const clickSound = document.getElementById('clickSound');
    const cpsDisplay = document.getElementById('cps');

    let clickCount = 0; // Инициализируем счетчик
    let clicksInLastSecond = 0; // Клики за последнюю секунду
    let lastClickTime = Date.now(); // Время последнего клика

    // Функция для обновления CPS
    function updateCPS() {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime;
        
        if (timeDiff >= 1000) {
            cpsDisplay.textContent = clicksInLastSecond;
            clicksInLastSecond = 0;
            lastClickTime = currentTime;
        }
    }

    // Запускаем обновление CPS каждую секунду
    setInterval(updateCPS, 1000);

    // Добавляем обработчик события клика
    clickableImage.addEventListener('click', () => {
        clickCount++; // Увеличиваем счетчик
        clicksInLastSecond++; // Увеличиваем счетчик кликов за последнюю секунду
        clickCountDisplay.textContent = ` ${clickCount}`; // Обновляем отображение счетчика

        // Воспроизводим звук клика
        clickSound.currentTime = 0; // Сбрасываем время воспроизведения
        clickSound.play(); // Воспроизводим звук

        // Увеличиваем изображение
        clickableImage.style.transform = 'scale(1.2)'; // Увеличиваем изображение на 20%
        
        // Возвращаем изображение в исходное состояние через 200 мс
        setTimeout(() => {
            clickableImage.style.transform = 'scale(1)';
        }, 200);

        // Проверяем, если количество кликов кратно 10
        if (clickCount % 10 === 0) {
            applyRandomTransformation();
        }
    });

    function applyRandomTransformation() {
        const transformations = [
            'rotate(1000deg)',
            'rotate(-1000deg)',
            'scale(100.5)',
            'translateX(200px)',
            'translateY(200px)',
            'scale(1000.5)',
            'rotate(450deg)',
            'rotate(-450deg)',
        ];

        // Выбираем случайную трансформацию
        const randomTransformation = transformations[Math.floor(Math.random() * transformations.length)];
        clickableImage.style.transition = 'transform 0.5s'; // Плавный переход
        clickableImage.style.transform = randomTransformation; // Применяем случайную трансформацию

        // Возвращаем изображение в исходное состояние через 500 мс
        setTimeout(() => {
            clickableImage.style.transform = 'scale(1)'; // Возвращаем к исходному размеру
        }, 500);
    }
});