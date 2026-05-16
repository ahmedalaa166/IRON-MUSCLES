// ===== Product Data =====
const products = {
    creatine: [
        { 
            id: 'c1', 
            name: 'Creatine Crea Power 80 Serv', 
            size: '400 جرام', 
            price: 1200, 
            description: 'كريا باور كريا بيور اللماني - 80 جرعه - الجرعه 5 جرام',
            image: 'images/Crea-Power-Creatine-400-g.png', 
            category: 'creatine' 
        },
    ],
    protein: [],
    mass: [],
    vitamins: [],
    preworkout: [],
    fatburners: [],
    citrulline: [],
    offers: [],
};


// ===== Cart State =====
let cart = JSON.parse(localStorage.getItem('ironCart')) || [];

// ===== DOM Elements =====
const $ = id => document.getElementById(id);

// ===== Render Logic =====
function renderHomePreviews() {
    const previewContainer = $('homePreviews');
    if (!previewContainer) return;

    const sections = [
        { id: 'creatine', name: 'Creatine', icon: 'fas fa-atom', tag: 'Power & Performance' },
        { id: 'preworkout', name: 'Pre-Workout', icon: 'fas fa-bolt', tag: 'High Energy' },
    ];

    previewContainer.innerHTML = sections.map(sec => {
        let prods = products[sec.id] || [];
        let displayProds = [...prods].sort(() => 0.5 - Math.random()).slice(0, 6);

        return `
            <section id="${sec.id}" class="section">
                <div class="section-bg-effect"></div>
                <div class="container">
                    <div class="section-header">
                        <span class="section-tag"><i class="${sec.icon}"></i> ${sec.tag}</span>
                        <h2 class="section-title">${sec.name}</h2>
                        <a href="category.html?c=${sec.id}" class="btn btn-outline" style="margin-top:10px">مشاهدة الكل</a>
                    </div>
                    <div class="products-grid">
                        ${displayProds.map(p => `
                            <div class="product-card reveal">
                                    <a href="product.html?id=${p.id}" class="card-link-wrapper">
                                        <div class="card-img"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
                                        <div class="card-body">
                                            <h3 class="card-name">${p.name}</h3>
                                            <div class="card-meta">
                                                <span><i class="fas fa-box"></i> ${p.size || p.weight || 'حجم قياسي'}</span>
                                                ${p.description ? `<p class="card-desc">${p.description}</p>` : ''}
                                            </div>
                                            <div class="card-price">
                                                <span class="price-current">${p.price} ج.م</span>
                                                ${p.oldPrice ? `<span class="price-old">${p.oldPrice} ج.م</span>` : ''}
                                            </div>
                                        </div>
                                    </a>
                                    <button class="card-btn" onclick="addToCart('${p.id}','${p.name}',${p.price},'${p.image}')">
                                        <i class="fas fa-cart-plus"></i> اشتري الآن
                                    </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }).join('');
}

