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

  // --- HERO SHOWCASE SLIDESHOW (manual + autoplay) ---
  (function heroSlideshow(){
    const showcase = document.querySelector('.hero-showcase');
    if (!showcase) return;
    const slides = Array.from(showcase.children).filter(el => !el.classList.contains('hero-dots') && !el.classList.contains('hero-nav'));
    if (!slides.length) return;

    // create dots if not present
    const dotsContainer = document.getElementById('heroDots');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');

    // initialize slides state
    let idx = 0;
    let interval = null;
    const isMobile = () => window.innerWidth <= 979;

    function updateSlides() {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
      });
      // update dots
      if (dotsContainer) {
        dotsContainer.querySelectorAll('button').forEach((b,i)=> b.classList.toggle('active', i===idx));
      }
    }

    function go(n) {
      idx = (n + slides.length) % slides.length;
      updateSlides();
    }

    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }

    // build dots
    if (dotsContainer && dotsContainer.children.length === 0) {
      slides.forEach((_,i)=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide ' + (i+1));
        b.addEventListener('click', ()=> { go(i); pauseAuto(); });
        dotsContainer.appendChild(b);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); pauseAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', ()=>{ next(); pauseAuto(); });

    function startAuto(){
      stopAuto();
      interval = setInterval(()=>{ next(); }, 4000);
    }
    function stopAuto(){ if (interval) { clearInterval(interval); interval = null; } }
    function pauseAuto(){ stopAuto(); setTimeout(()=>{ if(!isMobile()) startAuto(); }, 6000); }

    // pause on hover/focus
    showcase.addEventListener('mouseenter', stopAuto);
    showcase.addEventListener('mouseleave', ()=>{ if(!isMobile()) startAuto(); });
    showcase.addEventListener('focusin', stopAuto);
    showcase.addEventListener('focusout', ()=>{ if(!isMobile()) startAuto(); });

    // on resize: if mobile, ensure only active slide visible; resume/stop autoplay appropriately
    window.addEventListener('resize', ()=>{
      updateSlides();
      if (isMobile()) stopAuto(); else if (!interval) startAuto();
    });

    // initial
    updateSlides();
    if (!isMobile()) startAuto();
  })();

  // --- Testimonials persistence & moderation (client-side demo) ---
  const TESTIMONIALS_KEY = 'bh_testimonials';
  const ADMIN_KEY = 'bh_admin';

  function loadTestimonials() {
    try {
      const raw = localStorage.getItem(TESTIMONIALS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function saveTestimonials(list) {
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
  }

  // Render testimonials: public sees only approved; admin sees pending and approve/delete controls
  function renderTestimonials() {
    const listEl = document.getElementById('testimonialsList');
    if (!listEl) return;
    listEl.innerHTML = '';
    const items = loadTestimonials();
    const isAdmin = localStorage.getItem(ADMIN_KEY) === '1';

    // Approved first
    items.filter(t => t.status === 'approved').forEach(t => {
      const el = document.createElement('div');
      el.className = 'testimonial-card';
      el.dataset.id = t.id;
      el.innerHTML = `<p>"${escapeHtml(t.text)}"</p><strong>— ${escapeHtml(t.name)}${t.company ? `, ${escapeHtml(t.company)}` : ''}</strong>`;
      listEl.appendChild(el);
    });

    // If admin, show pending items with controls
    if (isAdmin) {
      items.filter(t => t.status === 'pending').forEach(t => {
        const el = document.createElement('div');
        el.className = 'testimonial-card pending';
        el.dataset.id = t.id;
        el.innerHTML = `<p>"${escapeHtml(t.text)}"</p><strong>— ${escapeHtml(t.name)}${t.company ? `, ${escapeHtml(t.company)}` : ''}</strong>`;
        const ctrl = document.createElement('div');
        ctrl.className = 'admin-controls';
        const approve = document.createElement('button');
        approve.className = 'admin-btn approve';
        approve.textContent = 'Approve';
        approve.dataset.id = t.id;
        const del = document.createElement('button');
        del.className = 'admin-btn delete';
        del.textContent = 'Delete';
        del.dataset.id = t.id;
        ctrl.appendChild(approve);
        ctrl.appendChild(del);
        el.appendChild(ctrl);
        listEl.appendChild(el);
      });
    }
  }

  // Basic XSS escape for inserted strings
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;","`":"&#x60;"}[s]));
  }

  // Handle form submit: save as pending
  const testimonialForm = document.getElementById('testimonialForm');
  if (testimonialForm) {
    testimonialForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.querySelector('#name')?.value?.trim() || 'Anonymous';
      const company = this.querySelector('#company')?.value?.trim() || '';
      const text = this.querySelector('#testimonial')?.value?.trim();
      if (!text) { alert('Please enter your testimonial.'); return; }
      const items = loadTestimonials();
      const item = { id: Date.now().toString(), name, company, text, status: 'pending' };
      items.push(item);
      saveTestimonials(items);
      this.reset();
      alert('Thanks — your testimonial was saved and is pending review.');
      renderTestimonials();
    });
  }

  // Admin toggle
  const adminToggle = document.getElementById('adminToggle');
  function updateAdminLabel() {
    if (!adminToggle) return;
    const on = localStorage.getItem(ADMIN_KEY) === '1';
    adminToggle.textContent = on ? 'Admin (on)' : 'Admin';
  }
  if (adminToggle) {
    adminToggle.addEventListener('click', function (e) {
      e.preventDefault();
      const on = localStorage.getItem(ADMIN_KEY) === '1';
      localStorage.setItem(ADMIN_KEY, on ? '0' : '1');
      updateAdminLabel();
      renderTestimonials();
    });
    updateAdminLabel();
  }

  // Delegate approve/delete actions
  const testimonialsContainer = document.getElementById('testimonialsList');
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.admin-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      if (!id) return;
      const items = loadTestimonials();
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) return;
      if (btn.classList.contains('approve')) {
        items[idx].status = 'approved';
        saveTestimonials(items);
        renderTestimonials();
      }
      if (btn.classList.contains('delete')) {
        if (!confirm('Delete this testimonial? This action cannot be undone.')) return;
        items.splice(idx, 1);
        saveTestimonials(items);
        renderTestimonials();
      }
    });
  }

  // Initial render for testimonials
  renderTestimonials();

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
