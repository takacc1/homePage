document.addEventListener('DOMContentLoaded', () => {
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
    slides[0].classList.add('active');

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);

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
        const loaderEl = document.getElementById('loader');
        if (loaderEl) {
            loaderEl.style.opacity = '0';
            loaderEl.style.display = 'flex';
            requestAnimationFrame(() => {
                loaderEl.style.opacity = '1';
            });
        }
    });

    // ページロード完了時にローダーを隠す
    window.addEventListener('pageshow', () => {
        const loaderEl = document.getElementById('loader');
        if (loaderEl) {
            loaderEl.style.opacity = '0';
            setTimeout(() => { loaderEl.style.display = 'none'; }, 600);
        }
    });

    // iPhoneのスワイプジェスチャーに対応
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = Math.abs(touchEndY - touchStartY);

        // 右にスワイプ（X軸の移動が大きく、Y軸の移動が小さい）
        if (diffX > 50 && diffY < 50) {
            history.back();
        }
    }, false);
});