function renderCategoryPage() {
    const grid = $('categoryGrid');
    if (!grid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('c') || 'creatine';
    const catTitle = $('categoryTitle');
    
    const catNames = {
        creatine: 'Creatine',
        protein: 'Protein',
        mass: 'Mass Gainer',
        vitamins: 'Vitamins',
        preworkout: 'Pre-Workout',
        fatburners: 'Fat Burners',
        citrulline: 'Citrulline',
        offers: 'Exclusive Offers'
    };

    if (catTitle) catTitle.textContent = catNames[cat] || 'المنتجات';
    
    const prods = products[cat] || [];
    grid.innerHTML = prods.map(p => `
        <div class="product-card reveal">
            <a href="product.html?id=${p.id}" class="card-link-wrapper">
                <div class="card-img"><img src="${p.image}" alt="${p.name}"></div>
                <div class="card-body">
                    <h3 class="card-name">${p.name}</h3>
                    <div class="card-meta">
                        <span><i class="fas fa-box"></i> ${p.size || p.weight || 'قياسي'}</span>
                        ${p.description ? `<p class="card-desc">${p.description}</p>` : ''}
                    </div>
                    <div class="card-price">
                        <span class="price-current">${p.price} ج.م</span>
                        ${p.oldPrice ? `<span class="price-old">${p.oldPrice} ج.م</span>` : ''}
                    </div>
                </div>
            </a>
            <button class="card-btn" onclick="addToCart('${p.id}','${p.name}',${p.price},'${p.image}')">
                <i class="fas fa-cart-plus"></i> اشتري الآن
            </button>
        </div>
    `).join('');
}

function renderProductPage() {
    const container = $('productDetails');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    let product = null;
    for (let cat in products) {
        product = products[cat].find(p => p.id === productId);
        if (product) break;
    }

    if (!product) {
        container.innerHTML = `<div class="error-msg">المنتج غير موجود! <a href="index.html">العودة للرئيسية</a></div>`;
        return;
    }

    document.title = `Iron Muscles - ${product.name}`;

    container.innerHTML = `
        <div class="product-image-side reveal">
            <div class="main-image">
                <img src="${product.image}" alt="${product.name}" id="mainProdImg">
            </div>
        </div>
        <div class="product-info-side reveal">
            <span class="prod-badge">${catNames[product.category] || product.category}</span>
            <h1 class="prod-name">${product.name}</h1>
            <div class="prod-price">
                <span class="current">${product.price} ج.م</span>
                ${product.oldPrice ? `<span class="old">${product.oldPrice} ج.م</span>` : ''}
            </div>
            
            <div class="prod-description">
                <h3>وصف المنتج</h3>
                <p>${product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}</p>
            </div>

            <div class="prod-features">
                <div class="feature-item"><i class="fas fa-check-circle"></i> أصلي 100%</div>
                <div class="feature-item"><i class="fas fa-shipping-fast"></i> شحن سريع</div>
                <div class="feature-item"><i class="fas fa-shield-alt"></i> ضمان الجودة</div>
            </div>

            <div class="prod-qty">
                <label>الكمية:</label>
                <div class="qty-selector">
                    <button onclick="changeProdQty(-1)">-</button>
                    <input type="number" id="prodQty" value="1" min="1" readonly>
                    <button onclick="changeProdQty(1)">+</button>
                </div>
            </div>

            <div class="prod-actions">
                <button class="btn btn-primary btn-glow" onclick="addCurrentProdToCart()">
                    <i class="fas fa-cart-plus"></i> إضافة للسلة
                </button>
                <button onclick="buyNow()" class="btn btn-outline">
                    <i class="fas fa-bolt"></i> شراء الآن
                </button>
            </div>
        </div>
    `;
}


function changeProdQty(delta) {
    const input = $('prodQty');
    if (!input) return;
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

function addCurrentProdToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const qty = parseInt($('prodQty').value) || 1;

    let product = null;
    for (let cat in products) {
        product = products[cat].find(p => p.id === productId);
        if (product) break;
    }

    if (product) {
        addToCartWithQty(product.id, product.name, product.price, product.image, qty);
    }
}

function buyNow() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const qty = parseInt($('prodQty').value) || 1;

    let product = null;
    for (let cat in products) {
        product = products[cat].find(p => p.id === productId);
        if (product) break;
    }

    if (product) {
        addToCartWithQty(product.id, product.name, product.price, product.image, qty);
        openCheckout();
    }
}

function addToCartWithQty(id, name, price, image, qty) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id, name, price, image, qty });
    }
    saveCart();
    updateCartUI();
    showToast(`تمت إضافة ${qty} قطع للعربة ✅`);
}

// ===== Cart Functions =====
function addToCart(id, name, price, image) {
    addToCartWithQty(id, name, price, image, 1);
}


function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) { removeFromCart(id); return; }
    }
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('ironCart', JSON.stringify(cart));
}

function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const cartCount = $('cartCount');
    const cartFooter = $('cartFooter');
    const cartTotal = $('cartTotal');
    const cartItems = $('cartItems');

    if (cartCount) cartCount.textContent = count;
    if (cartFooter) cartFooter.style.display = cart.length ? 'block' : 'none';
    if (cartTotal) cartTotal.textContent = total + ' ج.م';

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-cart-plus"></i><p>عربة التسوق فارغة</p></div>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="price">${item.price * item.qty} ج.م</div>
                        <div class="cart-item-qty">
                            <button onclick="updateQty('${item.id}',-1)">-</button>
                            <span>${item.qty}</span>
                            <button onclick="updateQty('${item.id}',1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }
    }
}

// ===== Checkout Logic =====
let shippingCost = 0;

function openCheckout() {
    if (cart.length === 0) {
        showToast('العربة فارغة! 🛒');
        return;
    }
    toggleCart(false);
    $('checkout-section').classList.add('show');
    renderCheckoutSummary();
}

function closeCheckout() {
    $('checkout-section').classList.remove('show');
}

function renderCheckoutSummary() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    $('checkoutItemsList').innerHTML = cart.map(i => `
        <div class="total-row">
            <span>${i.name} (x${i.qty})</span>
            <span>${i.price * i.qty} ج.م</span>
        </div>
    `).join('');
    
    $('checkoutSubtotal').textContent = subtotal + ' ج.م';
    calculateShipping();
}

function calculateShipping() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const city = $('custCity').value;
    
    if (subtotal >= 5000) {
        shippingCost = 0;
    } else if (city === 'cairo') {
        shippingCost = 50;
    } else if (city === 'provinces') {
        shippingCost = 80;
    } else {
        shippingCost = 0;
    }
    
    $('checkoutShipping').textContent = shippingCost + ' ج.م';
    $('checkoutTotal').textContent = (subtotal + shippingCost) + ' ج.م';
}

// ===== Theme Toggle =====
const themeToggle = $('themeToggle');
if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== Order Submission =====
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mojrzzkk"; 

