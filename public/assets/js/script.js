document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 600);
    }, 800);

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
});