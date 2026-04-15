document.addEventListener('DOMContentLoaded', () => {
    
    // ===== БУРГЕР-МЕНЮ =====
    const burgerBtn = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');

    console.log('Burger:', burgerBtn); // Для отладки
    console.log('NavMenu:', navMenu);

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', function() {
            console.log('Burger clicked!'); // Для отладки
            
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Обновляем aria-атрибут
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Блокируем скролл фона
            document.body.classList.toggle('menu-open', isExpanded);
        });

        // Закрытие меню при клике на ссылку (только на мобильных)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 767) {
                    burgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                    burgerBtn.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('menu-open');
                }
            });
        });

        // Закрытие при изменении размера окна (переход на десктоп)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && navMenu.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                burgerBtn.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
    } else {
        console.error('Бургер или меню не найдены!');
    }

    // ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (name && email && message) {
                alert('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
                this.reset();
            } else {
                alert('Пожалуйста, заполните все поля формы.');
            }
        });
    }
});