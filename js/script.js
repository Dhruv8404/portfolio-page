// ============================================================
// Custom JavaScript for Dhruv Patel's Portfolio (NETLIFY READY)
// ============================================================


// ------------------------------------------------------------
// Smooth scrolling for navigation links
// ------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});


// ------------------------------------------------------------
// Contact Form Validation (Netlify Forms)
// ------------------------------------------------------------
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitBtn = document.getElementById('submitBtn');

        let isValid = true;

        // Reset validation UI
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            input.classList.remove('is-invalid');
        });

        // Validation
        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!subjectInput.value.trim()) {
            subjectInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            messageInput.classList.add('is-invalid');
            isValid = false;
        }

        // ❌ Stop submit only if invalid
        if (!isValid) {
            e.preventDefault();
            return;
        }

        // ✅ Allow Netlify submit
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    });
}



// ------------------------------------------------------------
// Email validation helper
// ------------------------------------------------------------
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// ------------------------------------------------------------
// Navbar background on scroll
// ------------------------------------------------------------
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});


// ------------------------------------------------------------
// Active nav link on scroll
// ------------------------------------------------------------
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', function () {
    let current = '';

    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


// ------------------------------------------------------------
// Skill bar animation
// ------------------------------------------------------------
const animateSkillBars = () => {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';

        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = targetWidth;
        }, 300);
    });
};


// ------------------------------------------------------------
// Trigger skill animation once
// ------------------------------------------------------------
const skillsSection = document.getElementById('skills');

if (skillsSection) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(skillsSection);
}


// ------------------------------------------------------------
// Real-time form validation
// ------------------------------------------------------------
document.querySelectorAll('#contactForm input, #contactForm textarea')
    .forEach(input => {
        input.addEventListener('input', function () {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });
// Show success message after Netlify redirect
if (contactForm) {
  contactForm.addEventListener("submit", () => {
    setTimeout(() => {
      const successBox = document.getElementById("formSuccess");
      if (successBox) {
        successBox.style.display = "block";
        successBox.scrollIntoView({ behavior: "smooth" });
      }
    }, 800);
  });
}
