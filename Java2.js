/* js/script.js */
document.addEventListener('DOMContentLoaded', () => {

    let cart = [];
    try {
        const stored = localStorage.getItem('bookCornerCart');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                cart = parsed.map(item => ({
                    ...item,
                    price: Number(item.price) || 0,
                    qty: Number(item.qty) || 1
                }));
            }
        }
    } catch (e) {
        console.error('Ошибка загрузки корзины:', e);
        cart = [];
    }

    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Закрытие меню при клике на ссылку (только на мобильных)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 767) {
                    burgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && navMenu.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    const cartModal = document.getElementById('cartModal');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartItemsEl = document.getElementById('cartItemsList');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEls = document.querySelectorAll('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartTriggers = document.querySelectorAll('.cart-trigger, #cartTriggerMobile');

    function updateCartCount() {
        const count = cart.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
        cartCountEls.forEach(el => { if (el) el.textContent = count; });
    }

    function saveCart() {
        localStorage.setItem('bookCornerCart', JSON.stringify(cart));
        updateCartCount();
    }

    function openCart() {
        if (cartModal) {
            cartModal.classList.add('open');
            renderCart();
        }
    }
    function closeCart() {
        if (cartModal) cartModal.classList.remove('open');
    }

    cartTriggers.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            openCart();
        });
    });
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartModal) cartModal.addEventListener('click', e => {
        if (e.target === cartModal) closeCart();
    });

    function renderCart() {
        if (!cartItemsEl || !cartTotalEl) return;

        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Корзина пуста</p>';
            cartTotalEl.textContent = '0';
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
                        <button onclick="window.updateQty(${index}, -1)">−</button>
                        <span>${qty}</span>
                        <button onclick="window.updateQty(${index}, 1)">+</button>
                    </div>
                </div>`;
        });

        cartItemsEl.innerHTML = html;
        cartTotalEl.textContent = total.toLocaleString('ru-RU');
    }

    window.addToCart = function(id, title, price, image) {
        price = Number(price) || 0;
        const existing = cart.find(i => i.id == id);
        
        if (existing) {
            existing.qty = (Number(existing.qty) || 0) + 1;
        } else {
            cart.push({ id, title, price, image: image || '', qty: 1 });
        }
        
        saveCart();
        renderCart();
        openCart();
        showNotification(`"${title}" добавлен в корзину!`);
    };

    window.updateQty = function(index, change) {
        if (cart[index]) {
            cart[index].qty = (Number(cart[index].qty) || 1) + change;
            if (cart[index].qty <= 0) {
                cart.splice(index, 1);
            }
        }
        saveCart();
        renderCart();
    };

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            const total = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
            if (confirm(`Оформить заказ на сумму ${total.toLocaleString('ru-RU')} ₽?`)) {
                alert(' Спасибо за заказ! Мы свяжемся с вами для подтверждения.');
                cart = [];
                saveCart();
                renderCart();
                closeCart();
            }
        });
    }

    // ==========================================
    // 4. ПРИВЯЗКА КНОПОК "В КОРЗИНУ" НА КАРТОЧКАХ
    // ==========================================
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            if (!card) return;
            
            const id = card.dataset.id;
            const title = card.dataset.title;
            const price = card.dataset.price;
            const image = card.dataset.img;
            
            window.addToCart(id, title, price, image);
        });
    });

    // ==========================================
    // 5. ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ
    // ==========================================
    const filterLinks = document.querySelectorAll('#filters a');
    const products = document.querySelectorAll('.product-card');

    if (filterLinks.length > 0 && products.length > 0) {
        filterLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                filterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const category = link.dataset.cat;
                products.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ==========================================
    // 6. СКАЧИВАНИЕ ФРАГМЕНТА (ИМИТАЦИЯ)
    // ==========================================
    window.downloadExcerpt = function(btn, bookTitle) {
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Загрузка...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        setTimeout(() => {
            alert(`Файл "${bookTitle} - ознакомительный фрагмент.pdf" успешно скачан!`);
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
        }, 1200);
    };

    // ==========================================
    // 7. УВЕДОМЛЕНИЯ (TOAST)
    // ==========================================
    function showNotification(message) {
        const existing = document.getElementById('toast-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed; top:90px; right:20px; z-index:3000; display:flex; flex-direction:column; gap:10px;';
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: #2C1810; color: #fff; padding: 12px 20px; 
            border-radius: 8px; font-family: 'S', sans-serif; font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease forwards;
        `;
        toast.textContent = '✓ ' + message;
        container.appendChild(toast);
        document.body.appendChild(container);

        // Inject animation keyframes if not exists
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => container.remove(), 300);
        }, 2500);
    }

    // ==========================================
    // 8. ИНИЦИАЛИЗАЦИЯ
    // ==========================================
    updateCartCount();
});