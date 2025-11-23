/*
  GSTRAVELS JS (script.js)
  - UPGRADED with:
  1. Mobile Navigation Toggle
  2. Scroll to Top Button
  3. Active Navigation Highlighting on Scroll
  4. Client-Side Form Validation
  5. Hero Slider (existing)
  6. Dynamic Booking Buttons (existing)
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const navLinks = document.querySelectorAll('.nav-mobile .nav-link');

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('active');
    // Prevent scrolling when mobile nav is open
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- 2. Scroll to Top Button ---
  const scrollTopBtn = document.querySelector('.scroll-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  });

  // --- 3. Active Navigation Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const mobileNavLinks = document.querySelectorAll('.nav-mobile .nav-link');

  function updateActiveLink() {
    let currentSection = '';
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 20; // 20px offset
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    // Handle case for being at the very top of the page
    if (window.scrollY < 200) {
      currentSection = 'home';
    }

    [...desktopNavLinks, ...mobileNavLinks].forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Run on page load

  // --- 4. Hero Slider Logic (Same as before) ---
  const slides = document.querySelectorAll('.slide');
  const nextBtn = document.querySelector('.slider-btn.next');
  const prevBtn = document.querySelector('.slider-btn.prev');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }
  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
  }
  function stopSlideShow() {
    clearInterval(slideInterval);
  }
  nextBtn.addEventListener('click', () => { nextSlide(); stopSlideShow(); });
  prevBtn.addEventListener('click', () => { prevSlide(); stopSlideShow(); });
  document.querySelector('.hero').addEventListener('mouseenter', stopSlideShow);
  document.querySelector('.hero').addEventListener('mouseleave', startSlideShow);
  showSlide(currentSlide);
  startSlideShow();

  // --- 5. Client-Side Form Validation & WhatsApp Submission ---
  const bookingForm = document.getElementById('bookingForm');
  const whatsappNumber = "919098357280";
  const successMessage = document.getElementById('form-success-message');

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.classList.remove('active');
    
    if (validateForm()) {
      // Show success message
      successMessage.classList.add('active');

      // --- Build WhatsApp Message ---
      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData.entries());
      const date = new Date(data.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      let message = `*GSTRAVELS Booking Request* %0A%0A`;
      message += `*Name:* ${data.name}%0A`;
      message += `*Contact:* ${data.phone}%0A`;
      message += `*From:* ${data.from}%0A`;
      message += `*To:* ${data.to}%0A`;
      message += `*Date:* ${formattedDate}%0A`;
      message += `*Car Type:* ${data.car}%0A`;
      message += `*Passengers:* ${data.passengers}%0A`;
      message += `*Notes:* ${data.notes || 'N/A'}%0A%0A`;
      message += `_Please confirm availability and fare._`;
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappURL, '_blank');
        successMessage.classList.remove('active');
      }, 1500);
      
    } else {
      console.log("Form validation failed.");
    }
  });

  function validateForm() {
    let isValid = true;
    const fieldsToValidate = bookingForm.querySelectorAll('[required]');

    // Clear all previous errors
    bookingForm.querySelectorAll('.field.invalid').forEach(field => {
      field.classList.remove('invalid');
    });

    fieldsToValidate.forEach(input => {
      const field = input.closest('.field');
      let fieldValid = true;

      // Check for empty value
      if (!input.value.trim()) {
        fieldValid = false;
      }
      
      // Check for patterns (e.g., phone)
      if (input.pattern) {
        const regex = new RegExp(input.pattern);
        if (!regex.test(input.value)) {
          fieldValid = false;
        }
      }

      // Check for min value (e.g., passengers)
      if (input.min && parseFloat(input.value) < parseFloat(input.min)) {
        fieldValid = false;
      }

      if (!fieldValid) {
        isValid = false;
        field.classList.add('invalid');
      }
    });

    return isValid;
  }

  // --- 6. Dynamic Car/Package Booking Buttons (Same as before) ---
  const bookingSection = document.getElementById('booking');
  function setBookingValue(elementId, value) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
    const inputElement = document.getElementById(elementId);
    if (inputElement) {
      inputElement.value = value;
      inputElement.closest('.field').classList.remove('invalid'); // Clear error
      inputElement.style.transition = 'all 0.2s ease';
      inputElement.style.backgroundColor = '#FFF3E0';
      setTimeout(() => { inputElement.style.backgroundColor = ''; }, 2000);
    }
  }
  document.querySelectorAll('.book-car').forEach(button => {
    button.addEventListener('click', () => {
      setBookingValue('car', button.getAttribute('data-car'));
    });
  });
  document.querySelectorAll('.book-pkg').forEach(button => {
    button.addEventListener('click', () => {
      setBookingValue('to', button.getAttribute('data-package'));
    });
  });

});