const orderForm = $('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

        const name = $('custName') ? $('custName').value : '';
        const phone = $('custPhone') ? $('custPhone').value : '';
        const citySelect = $('custCity');
        const city = citySelect ? citySelect.options[citySelect.selectedIndex].text : '';
        const building = $('custBuilding') ? $('custBuilding').value : '';
        const street = $('custStreet') ? $('custStreet').value : '';
        const landmark = ($('custLandmark') && $('custLandmark').value) ? $('custLandmark').value : 'لا يوجد';
        const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

        let itemsMsg = '';
        cart.forEach(item => {
            itemsMsg += `- ${item.name} (x${item.qty}) = ${item.price * item.qty} ج.م\n`;
        });

        const formData = {
            name: name,
            phone: phone,
            city: city,
            address: `${building}, ${street}`,
            landmark: landmark,
            products: itemsMsg,
            subtotal: subtotal + ' ج.م',
            shipping: shippingCost + ' ج.م',
            total: (subtotal + shippingCost) + ' ج.م'
        };

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                cart = [];
                saveCart();
                updateCartUI();
                closeCheckout();
                showOrderSuccess();
            } else {
                throw new Error('حدث خطأ في الإرسال');
            }
        } catch (error) {
            showToast('❌ عذراً، حدث خطأ. حاول مرة أخرى.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

function showOrderSuccess() {
    const successModal = $('order-success-modal');
    if (successModal) successModal.classList.add('show');
}

function closeSuccessModal() {
    const successModal = $('order-success-modal');
    if (successModal) successModal.classList.remove('show');
}

const closeCheckoutBtn = $('closeCheckout');
if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);

// Update existing cart button to open checkout
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.removeAttribute('href');
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCheckout();
    });
}

// ===== Toast =====
function showToast(msg) {
    const toast = $('toast');
    const toastMsg = $('toastMessage');
    if (toast && toastMsg) {
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

// ===== Cart Sidebar =====
function toggleCart(show) {
    const sidebar = $('cartSidebar');
    const overlay = $('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('show', show);
        overlay.classList.toggle('show', show);
        document.body.style.overflow = show ? 'hidden' : '';
    }
}

const cartBtn = $('cartBtn');
if (cartBtn) cartBtn.addEventListener('click', () => toggleCart(true));
const cartClose = $('cartClose');
if (cartClose) cartClose.addEventListener('click', () => toggleCart(false));
const cartOverlay = $('cartOverlay');
if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

// ===== Mobile Menu =====
const menuToggle = $('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        $('navLinks').classList.toggle('show');
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const toggle = $('menuToggle');
        if (toggle) toggle.classList.remove('active');
        const nav = $('navLinks');
        if (nav) nav.classList.remove('show');
    });
});

// ===== Navbar Scroll =====
const navbar = $('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    const btn = $('backToTop');
    if (btn) btn.classList.toggle('show', window.scrollY > 400);
});

// ===== Active Nav Link =====
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 200;
    
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// ===== Back to Top =====
const backToTop = $('backToTop');
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Countdown Timer =====
function startCountdown() {
    const countDays = $('countDays');
    if (!countDays) return;

    const end = new Date();
    end.setDate(end.getDate() + 3);
    end.setHours(23, 59, 59, 0);

    const savedEnd = localStorage.getItem('offerEnd');
    const endTime = savedEnd ? new Date(savedEnd) : end;
    if (!savedEnd) localStorage.setItem('offerEnd', end.toISOString());

    function update() {
        const now = new Date();
        let diff = endTime - now;
        if (diff <= 0) {
            localStorage.removeItem('offerEnd');
            diff = 0;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        if ($('countDays')) $('countDays').textContent = String(d).padStart(2, '0');
        if ($('countHours')) $('countHours').textContent = String(h).padStart(2, '0');
        if ($('countMinutes')) $('countMinutes').textContent = String(m).padStart(2, '0');
        if ($('countSeconds')) $('countSeconds').textContent = String(s).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}

// ===== Counter Animation =====
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = +el.dataset.target;
        if (!target) return;
        const duration = 2000;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
}

// ===== Scroll Reveal =====
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== Hero Particles =====
function createParticles() {
    const container = $('heroParticles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 6 + 's';
        p.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(p);
    }
}

// ===== FAQ Accordion =====
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
        });
    });
}

// ===== Contact Form =====
const contactForm = $('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = $('contactName').value;
        const email = $('contactEmail').value;
        const message = $('contactMessage').value;
        const msg = `📩 رسالة من موقع Iron Muscles\n\n👤 الاسم: ${name}\n📧 البريد: ${email}\n💬 الرسالة: ${message}`;
        window.open(`https://wa.me/201000000000?text=${encodeURIComponent(msg)}`, '_blank');
        showToast('تم إرسال الرسالة بنجاح ✅');
        this.reset();
    });
}

// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = $('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            animateCounters();
        }, 1800);
    }
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    if ($('homePreviews')) {
        renderHomePreviews();
    }
    if ($('categoryGrid')) {
        renderCategoryPage();
    }
    if ($('productDetails')) {
        renderProductPage();
    }
    updateCartUI();
    startCountdown();
    createParticles();
    initFAQ();
    setTimeout(initReveal, 100);
});
