// --- Utility functions (if needed) ---
function toggleMenu() {
  const nav = document.getElementById('navbar')?.querySelector('ul');
  if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// --- Main script ---
document.addEventListener('DOMContentLoaded', function () {
  // --- Year auto-update ---
  const yr = new Date().getFullYear();
  ['year','year2','year3','year4','year5'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = yr;
  });
  
  // --- Image slider functionality ---
  const slider = document.getElementById('imageSlider');
  if (slider) {
    const track = slider.querySelector('.image-slider-track');
    const images = slider.querySelectorAll('.slider-img');
    let currentIndex = 0;
    const slideTo = (idx) => {
      track.style.transform = `translateX(-${idx * 100}%)`;
    };
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      slideTo(currentIndex);
    }, 4000); // Slide every 4 seconds
    slideTo(0); // Initial position
  }
   
  // --- Smooth scroll for internal links ---
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if(target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  // --- Scroll to top button ---
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Show button when scrolling down
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });
  }
 
  // Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if(menuToggle && mobileNav){
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if(isOpen){
      mobileNav.classList.remove('open');
      mobileNav.style.maxHeight = '0';
      mobileNav.setAttribute('aria-hidden','true');
    } else {
      mobileNav.classList.add('open');
      mobileNav.style.maxHeight = mobileNav.scrollHeight + 'px';
      mobileNav.setAttribute('aria-hidden','false');
    }
  });
}

  // --- Theme toggle (light/dark) with icons ---
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const moonIcon = themeToggle.querySelector('.icon-moon');
    const sunIcon = themeToggle.querySelector('.icon-sun');
    const applyTheme = (isDark) => {
      document.body.classList.toggle('dark', isDark);
      document.body.classList.toggle('light', !isDark);
      localStorage.setItem('bh_theme_dark', isDark ? '1' : '0');
      if (moonIcon && sunIcon) {
        moonIcon.style.display = isDark ? 'none' : 'inline';
        sunIcon.style.display = isDark ? 'inline' : 'none';
      }
    };
    const saved = localStorage.getItem('bh_theme_dark') === '1';
    applyTheme(saved);
    themeToggle.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark'));
    });
  }

  // --- Accordion (skills dropdown) ---
  const accordionBtns = document.querySelectorAll('.accordion-btn');
  if (accordionBtns.length) {
    accordionBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        // Close all panels
        accordionBtns.forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          if (b.nextElementSibling) b.nextElementSibling.style.maxHeight = null;
        });
        // Open this panel if it was closed
        if (!expanded) {
          this.setAttribute('aria-expanded', 'true');
          const panel = this.nextElementSibling;
          if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
    // Optionally, open the first panel by default:
    accordionBtns[0].click();
  }

  // --- Reveal animations on scroll (simple) ---
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('inview');
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'none';
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => observer.observe(r));

  // --- Simple form submit (demo) ---
  const forms = document.querySelectorAll('.contact-form');
  forms.forEach(frm=>{
    frm.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Message sent (demo). I will wire the real form when you want to go live.');
      frm.reset();
    });
  });
});


// --- Service Works Modal ---
// --- Service Works Modal Carousel ---
const worksData = {
  "data-entry": [
    { img: "images/flyer.png", caption: "Excel Cleanup" },
    { img: "images/logo.jpg", caption: "Bulk Data Entry" },
    { img: "images/logo2.png", caption: "Spreadsheet Formatting" }
  ],
  "graphics": [
    { img: "images/graphics1.jpg", caption: "Social Banner" },
    { img: "images/graphics2.jpg", caption: "Ad Creative" },
    { img: "images/graphics3.jpg", caption: "Branding Sample" }
  ],
  "va": [
    { img: "images/va1.jpg", caption: "Inbox Management" },
    { img: "images/va2.jpg", caption: "Appointment Booking" },
    { img: "images/va3.jpg", caption: "Client Follow-up" }
  ]
};

const worksModal = document.getElementById('worksModal');
const worksModalTitle = document.getElementById('worksModalTitle');
const closeWorksModal = document.getElementById('closeWorksModal');
const worksCarouselTrack = document.getElementById('worksCarouselTrack');
const worksPrev = document.getElementById('worksPrev');
const worksNext = document.getElementById('worksNext');
const worksCarouselDots = document.getElementById('worksCarouselDots');

let currentSlide = 0;
let worksSlides = [];
let autoScrollInterval = null;

function showWorksModal(service, title) {
  const works = worksData[service] || [];
  worksSlides = works;
  worksCarouselTrack.innerHTML = works.map(w =>
    `<div class="works-carousel-slide">
      <img src="${w.img}" alt="${w.caption}">
      <div style="text-align:center;font-size:0.95em;color:var(--muted);margin-top:4px">${w.caption}</div>
    </div>`
  ).join('');
  worksCarouselDots.innerHTML = works.map((_, i) =>
    `<span class="carousel-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></span>`
  ).join('');
  worksModalTitle.textContent = title + " — My Works";
  currentSlide = 0;
  updateCarousel();
  worksModal.classList.add('open');
  startAutoScroll();
}

function updateCarousel() {
  const slide = worksCarouselTrack.querySelector('.works-carousel-slide');
  const slideWidth = slide ? slide.offsetWidth + 20 : 320; // 20 for margin
  worksCarouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % worksSlides.length;
  updateCarousel();
}
function prevSlide() {
  currentSlide = (currentSlide - 1 + worksSlides.length) % worksSlides.length;
  updateCarousel();
}
function goToSlide(idx) {
  currentSlide = idx;
  updateCarousel();
}

function startAutoScroll() {
  stopAutoScroll();
  autoScrollInterval = setInterval(nextSlide, 3000);
}
function stopAutoScroll() {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
}

document.querySelectorAll('.see-works-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const service = btn.getAttribute('data-service');
    const title = btn.closest('.price-card').querySelector('h3').textContent;
    showWorksModal(service, title);
  });
});
if (worksPrev) worksPrev.onclick = () => { prevSlide(); startAutoScroll(); };
if (worksNext) worksNext.onclick = () => { nextSlide(); startAutoScroll(); };
if (worksCarouselDots) worksCarouselDots.onclick = e => {
  if (e.target.classList.contains('carousel-dot')) {
    goToSlide(Number(e.target.dataset.idx));
    startAutoScroll();
  }
};
if (closeWorksModal) closeWorksModal.onclick = () => { worksModal.classList.remove('open'); stopAutoScroll(); };
if (worksModal) worksModal.onclick = e => {
  if (e.target === worksModal) { worksModal.classList.remove('open'); stopAutoScroll(); }
};

// Lightbox for viewing image
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightbox = document.getElementById('closeLightbox');

document.addEventListener('click', function(e) {
  if (e.target.closest('.works-carousel-slide img')) {
    lightboxImg.src = e.target.src;
    lightboxModal.style.display = 'flex';
  }
  if (e.target === lightboxModal || e.target === closeLightbox) {
    lightboxModal.style.display = 'none';
    lightboxImg.src = '';
  }
});