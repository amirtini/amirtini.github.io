document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const clickableImage = document.getElementById('clickable-image');
    const clickCountDisplay = document.getElementById('click-count');
    const clickSound = document.getElementById('clickSound');
    const cpsDisplay = document.getElementById('cps');
    const body = document.body;
    const sidebar = document.querySelector('.sidebar'); // Получаем навигационную панель

    let clickCount = 0; // Инициализируем счетчик
    let clicksInLastSecond = 0; // Клики за последнюю секунду
    let lastClickTime = Date.now(); // Время последнего клика
    let isWarningShown = false; // Флаг показа предупреждения
    let warningClicks = 0; // Счетчик кликов по предупреждению

    // Добавляем обработчик движения мыши
    document.addEventListener('mousemove', (e) => {
        // Если курсор находится в верхней части экрана (выше 100px)
        if (e.clientY < 100) {
            sidebar.style.opacity = '1';
            sidebar.style.transform = 'translateY(0)';
        } else {
            sidebar.style.opacity = '0';
            sidebar.style.transform = 'translateY(-100%)';
        }
    });

    // Добавляем стили для навигационной панели
    const sidebarStyle = document.createElement('style');
    sidebarStyle.textContent = `
        .sidebar {
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(-100%);
        }
    `;
    document.head.appendChild(sidebarStyle);

    // Функция для обновления CPS
    function updateCPS() {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime;
        
        if (timeDiff >= 1000) {
            cpsDisplay.textContent = clicksInLastSecond;
            
            // Проверяем скорость кликов
            if (clicksInLastSecond > 40 && !isWarningShown) {
                showWarning();
            } else if (clicksInLastSecond <= 40 && isWarningShown) {
                // Если скорость кликов стала меньше 40, убираем предупреждение
                const overlay = document.querySelector('.warning-overlay');
                if (overlay) {
                    overlay.style.transition = 'opacity 0.5s';
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.remove();
                        isWarningShown = false;
                    }, 500);
                }
            }
            
            clicksInLastSecond = 0;
            lastClickTime = currentTime;
        }
    }

    // Функция для показа предупреждения
    function showWarning() {
        isWarningShown = true;
        warningClicks = 0;

        // Создаем оверлей
        const overlay = document.createElement('div');
        overlay.className = 'warning-overlay'; // Добавляем класс для поиска
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.backdropFilter = 'blur(10px)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.transition = 'opacity 0.5s';

        // Создаем текст предупреждения
        const warning = document.createElement('div');
        warning.style.color = '#ff0000';
        warning.style.fontSize = '48px';
        warning.style.fontWeight = 'bold';
        warning.style.textAlign = 'center';
        warning.style.textShadow = '0 0 10px #ff0000';
        warning.style.animation = 'glitch 0.5s infinite';
        warning.innerHTML = 'Нефиг автокликер использовать!';

        // Добавляем стили для анимации глитча
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0% { transform: translate(0) }
                20% { transform: translate(-5px, 5px) }
                40% { transform: translate(-5px, -5px) }
                60% { transform: translate(5px, 5px) }
                80% { transform: translate(5px, -5px) }
                100% { transform: translate(0) }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Добавляем элементы на страницу
        overlay.appendChild(warning);
        body.appendChild(overlay);

        // Добавляем обработчик клика по оверлею
        overlay.addEventListener('click', () => {
            warningClicks++;
            const currentTime = Date.now();
            const timeDiff = currentTime - lastClickTime;
            
            if (timeDiff > 25) { // Если клики медленные (меньше 40 в секунду)
                if (warningClicks < 5) {
                    // Показываем второй текст
                    warning.style.animation = 'none';
                    warning.style.color = '#00ff00';
                    warning.style.textShadow = '0 0 10px #00ff00';
                    warning.innerHTML = 'Вот так то лучше!';
                    warning.style.animation = 'fadeIn 0.5s';

                    // Через 4 секунды возвращаем все как было
                    setTimeout(() => {
                        overlay.style.transition = 'opacity 0.5s';
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            overlay.remove();
                            style.remove();
                            isWarningShown = false;
                        }, 500);
                    }, 4000);
                }
            } else {
                // Если клики быстрые, показываем предупреждение об автокликере
                warning.style.animation = 'glitch 0.5s infinite';
                warning.style.color = '#ff0000';
                warning.style.textShadow = '0 0 10px #ff0000';
                warning.innerHTML = 'Нефиг автокликер использовать!';
            }
            lastClickTime = currentTime;
        });

        // Добавляем обработчик для восстановления при обновлении страницы
        window.addEventListener('beforeunload', function() {
            overlay.remove();
            style.remove();
        });
    }

    // Запускаем обновление CPS каждую секунду
    setInterval(updateCPS, 1000);

    // Добавляем обработчик события клика
    clickableImage.addEventListener('click', () => {
        if (isWarningShown) return; // Не реагируем на клики, если предупреждение показано

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
            'rotate(100deg)',
            'rotate(-100deg)',
            'scale(10.5)',
            'translateX(200px)',
            'translateY(200px)',
            'scale(10.5)',
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