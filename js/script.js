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
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });
  }

  // --- Mobile menu toggle ---
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

  // --- Accordion (skills dropdown with caret icon) ---
  const accordionBtns = document.querySelectorAll('.accordion-btn');
  if (accordionBtns.length) {
    accordionBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        // Close all panels
        accordionBtns.forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          if (b.nextElementSibling) b.nextElementSibling.style.maxHeight = null;
          const caret = b.querySelector('.accordion-caret');
          if (caret) caret.style.transform = 'rotate(0deg)';
        });
        // Open this panel if it was closed
        if (!expanded) {
          this.setAttribute('aria-expanded', 'true');
          const panel = this.nextElementSibling;
          if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
          const caret = this.querySelector('.accordion-caret');
          if (caret) caret.style.transform = 'rotate(180deg)';
        }
      });
    });
    // Do NOT open any panel by default
  }
  document.querySelectorAll('.accordion-panel').forEach(panel => {
    panel.style.maxHeight = null;
  });

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

  // --- Nav dropdown: only show on hover/click if NOT on skills page ---
  document.querySelectorAll('.nav-dropdown').forEach(drop => {
    const toggle = drop.querySelector('.dropdown-toggle');
    const menu = drop.querySelector('.dropdown-menu');
    if (toggle && toggle.classList.contains('active')) {
      // On skills page: disable dropdown
      if (menu) menu.style.display = 'none';
      drop.onmouseenter = null;
      drop.onmouseleave = null;
      toggle.onclick = function(e) { e.preventDefault(); }; // Prevent click opening
    } else {
      // On other pages: enable dropdown on hover (desktop)
      drop.onmouseenter = () => { if (menu) menu.style.display = 'block'; drop.classList.add('open'); };
      drop.onmouseleave = () => { if (menu) menu.style.display = 'none'; drop.classList.remove('open'); };
      // On mobile: click to toggle
      toggle.onclick = function(e) {
        if (window.innerWidth < 720) {
          e.preventDefault();
          if (menu) {
            const isOpen = menu.style.display === 'block';
            menu.style.display = isOpen ? 'none' : 'block';
            drop.classList.toggle('open', !isOpen);
          }
        }
      };
    }
  });

  // --- Dropdown for mobile (click to open) ---
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth < 720) {
        e.preventDefault();
        const menu = this.nextElementSibling;
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
      }
    });
  });
});

// --- Service Works Modal Carousel ---
document.addEventListener('DOMContentLoaded', function () {
  // --- Modal Carousel Logic ---
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
    ],
    "ads": [
      { img: "images/ad1.jpg", caption: "Facebook Ad" },
      { img: "images/ad2.jpg", caption: "Instagram Ad" }
    ]
  };

  let currentSlide = 0;
  let worksSlides = [];
  let autoSlideInterval;

  function showWorksModal(service, title) {
    const worksModal = document.getElementById('worksModal');
    const worksModalTitle = document.getElementById('worksModalTitle');
    const worksCarouselTrack = document.getElementById('worksCarouselTrack');
    const worksCarouselDots = document.getElementById('worksCarouselDots');
    worksSlides = worksData[service] || [];
    if (worksModalTitle) worksModalTitle.textContent = title;
    if (worksCarouselTrack) {
      worksCarouselTrack.innerHTML = worksSlides.map(w =>
        `<div class="works-carousel-slide">
          <img src="${w.img}" alt="${w.caption}">
          <div style="text-align:center;font-size:0.95em;color:var(--muted);margin-top:4px">${w.caption}</div>
        </div>`
      ).join('');
    }
    if (worksCarouselDots) {
      worksCarouselDots.innerHTML = worksSlides.map((_, i) =>
        `<span class="carousel-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></span>`
      ).join('');
    }
    currentSlide = 0;
    updateCarousel();
    if (worksModal) {
      worksModal.classList.add('open');
      startAutoSlide();
    }
  }

  function updateCarousel() {
    const worksCarouselTrack = document.getElementById('worksCarouselTrack');
    const slides = worksCarouselTrack ? worksCarouselTrack.querySelectorAll('.works-carousel-slide') : [];
    if (worksCarouselTrack && slides.length) {
      const slide = slides[0];
      const slideWidth = slide ? slide.offsetWidth : worksCarouselTrack.offsetWidth;
      worksCarouselTrack.style.transition = 'transform 0.6s cubic-bezier(.4,0,.2,1)';
      worksCarouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      const worksCarouselTrack = document.getElementById('worksCarouselTrack');
      const slides = worksCarouselTrack ? worksCarouselTrack.querySelectorAll('.works-carousel-slide') : [];
      if (slides.length) {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
      }
    }, 3000); // Change image every 3 seconds
  }

  function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }

  // See Works button event
  document.querySelectorAll('.see-works-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const service = btn.getAttribute('data-service');
      const card = btn.closest('.price-card');
      const title = card ? card.querySelector('h3').textContent : '';
      showWorksModal(service, title);
    });
  });

  // Carousel navigation
  document.getElementById('worksPrev')?.addEventListener('click', function() {
    if (!worksSlides.length) return;
    currentSlide = (currentSlide - 1 + worksSlides.length) % worksSlides.length;
    updateCarousel();
  });
  document.getElementById('worksNext')?.addEventListener('click', function() {
    if (!worksSlides.length) return;
    currentSlide = (currentSlide + 1) % worksSlides.length;
    updateCarousel();
  });
  document.getElementById('worksCarouselDots')?.addEventListener('click', function(e) {
    if (e.target.classList.contains('carousel-dot')) {
      currentSlide = Number(e.target.dataset.idx);
      updateCarousel();
    }
  });

  // Close modal
  document.getElementById('closeWorksModal')?.addEventListener('click', function() {
    document.getElementById('worksModal').classList.remove('open');
    stopAutoSlide();
  });
  document.getElementById('worksModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('open');
      stopAutoSlide();
    }
  });

  // --- Lightbox for viewing image ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightbox = document.getElementById('closeLightbox');
  document.getElementById('worksCarouselTrack')?.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG') {
      if (lightboxImg && lightboxModal) {
        lightboxImg.src = e.target.src;
        lightboxModal.style.display = 'flex';
      }
    }
  });
  closeLightbox?.addEventListener('click', function() {
    if (lightboxModal && lightboxImg) {
      lightboxModal.style.display = 'none';
      lightboxImg.src = '';
    }
  });
  lightboxModal?.addEventListener('click', function(e) {
    if (e.target === lightboxModal) {
      lightboxModal.style.display = 'none';
      lightboxImg.src = '';
    }
  });
});
