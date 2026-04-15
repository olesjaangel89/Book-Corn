    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    let slideInterval;

    function changeSlide(direction) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    function nextSlide() { changeSlide(1); }
    function resetInterval() {
        clearInterval(slideInterval);
    }
    if (slides.length > 0) {
        const sliderWrapper = document.querySelector('.slider-container');
        sliderWrapper?.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderWrapper?.addEventListener('mouseleave', resetInterval);
    }


    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    burgerBtn?.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
        document.body.classList.toggle('menu-open', isExpanded);
    });
    navMenu?.querySelectorAll('a, input').forEach(el => {
        el.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                burgerBtn.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767 && navMenu?.classList.contains('active')) {
            burgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            burgerBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });


    document.getElementById('downloadExcerpt')?.addEventListener('click', function(e) {
        e.preventDefault();
        const btn = this;
        const original = btn.innerHTML;
        btn.innerHTML = 'Подготовка...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        setTimeout(() => {
            alert('Файл успешно скачан!');
            btn.innerHTML = original;
            btn.disabled = false;
            btn.style.opacity = '1';
        }, 1200);
    });


    let cart = JSON.parse(localStorage.getItem('bookCornerCart')) || [];

    const cartModal = document.getElementById('cartModal');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartTriggerDesktop = document.getElementById('cartTrigger');
    const cartTriggerMobile = document.getElementById('cartTriggerMobile');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEls = document.querySelectorAll('.cart-count');


    function openCart() {
        if (!cartModal) return;
        cartModal.classList.add('open');
        cartModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        renderCart();
    }
    function closeCart() {
        if (!cartModal) return;
        cartModal.classList.remove('open');
        cartModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cartTriggerDesktop?.addEventListener('click', openCart);
    cartTriggerMobile?.addEventListener('click', () => {
        if (navMenu?.classList.contains('active')) {
            burgerBtn?.classList.remove('active');
            navMenu.classList.remove('active');
            burgerBtn?.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
        openCart();
    });
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && cartModal?.classList.contains('open')) closeCart();
    });


    function updateCartCount() {
        const count = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCountEls.forEach(el => el.textContent = count);
    }
    function saveCart() {
        localStorage.setItem('bookCornerCart', JSON.stringify(cart));
        updateCartCount();
    }


    function renderCart() {
        if (!cartItemsEl || !cartTotalEl) return;
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
            cartTotalEl.textContent = '0';
            return;
        }
        let html = '', total = 0;
        cart.forEach(item => {
            total += item.price * item.qty;
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price} ₽ × ${item.qty}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="cart-qty-btn" onclick="window.changeQty(${item.id}, -1)">
                        −</button>
                        <span class="cart-qty">${item.qty}</span>
                        <button class="cart-qty-btn" onclick="window.changeQty(${item.id}, 1)">
                        +</button>
                        <button class="cart-remove" onclick="window.removeFromCart(${item.id})" 
                        aria-label="Удалить">×</button>
                    </div>
                </div>`;
        });
        cartItemsEl.innerHTML = html;
        cartTotalEl.textContent = total.toLocaleString('ru-RU');
    }


    window.changeQty = function(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        }
        saveCart(); renderCart();
    };
    window.removeFromCart = function(id) {
        cart = cart.filter(i => i.id !== id);
        saveCart(); renderCart();
    };


    function addToCart(id, title, price, image) {
        const existing = cart.find(i => i.id === id);
        if (existing) existing.qty++;
        else cart.push({ id, title, price, image, qty: 1 });
        saveCart(); renderCart(); openCart();
        showNotification(`"${title}" добавлен в корзину`);
    }


    function showNotification(msg) {
        const n = document.createElement('div');
        n.style.cssText = `position:fixed;top:80px;right:20px;background:#2C1810;
        color:#fff;padding:12px 20px;border-radius:8px;font-family:'S',sans-serif;
        font-size:14px;z-index:3000;box-shadow:0 4px 15px rgba(0,0,0,0.3);
        animation:slideIn 0.3s,fadeOut 0.3s 2.7s forwards;`;
        n.textContent = '✓ ' + msg;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }
    if (!document.getElementById('cart-notif-style')) {
        const s = document.createElement('style');
        s.id = 'cart-notif-style';
        s.textContent = `@keyframes slideIn{from{
            transform:translateX(100%);opacity:0}to{transform:translateX(0)
            ;opacity:1}}@keyframes fadeOut{from{opacity:1}to{opacity:0}}`;
        document.head.appendChild(s);
    }


    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) return alert('Корзина пуста!');
            cart = []; saveCart(); renderCart(); closeCart();
            alert('Спасибо за заказ! Мы свяжемся с вами.');
    });


    document.querySelectorAll('.btn-cart').forEach((btn, i) => {
        btn.addEventListener('click', function() {
            const card = this.closest('.book-card');
            const title = card.querySelector('.book-title').textContent;
            const price = parseInt(card.querySelector('.price1').textContent.replace(/\D/g, ''));
            const image = card.querySelector('.book-cover').src;
            addToCart(i + 1, title, price, image);
        });
    });

   document.addEventListener('DOMContentLoaded', () => {
        const yearSpan = document.querySelector('.current-year');
            if (yearSpan) {
                const currentYear = new Date().getFullYear();
                yearSpan.textContent = currentYear;
            }
    });

    updateCartCount();