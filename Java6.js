document.addEventListener('DOMContentLoaded', () => {
            const burger = document.getElementById('burgerMenu');
            const navMenu = document.getElementById('navMenu');

            if (burger && navMenu) {
                burger.addEventListener('click', () => {
                    burger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                    document.body.classList.toggle('menu-open');
                });

                navMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        if (window.innerWidth <= 768) {
                            burger.classList.remove('active');
                            navMenu.classList.remove('active');
                            document.body.classList.remove('menu-open');
                        }
                    });
                });

                window.addEventListener('resize', () => {
                    if (window.innerWidth > 768) {
                        burger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                });
            }
        });