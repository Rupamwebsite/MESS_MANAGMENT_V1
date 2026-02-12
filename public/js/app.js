// --- Navbar Scroll Logic ---
const initNavbar = () => {
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
};

// --- Advanced Scroll Reveal ---
const initReveal = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Optional: if you want it to re-reveal
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
};

// --- Smooth Anchors ---
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// --- Init Everything ---
// --- Advanced Interactions ---
const initInteractions = () => {
    // Spotlight Effect for Cards & Gallery
    const interactiveElements = document.querySelectorAll('.room-card, .grid-item, .gallery-item');
    window.addEventListener('mousemove', (e) => {
        interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty('--x', `${x}px`); // Used for gallery spotlight
            el.style.setProperty('--y', `${y}px`);
            el.style.setProperty('--mouse-x', `${x}px`); // Used for card spotlight
            el.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Magnetic Buttons, Gallery Items & Logo
    const magneticElements = document.querySelectorAll('.btn-luxury, .gallery-item, .logo');
    magneticElements.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const strength = item.classList.contains('gallery-item') ? 0.1 :
                item.classList.contains('logo') ? 0.2 : 0.3;
            item.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = `translate(0, 0)`;
        });
    });
};

// --- Hero Slideshow ---
const initSlideshow = () => {
    const slides = document.querySelectorAll('.hero-slideshow img');
    if (slides.length === 0) return;

    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
};

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initReveal();
    initSmoothScroll();
    initInteractions();
    initSlideshow();

    // --- Entrance Loader ---
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 500);
        });
    }

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    const openMobileMenu = () => {
        mobileMenuOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = '';
    };

    if (hamburger) {
        hamburger.addEventListener('click', openMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking on overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
    }

    // Close menu when clicking on a navigation link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // --- Smooth Scrolling for Anchors ---
});

// Form Handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = data.user.role === 'ADMIN' ? '/admin/dashboard.html' : '/user/dashboard.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('regPassword').value;

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password })
            });
            const data = await res.json();

            if (res.ok) {
                alert('Registration successful! Waiting for admin approval.');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        }
    });
}

// --- Rotating Hero Text ---
const initRotatingText = () => {
    const words = ['Modern', 'Safe', 'Clean', 'Premium', 'Affordable'];
    const heroH1 = document.querySelector('.hero h1');

    if (!heroH1) return;

    // Store the original second line (with gradient)
    const secondLine = heroH1.querySelector('span');
    if (!secondLine) return;

    let currentIndex = 0;

    const changeWord = () => {
        // Get the first text node (the word before &)
        const textNode = heroH1.firstChild;
        if (!textNode || textNode.nodeType !== 3) return;

        const currentText = textNode.textContent.trim();

        // Fade out
        heroH1.style.opacity = '0.6';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % words.length;
            textNode.textContent = words[currentIndex] + ' ';

            // Fade in
            heroH1.style.opacity = '1';
        }, 300);
    };

    // Change word every 3 seconds
    setInterval(changeWord, 3000);
};

// Initialize all on page load
window.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initReveal();
    initSmoothScroll();
    initInteractions();
    initSlideshow();
    initRotatingText();

    // Loader fade-out
    setTimeout(() => {
        document.querySelector('.loader-wrapper').classList.add('fade-out');
    }, 800);
});
