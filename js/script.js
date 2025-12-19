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
        behavior: 'smooth',
      });
    }
  });
});

// ------------------------------------------------------------
// Contact Form (Netlify + AJAX, NO REDIRECT)
// ------------------------------------------------------------
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn");

    let isValid = true;

    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      input.classList.remove("is-invalid");
    });

    if (!nameInput.value.trim()) {
      nameInput.classList.add("is-invalid");
      isValid = false;
    }

    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      subjectInput.classList.add("is-invalid");
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      messageInput.classList.add("is-invalid");
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

    const formData = new FormData(contactForm);

    fetch("/", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        document.getElementById("formSuccess").style.display = "block";
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-paper-plane me-2"></i>Send Message';
      })
      .catch(() => {
        alert("Something went wrong. Please try again.");
        submitBtn.disabled = false;
      });
  });
}

// ------------------------------------------------------------
// Email validation helper
// ------------------------------------------------------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ------------------------------------------------------------
// Navbar background on scroll
// ------------------------------------------------------------
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  navbar.classList.toggle("navbar-scrolled", window.scrollY > 50);
});

// ------------------------------------------------------------
// Skill bar animation
// ------------------------------------------------------------
const skillsSection = document.getElementById("skills");
if (skillsSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".progress-bar").forEach(bar => {
          const w = bar.style.width;
          bar.style.width = "0";
          setTimeout(() => {
            bar.style.transition = "width 1.5s ease";
            bar.style.width = w;
          }, 200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(skillsSection);
}
