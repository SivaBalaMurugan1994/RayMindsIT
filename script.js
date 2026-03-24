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

    // --- Scrollspy: Highlight Active Nav Link ---
    const sections = document.querySelectorAll('main section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100; // 100px offset for navbar height
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // If scrolled to very top, default to 'home'
        if (window.scrollY < 80) current = 'home';

        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Run on page load too


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
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                // SHOW LOADING
                const overlay = document.getElementById('loading-overlay');
                if(overlay) overlay.classList.add('active');

                const templateParams = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('mobile').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };

                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
                emailjs.send('service_ao5utkr', 'template_bcnis99', templateParams)
                    .then(function() {
                        if(overlay) overlay.classList.remove('active');
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        contactForm.reset();
                        showToast('success', 'Success!', 'Your message has been sent successfully.');
                    }, function(error) {
                        console.error('EmailJS Error:', error);
                        if(overlay) overlay.classList.remove('active');
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        showToast('error', 'Failed!', 'There was an error sending your message. Please try again.');
                    });
            }
        });
    }

    // --- Toast Notification System ---
    function showToast(type, title, message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.classList.add('toast', type);

        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-times-circle';

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;

        container.appendChild(toast);

        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 5000);
    }

});
