/* =====================================================
   PREMIUM CASE STUDY - UPGRADED JAVASCRIPT
   Creative animations with optimized performance
   ===================================================== */

(function() {
    'use strict';

    // Throttle function for performance
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return func(...args);
        };
    }

    // Debounce function
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    document.addEventListener('DOMContentLoaded', function() {

        /* =====================================================
           1. ANIMATED PARTICLE BACKGROUND
           ===================================================== */
        const canvas = document.getElementById('particleCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let animationId;

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = document.documentElement.scrollHeight;
            }

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 0.5;
                    this.speedX = (Math.random() - 0.5) * 0.5;
                    this.speedY = (Math.random() - 0.5) * 0.5;
                    this.opacity = Math.random() * 0.5 + 0.2;
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;

                    if (this.x > canvas.width) this.x = 0;
                    if (this.x < 0) this.x = canvas.width;
                    if (this.y > canvas.height) this.y = 0;
                    if (this.y < 0) this.y = canvas.height;
                }

                draw() {
                    ctx.fillStyle = `rgba(103, 102, 255, ${this.opacity})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            function initParticles() {
                particles = [];
                const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
            }

            function connectParticles() {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 120) {
                            ctx.strokeStyle = `rgba(103, 102, 255, ${0.15 * (1 - distance / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });

                connectParticles();
                animationId = requestAnimationFrame(animate);
            }

            resizeCanvas();
            initParticles();
            animate();

            // Optimize resize
            window.addEventListener('resize', debounce(() => {
                cancelAnimationFrame(animationId);
                resizeCanvas();
                initParticles();
                animate();
            }, 250));
        }

        /* =====================================================
           2. SCROLL REVEAL ANIMATIONS
           ===================================================== */
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all scroll reveal elements
        document.querySelectorAll('[data-scroll-reveal], .content-section, .solution-card, .result-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            revealObserver.observe(el);
        });

        /* =====================================================
           3. PARALLAX HERO EFFECT
           ===================================================== */
        const heroSection = document.querySelector('.blog-details-page-title');
        if (heroSection) {
            const handleParallax = throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.4;
                
                if (scrolled <= window.innerHeight) {
                    heroSection.style.transform = `translateY(${rate}px)`;
                }
            }, 16);

            window.addEventListener('scroll', handleParallax, { passive: true });
        }

        /* =====================================================
           4. ANIMATED COUNTERS
           ===================================================== */
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 60;
            const duration = 2000;
            const stepTime = duration / 60;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.round(current);
            }, stepTime);
        }

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.counter);
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-counter]').forEach(el => {
            counterObserver.observe(el);
        });

        /* =====================================================
           5. SMOOTH SCROLL ENHANCEMENT
           ===================================================== */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        /* =====================================================
           6. ENHANCED HOVER EFFECTS
           ===================================================== */
        const cards = document.querySelectorAll('.solution-card, .result-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });

            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });

            // 3D tilt effect
            card.addEventListener('mousemove', throttle(function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            }, 16));

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        /* =====================================================
           7. IMAGE LAZY LOADING OPTIMIZATION
           ===================================================== */
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });



        /* =====================================================
           10. SCROLL PROGRESS INDICATOR
           ===================================================== */
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #6766FF, #B8A9FF);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        const updateProgressBar = throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercentage + '%';
        }, 50);

        window.addEventListener('scroll', updateProgressBar, { passive: true });

        /* =====================================================
           11. META TAG ANIMATION
           ===================================================== */
        const metaTags = document.querySelectorAll('.meta-blog span');
        metaTags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.1}s`;
            tag.style.animation = 'fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both';
        });

        /* =====================================================
           12. SOLUTION CARDS STAGGER ANIMATION
           ===================================================== */
        const solutionCards = document.querySelectorAll('.solution-card');
        solutionCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
        });

        /* =====================================================
           13. PERFORMANCE MONITORING
           ===================================================== */
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration}ms`);
                    }
                }
            });

            try {
                perfObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Long task API not supported
            }
        }

        /* =====================================================
           14. VISIBILITY CHANGE OPTIMIZATION
           ===================================================== */
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Pause animations when tab is not visible
                document.querySelectorAll('*').forEach(el => {
                    const computedStyle = window.getComputedStyle(el);
                    if (computedStyle.animationName !== 'none') {
                        el.style.animationPlayState = 'paused';
                    }
                });
            } else {
                // Resume animations when tab becomes visible
                document.querySelectorAll('*').forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });

        /* =====================================================
           15. TOUCH DEVICE OPTIMIZATIONS
           ===================================================== */
        if ('ontouchstart' in window) {
            // Disable hover effects on touch devices for better performance
            document.querySelectorAll('.solution-card, .result-card, .meta-blog span').forEach(el => {
                el.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                }, { passive: true });

                el.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 300);
                }, { passive: true });
            });
        }

        /* =====================================================
           16. PRELOAD CRITICAL IMAGES
           ===================================================== */
        const criticalImages = document.querySelectorAll('.blog-details-thumb img');
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });

        /* =====================================================
           17. REDUCE MOTION FOR ACCESSIBILITY
           ===================================================== */
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
        }

        /* =====================================================
           18. CONSOLE WELCOME MESSAGE
           ===================================================== */
        console.log(
            '%c🚀 Premium Case Study Loaded',
            'color: #6766FF; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(103, 102, 255, 0.3);'
        );
        console.log(
            '%cOptimized for performance with creative animations',
            'color: #B8A9FF; font-size: 14px;'
        );
    });

    /* =====================================================
       19. PAGE LOAD PERFORMANCE
       ===================================================== */
    window.addEventListener('load', function() {
        // Remove preloader with fade effect
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }

        // Log performance metrics
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        }
    });

})();

/* =====================================================
   END OF PREMIUM UPGRADED JAVASCRIPT
   ===================================================== */