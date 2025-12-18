// Custom JavaScript for Dhruv Patel's Portfolio
const apiUrl = 'http://localhost:8000/api/contact';

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
    const originalBtnText = submitBtn.innerHTML;
    
    // Get status elements
    const contactStatus = document.getElementById('contactStatus');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const sendingMessage = document.getElementById('sendingMessage');
    
    // Reset previous states
    nameInput.classList.remove('is-invalid');
    emailInput.classList.remove('is-invalid');
    subjectInput.classList.remove('is-invalid');
    messageInput.classList.remove('is-invalid');
    
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    sendingMessage.style.display = 'none';
    contactStatus.style.display = 'block';
    
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
        errorMessage.style.display = 'block';
        document.getElementById('errorText').textContent = 'Please fill in all required fields correctly.';
        return;
    }
    
    // Show sending state
    sendingMessage.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    
    // Prepare form data
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
    };
    
    try {
        // Send to Python server
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            sendingMessage.style.display = 'none';
            successMessage.style.display = 'block';
            document.getElementById('successText').textContent = result.message;
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                contactStatus.style.display = 'none';
            }, 5000);
        } else {
            // Show error message
            sendingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            document.getElementById('errorText').textContent = result.message || 'There was an error sending your message. Please try again.';
        }
    } catch (error) {
        // Show error message
        sendingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        document.getElementById('errorText').textContent = 'Network error. Please make sure the Python server is running (localhost:8000).';
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
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
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