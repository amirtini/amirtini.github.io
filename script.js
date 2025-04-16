// Получаем все кнопки навигации
const navButtons = document.querySelectorAll('.nav-button');

// Добавляем обработчик события для каждой кнопки
navButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        const tooltip = button.querySelector('.tooltip');
        tooltip.style.display = 'block'; // Показываем подсказку
        tooltip.style.opacity = '1'; // Устанавливаем непрозрачность
    });

    button.addEventListener('mouseleave', () => {
        const tooltip = button.querySelector('.tooltip');
        tooltip.style.display = 'none'; // Скрываем подсказку
        tooltip.style.opacity = '0'; // Устанавливаем непрозрачность
    });
});

