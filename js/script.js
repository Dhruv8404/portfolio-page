// Custom JavaScript for Dhruv Patel's Portfolio - NETLIFY VERSION
// ============================================================

// Use Formspree (get your ID from formspree.io)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xleqrzzk';

// Smooth scrolling for navigation links
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

// Form validation and submission
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    
    // Check if button exists
    if (!submitBtn) {
        console.error('Submit button not found! Make sure button has id="submitBtn"');
        return;
    }
    
    const originalBtnText = submitBtn.innerHTML;
    
    // Get status elements
    const contactStatus = document.getElementById('contactStatus');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const sendingMessage = document.getElementById('sendingMessage');
    
    // Reset previous states
    nameInput.classList.remove('is-invalid');
    emailInput.classList.remove('is-invalid');
    subjectInput.classList.remove('is-invalid');
    messageInput.classList.remove('is-invalid');
    
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    if (sendingMessage) sendingMessage.style.display = 'none';
    if (contactStatus) contactStatus.style.display = 'block';
    
    // Validate form
    let isValid = true;
    
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
    
    if (!isValid) {
        if (errorMessage) errorMessage.style.display = 'block';
        if (errorText) errorText.textContent = 'Please fill in all required fields correctly.';
        return;
    }
    
    // Show sending state
    if (sendingMessage) sendingMessage.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    
    // Prepare form data for Formspree
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        _replyto: emailInput.value.trim(),
        _subject: `Portfolio Contact: ${subjectInput.value.trim()}`
    };
    
    try {
        // Send to Formspree
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Show success message
            if (sendingMessage) sendingMessage.style.display = 'none';
            if (successMessage) successMessage.style.display = 'block';
            if (successText) successText.textContent = 'Your message has been sent successfully! I will get back to you soon.';
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                if (contactStatus) contactStatus.style.display = 'none';
            }, 5000);
        } else {
            // Show error message
            if (sendingMessage) sendingMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'block';
            if (errorText) errorText.textContent = 'Failed to send message. Please try again or email me directly.';
        }
    } catch (error) {
        // Show error message
        if (sendingMessage) sendingMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'block';
        if (errorText) errorText.textContent = 'Network error. Please check your connection and try again.';
        console.error('Error sending email:', error);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else if (navbar) {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Add active class to nav links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
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

// Add animation to skill bars on scroll
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.progress-bar');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 300);
    });
};

// Use Intersection Observer to trigger skill bar animation
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
}

// Real-time form validation
document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('is-invalid');
        }
    });
});