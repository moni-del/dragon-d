// DDT Web Portal JavaScript
class WebPortal {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createParticles();
        this.startAnimations();
    }

    init() {
        console.log('DDT Web Portal Initialized');
        this.updateStats();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Button click effects
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e);
            });
        });

        // Card hover effects
        document.querySelectorAll('.card-hover').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addGlowEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeGlowEffect(card);
            });
        });
    }

    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            this.createParticle(particlesContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
        
        this.animateParticle(particle);
    }

    animateParticle(particle) {
        const duration = Math.random() * 20000 + 10000;
        const startX = parseFloat(particle.style.left);
        const startY = parseFloat(particle.style.top);
        const endX = Math.random() * 100;
        const endY = Math.random() * 100;
        
        particle.animate([
            { transform: `translate(0, 0)`, opacity: 0 },
            { transform: `translate(0, 0)`, opacity: 1 },
            { transform: `translate(${endX - startX}vw, ${endY - startY}vh)`, opacity: 1 },
            { transform: `translate(${endX - startX}vw, ${endY - startY}vh)`, opacity: 0 }
        ], {
            duration: duration,
            iterations: Infinity
        });
    }

    createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addGlowEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
        element.style.transform = 'translateY(-5px)';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
        element.style.transform = '';
    }

    updateStats() {
        // Simulate real-time stats updates
        setInterval(() => {
            const stats = document.querySelectorAll('[data-stat]');
            stats.forEach(stat => {
                const currentValue = parseInt(stat.textContent);
                const change = Math.floor(Math.random() * 10) - 5;
                const newValue = Math.max(0, currentValue + change);
                stat.textContent = newValue.toLocaleString();
            });
        }, 5000);
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-float');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card-hover').forEach(card => {
            observer.observe(card);
        });
    }

    startAnimations() {
        // Add floating animation to header
        const header = document.querySelector('header');
        if (header) {
            header.classList.add('animate-float');
        }

        // Add pulse animation to badges
        document.querySelectorAll('.badge-glow').forEach(badge => {
            badge.classList.add('animate-pulse-slow');
        });
    }

    // Public methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    updateTheme(theme) {
        document.body.className = `theme-${theme}`;
        localStorage.setItem('theme', theme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.updateTheme(savedTheme);
    }
}

// ---------------- Firebase Integration for Products -----------------

// نفس إعدادات Firebase المستخدمة في تطبيق الموبايل
const firebaseConfig = {
  apiKey: "AIzaSyAzDwv2rkGKmphqQhA6JKZ8UarrRYCa05o",
  authDomain: "dtdt-f871e.firebaseapp.com",
  projectId: "dtdt-f871e",
  storageBucket: "dtdt-f871e.firebasestorage.app",
  messagingSenderId: "948374726005",
  appId: "1:948374726005:android:b2674d3d7944ae7b69df3c"
};

let firestoreDb = null;

function initFirebaseForWeb() {
  if (!window.firebase || !window.firebase.firestore) {
    console.error('Firebase SDK not loaded');
    return;
  }

  try {
    if (window.firebase.apps.length === 0) {
      window.firebase.initializeApp(firebaseConfig);
    }
    firestoreDb = window.firebase.firestore();
  } catch (e) {
    console.error('Failed to initialize Firebase:', e);
  }
}

