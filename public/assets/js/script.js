document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero-fixed');
    const root = document.documentElement;
    const navigation = performance.getEntriesByType('navigation')[0];
    const isHistoryNavigation = navigation && navigation.type === 'back_forward';
    let introTimeout;
    const unlockIntro = () => {
        root.classList.remove('hero-intro-pending');
        clearTimeout(introTimeout);
    };

    if (hero && !isHistoryNavigation && !window.location.hash) {
        root.classList.add('hero-intro-pending');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        introTimeout = setTimeout(unlockIntro, 6000);
        window.addEventListener('pagehide', unlockIntro, { once: true });
    }

    const hideLoader = () => {
        const loaderEl = document.getElementById('loader');
        if (loaderEl) {
            loaderEl.style.opacity = '0';
            loaderEl.style.display = 'none';
        }
    };
    if (isHistoryNavigation) {
        unlockIntro();
        hideLoader();
    }

    const sectionNav = document.querySelector('.site-nav');
    if (sectionNav) {
        const navbar = document.getElementById('navbar');
        const links = [...sectionNav.querySelectorAll('a[href^="#"]')];
        const sections = links.map(link => document.getElementById(link.getAttribute('href').slice(1)));
        let navigationFrame = null;
        const updateNavigation = () => {
            navigationFrame = null;
            let activeIndex = -1;
            sections.forEach((section, index) => {
                if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.35) {
                    activeIndex = index;
                }
            });
            links.forEach((link, index) => {
                if (index === activeIndex) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
            navbar.classList.toggle('is-scrolled', window.scrollY > 40);
        };
        const scheduleNavigation = () => {
            if (navigationFrame === null) navigationFrame = requestAnimationFrame(updateNavigation);
        };
        links.forEach((link, index) => {
            link.addEventListener('click', event => {
                if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !sections[index]) return;
                event.preventDefault();
                history.replaceState(history.state, '', link.getAttribute('href'));
                sections[index].scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                    block: 'start'
                });
            });
        });
        window.addEventListener('scroll', scheduleNavigation, { passive: true });
        window.addEventListener('resize', scheduleNavigation);
        window.addEventListener('pageshow', scheduleNavigation);
        updateNavigation();
    }

    // 1. Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 600);
    }, 800);

    // ローダー完全非表示後にhero-titleのアニメーションをスタート
    setTimeout(() => {
        const heroChars = document.querySelectorAll('.hero-title .char');
        heroChars.forEach(char => {
            char.classList.add('animate-char');
        });
        // subtitle と scroll-indicator も同時にアニメーション開始
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (heroSubtitle) heroSubtitle.classList.add('animate-subtitle');
        if (scrollIndicator) scrollIndicator.classList.add('animate-scroll');
    }, 1500);

    // Show loader when internal links are clicked so navigation shows spinner
    document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        // ignore external links, anchors, mailto, tel, and targets that open new tab
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || a.target === '_blank') return;

        a.addEventListener('click', (e) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (a.hasAttribute('data-history-back') && history.length > 1) {
                e.preventDefault();
                history.back();
                return;
            }
            // prevent default navigation to show loader first
            e.preventDefault();
            const loaderEl = document.getElementById('loader');
            if (loaderEl) {
                // ensure starting from invisible state to avoid top-left flash
                loaderEl.style.opacity = '0';
                loaderEl.style.display = 'flex';
                // next frame, fade in
                requestAnimationFrame(() => {
                    loaderEl.style.opacity = '1';
                });
            }
            // small delay to let spinner render, then navigate
            setTimeout(() => { window.location.href = href; }, 140);
        });
    });

    // 2. Hero Slider
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }

    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }

    // 3. Spotlight Effect (Mouse Tracking)
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });



    // 5. Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-text, .spotlight-card').forEach(el => {
        el.classList.add('reveal-text');
        observer.observe(el);
    });

    // 4. Back Navigation Support
    // ブラウザの戻るボタンに対応
    window.addEventListener('popstate', () => {
        unlockIntro();
        hideLoader();
    });

    // ページロード完了時にローダーを隠す
    window.addEventListener('pageshow', (event) => {
        if (event.persisted || isHistoryNavigation) {
            unlockIntro();
            hideLoader();
            return;
        } else if (root.classList.contains('hero-intro-pending')) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        const loaderEl = document.getElementById('loader');
        if (loaderEl) {
            loaderEl.style.opacity = '0';
            setTimeout(() => { loaderEl.style.display = 'none'; }, 600);
        }
    });

    // iPhoneのスワイプジェスチャーに対応
    let touchStartX = null;
    let touchStartY = null;

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) {
            touchStartX = null;
            touchStartY = null;
            return;
        }
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);

    document.addEventListener('touchend', (e) => {
        if (touchStartX === null || touchStartY === null || !e.changedTouches.length) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = Math.abs(touchEndY - touchStartY);
        const startsAtEdge = touchStartX <= 24;
        touchStartX = null;
        touchStartY = null;

        // Leave edge swipes to the browser so they do not navigate back twice.
        if (!startsAtEdge && diffX > 50 && diffY < 50 && history.length > 1) {
            history.back();
        }
    }, false);

    document.addEventListener('touchcancel', () => {
        touchStartX = null;
        touchStartY = null;
    });
});
