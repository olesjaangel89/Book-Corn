document.addEventListener('DOMContentLoaded', () => {
    
    const burgerBtn = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
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

        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && navMenu.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                burgerBtn.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
    }

    const articleCards = document.querySelectorAll('.article-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        articleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});