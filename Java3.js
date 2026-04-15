document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. КОРЗИНА =====
    const cartModal = document.getElementById('cartModal');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');
    
    // Загрузка из localStorage
    let cart = JSON.parse(localStorage.getItem('bookCornerCart')) || [];

    function updateUI() {
        // Обновляем счетчик
        const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (cartCountEl) cartCountEl.textContent = count;

        // Отрисовка списка
        if (cartItemsEl) {
            if (cart.length === 0) {
                cartItemsEl.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
                if (cartTotalEl) cartTotalEl.textContent = '0';
                return;
            }
            
            let html = '';
            let total = 0;
            cart.forEach((item, index) => {
                const price = Number(item.price) || 0;
                const qty = Number(item.qty) || 1;
                total += price * qty;
                html += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.title}</h4>
                            <p>${price} ₽ × ${qty}</p>
                        </div>
                        <div class="cart-controls">
                            <button onclick="changeQty(${index}, -1)">−</button>
                            <span>${qty}</span>
                            <button onclick="changeQty(${index}, 1)">+</button>
                        </div>
                    </div>`;
            });
            cartItemsEl.innerHTML = html;
            if (cartTotalEl) cartTotalEl.textContent = total;
        }
    }

    function saveCart() {
        localStorage.setItem('bookCornerCart', JSON.stringify(cart));
        updateUI();
    }

    // Глобальная функция для кнопок +/-
    window.changeQty = function(index, delta) {
        if (!cart[index]) return;
        cart[index].qty = (Number(cart[index].qty) || 1) + delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
        saveCart();
    };

    // Открытие/Закрытие корзины
    document.getElementById('openCartBtn')?.addEventListener('click', () => {
        cartModal?.classList.add('open');
        updateUI();
    });
    document.getElementById('closeCartBtn')?.addEventListener('click', () => cartModal?.classList.remove('open'));
    document.getElementById('cartOverlay')?.addEventListener('click', () => cartModal?.classList.remove('open'));

    // Добавление товара
    document.getElementById('addToCart')?.addEventListener('click', function() {
        const id = this.dataset.id;
        const title = this.dataset.title;
        const price = Number(this.dataset.price) || 0;
        
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty = (Number(existing.qty) || 0) + 1;
        } else {
            cart.push({ id, title, price, qty: 1 });
        }
        saveCart();
        alert(`"${title}" добавлена в корзину!`);
    });

    // Оформление заказа
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) return alert('Корзина пуста!');
        if (confirm('Оформить заказ?')) {
            cart = [];
            saveCart();
            cartModal?.classList.remove('open');
            alert('Спасибо за заказ!');
        }
    });

    // ===== 2. БУРГЕР-МЕНЮ =====
    const burger = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');
    
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Закрытие при клике на ссылку
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Закрытие при ресайзе на десктоп
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let current = 0;
    let interval;

    function showSlide(idx) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[idx].classList.add('active');
        dots[idx]?.classList.add('active');
        current = idx;
    }

    function next() { showSlide((current + 1) % slides.length); }
    function prev() { showSlide((current - 1 + slides.length) % slides.length); }
    function resetInterval() { clearInterval(interval); }

    document.querySelector('.slider-btn.prev')?.addEventListener('click', () => { prev(); resetInterval(); });
    document.querySelector('.slider-btn.next')?.addEventListener('click', () => { next(); resetInterval(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); resetInterval(); }));
    
    const wrapper = document.querySelector('.slider-wrapper');
    wrapper?.addEventListener('mouseenter', () => clearInterval(interval));
    wrapper?.addEventListener('mouseleave', resetInterval);
    resetInterval();

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab)?.classList.add('active');
        });
    });

    document.getElementById('downloadExcerpt')?.addEventListener('click', function(e) {
        e.preventDefault();
        const original = this.innerHTML;
        this.innerHTML = 'Загрузка...';
        this.disabled = true;
        setTimeout(() => {
            alert('Фрагмент успешно скачан!');
            this.innerHTML = original;
            this.disabled = false;
        }, 1200);
    });

    updateUI();
});