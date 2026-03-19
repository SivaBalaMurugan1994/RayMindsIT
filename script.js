/**
 * RayMinds IT - Premium Theme JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Background Scroll Effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Swap icon
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Hero Image Slider ---
    const slides = document.querySelectorAll('.hero-bg');
    const dots = document.querySelectorAll('.carousel-indicators .dot');
    let currentSlide = 0;

    if (slides.length > 0 && dots.length > 0) {
        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Auto cycle every 5 seconds
        let slideInterval = setInterval(nextSlide, 5000);

        // Clickable dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }

    // --- Contact Form Validation ---
    const contactForm = document.querySelector('.contact-form-split');

    if (contactForm) {
        const fields = [
            { id: 'name', type: 'text' },
            { id: 'email', type: 'email' },
            { id: 'mobile', type: 'text' },
            { id: 'subject', type: 'text' },
            { id: 'message', type: 'text' }
        ];

        const validateField = (field) => {
            const input = document.getElementById(field.id);
            const errorSpan = document.getElementById(field.id + 'Error');
            if (!input || !errorSpan) return true;

            let fieldValid = true;

            if (!input.value.trim()) {
                fieldValid = false;
                // Reset to default empty error messages
                if (field.id === 'name') errorSpan.innerText = 'Full Name is required';
                if (field.id === 'email') errorSpan.innerText = 'Email Address is required';
                if (field.id === 'mobile') errorSpan.innerText = 'Mobile number is required';
                if (field.id === 'subject') errorSpan.innerText = 'Subject is required';
                if (field.id === 'message') errorSpan.innerText = 'Message is required';

            } else if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    fieldValid = false;
                    errorSpan.innerText = "Please enter a valid email format (e.g. xxx@gmail.com)";
                }
            }

            if (!fieldValid) {
                input.classList.add('input-error');
                errorSpan.classList.add('visible');
                return false;
            } else {
                input.classList.remove('input-error');
                errorSpan.classList.remove('visible');
                return true;
            }
        };

        // Validate on key press (input event fires instantly on every keystroke)
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.addEventListener('input', () => validateField(field));
            }
        });

        // Handle form submission
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;
            
            fields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Success state UI (Optional simulated submission)
                contactForm.innerHTML = '<div style="text-align:center; padding: 40px; color: #34a853; width:100%; grid-column: 1 / -1;"><i class="fas fa-check-circle fa-4x" style="margin-bottom:20px;"></i><h3>Message Sent Successfully!</h3><p style="color:#666;">We will get back to you shortly.</p></div>';
            }
        });
    }

});