async function loadProductsFromFirebase() {
  const grid = document.getElementById('products-grid');
  const status = document.getElementById('products-status');

  if (!grid || !status) return;

  if (!firestoreDb) {
    status.textContent = 'تعذر الاتصال بقاعدة البيانات.';
    return;
  }

  try {
    status.textContent = 'جاري جلب المنتجات من قاعدة البيانات...';

    const snapshot = await firestoreDb
      .collection('products')
      .orderBy('createdAt', 'desc')
      .get();

    grid.innerHTML = '';

    if (snapshot.empty) {
      status.textContent = 'لا توجد منتجات متاحة حالياً.';
      return;
    }

    snapshot.forEach(doc => {
      const p = doc.data();

      const card = document.createElement('div');
      card.className = 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all flex flex-col';

      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'w-full h-40 mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center';

      if (p.image) {
        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.name || 'Product';
        img.className = 'w-full h-full object-cover';
        imageWrapper.appendChild(img);
      } else {
        const placeholder = document.createElement('span');
        placeholder.textContent = 'DDT';
        placeholder.className = 'text-2xl font-bold';
        imageWrapper.appendChild(placeholder);
      }

      const title = document.createElement('h3');
      title.className = 'text-lg font-semibold mb-1';
      title.textContent = p.name || 'منتج بدون اسم';

      const desc = document.createElement('p');
      desc.className = 'text-gray-300 text-sm mb-2 line-clamp-2';
      desc.textContent = p.description || '';

      const metaRow = document.createElement('div');
      metaRow.className = 'flex items-center justify-between mb-2';

      const priceWrapper = document.createElement('div');

      const price = document.createElement('span');
      price.className = 'text-xl font-bold text-green-400';
      price.textContent = (p.price || 0) + ' ريال';

      priceWrapper.appendChild(price);

      if (p.originalPrice && p.originalPrice > p.price) {
        const original = document.createElement('span');
        original.className = 'text-sm text-gray-400 line-through mr-2';
        original.textContent = p.originalPrice + ' ريال';
        priceWrapper.appendChild(original);
      }

      const category = document.createElement('span');
      category.className = 'text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 text-gray-100';
      category.textContent = p.category || 'بدون قسم';

      metaRow.appendChild(priceWrapper);
      metaRow.appendChild(category);

      const badgeRow = document.createElement('div');
      badgeRow.className = 'flex items-center gap-2 mt-1 text-xs text-gray-300';

      if (typeof p.discount === 'number' && p.discount > 0) {
        const discount = document.createElement('span');
        discount.className = 'px-2 py-1 rounded-full bg-red-600/80 text-white text-xs';
        discount.textContent = '-' + p.discount + '% خصم';
        badgeRow.appendChild(discount);
      }

      if (typeof p.rating === 'number') {
        const rating = document.createElement('span');
        rating.textContent = '⭐ ' + p.rating.toFixed(1);
        badgeRow.appendChild(rating);
      }

      const footerRow = document.createElement('div');
      footerRow.className = 'mt-3 flex items-center justify-between text-xs text-gray-400';

      const stock = document.createElement('span');
      stock.textContent = p.inStock ? 'متوفر في المخزون' : 'غير متوفر حالياً';
      stock.className = p.inStock ? 'text-green-400' : 'text-red-400';

      footerRow.appendChild(stock);

      card.appendChild(imageWrapper);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(metaRow);
      card.appendChild(badgeRow);
      card.appendChild(footerRow);

      grid.appendChild(card);
    });

    status.textContent = 'تم تحميل المنتجات بنجاح.';
  } catch (err) {
    console.error('Failed to load products from Firebase:', err);
    status.textContent = 'حدث خطأ أثناء جلب المنتجات.';
  }
}

// Initialize the portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة Firebase أولاً
    initFirebaseForWeb();

    const portal = new WebPortal();
    
    // Make portal available globally
    window.WebPortal = portal;
    
    // Add ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-info { background: #3b82f6; }
        .notification-success { background: #10b981; }
        .notification-warning { background: #f59e0b; }
        .notification-error { background: #ef4444; }
    `;
    document.head.appendChild(style);

    // تحميل المنتجات من Firebase بعد تجهيز الواجهة
    loadProductsFromFirebase();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for quick search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.WebPortal.showNotification('البحث السريع قيد التطوير', 'info');
    }
    
    // Ctrl/Cmd + D for dark mode toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        window.WebPortal.updateTheme(newTheme);
        window.WebPortal.showNotification(`تم التبديل إلى الوضع ${newTheme === 'dark' ? 'الليلي' : 'النهاري'}`, 'success');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        // Show notification for slow loads
        if (loadTime > 3000) {
            setTimeout(() => {
                window.WebPortal?.showNotification('تحميل الصفحة بطيء، جاري التحسين...', 'warning');
            }, 2000);
        }
    });
}
