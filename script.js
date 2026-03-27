// ============================================
// 106 FRANK ST S — PROPERTY SALE WEBSITE
// Full-featured: gallery filters, lightbox,
// FAQ accordion, form handling, FAB, scroll
// animations, copy-to-clipboard, back-to-top
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const nav = document.getElementById('nav');
    const handleScroll = () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll animations (AOS-style) ---
    const animateElements = document.querySelectorAll('[data-animate]');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for sibling elements
                const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
                let delay = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) delay = i * 80;
                });
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);
                animateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateObserver.observe(el);
    });

    // Add CSS class for animated state
    const style = document.createElement('style');
    style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // --- Gallery Filters ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // --- Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    let currentImageIndex = 0;

    function getVisibleImages() {
        return Array.from(galleryItems)
            .filter(item => !item.classList.contains('hidden'))
            .map(item => ({
                src: item.querySelector('img').src,
                caption: item.dataset.caption || ''
            }));
    }

    function openLightbox(index) {
        const images = getVisibleImages();
        currentImageIndex = index;
        lightboxImg.src = images[index].src;
        lightboxCaption.textContent = images[index].caption;
        lightboxCounter.textContent = `${index + 1} / ${images.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        const images = getVisibleImages();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxCaption.textContent = images[currentImageIndex].caption;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }

    function prevImage() {
        const images = getVisibleImages();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxCaption.textContent = images[currentImageIndex].caption;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Find index among visible items
            const visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
            const visibleIndex = visibleItems.indexOf(item);
            openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
        });
    });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', prevImage);
    document.querySelector('.lightbox-next').addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if wasn't already open)
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Contact Form (Netlify + Fallback) ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                if (response.ok) {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Fallback: open mailto with form data
                const data = Object.fromEntries(formData);
                const subject = encodeURIComponent('Property Inquiry: 106 Frank St S, Clarissa MN');
                const body = encodeURIComponent(
                    `Name: ${data.firstName} ${data.lastName}\n` +
                    `Email: ${data.email}\n` +
                    `Phone: ${data.phone || 'Not provided'}\n` +
                    `Interest: ${data.interest}\n` +
                    `Funding: ${data.funding}\n` +
                    `Message: ${data.message || 'No message'}`
                );
                window.location.href = `mailto:?subject=${subject}&body=${body}`;

                // Show success anyway
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
            }

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // --- Floating Action Buttons ---
    const fabToggle = document.getElementById('fabToggle');
    const fabGroup = document.getElementById('fabGroup');

    if (fabToggle) {
        fabToggle.addEventListener('click', () => {
            fabGroup.classList.toggle('active');
        });

        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!fabGroup.contains(e.target)) {
                fabGroup.classList.remove('active');
            }
        });

        // Close FAB when clicking an action
        fabGroup.querySelectorAll('.fab-action').forEach(action => {
            action.addEventListener('click', () => {
                fabGroup.classList.remove('active');
            });
        });
    }

    // --- Back to Top ---
    const scrollTop = document.getElementById('scrollTop');
    if (scrollTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                scrollTop.classList.add('visible');
            } else {
                scrollTop.classList.remove('visible');
            }
        }, { passive: true });

        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Active nav link highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(link => {
            link.style.fontWeight = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.fontWeight = '700';
            }
        });
    }, { passive: true });

});

// --- Copy Parcel Number (global function) ---
function copyParcel(btn) {
    const parcelText = btn.dataset.parcel;
    navigator.clipboard.writeText(parcelText).then(() => {
        btn.classList.add('copied');
        setTimeout(() => {
            btn.classList.remove('copied');
        }, 2000);
    });
}
