// Testimonials management script
document.addEventListener('DOMContentLoaded', async function() {
  const AUTH_TOKEN_KEY = 'bh_auth_token';
  let isAdmin = false;
  let authToken = localStorage.getItem(AUTH_TOKEN_KEY);

  // Initial load of testimonials and admin state
  await loadTestimonials();
  updateAdminState();

  // Testimonials form submission
  const testimonialForm = document.getElementById('testimonialForm');
  if (testimonialForm) {
    testimonialForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = {
        name: this.querySelector('#name')?.value?.trim() || 'Anonymous',
        company: this.querySelector('#company')?.value?.trim() || '',
        text: this.querySelector('#testimonial')?.value?.trim()
      };

      if (!formData.text) {
        alert('Please enter your testimonial text.');
        return;
      }

      try {
        await TestimonialsAPI.submit(formData);
        this.reset();
        alert('Thank you! Your testimonial has been submitted for review.');
        await loadTestimonials();
      } catch (error) {
        alert('Sorry, there was an error submitting your testimonial. Please try again.');
      }
    });
  }

  // Admin toggle in footer
  const adminToggle = document.getElementById('adminToggle');
  if (adminToggle) {
    adminToggle.addEventListener('click', async function(e) {
      e.preventDefault();
      
      if (!isAdmin) {
        // Show login prompt
        const username = prompt('Admin username:');
        const password = prompt('Admin password:');
        
        if (!username || !password) return;
        
        try {
          const token = await AuthAPI.login({ username, password });
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          authToken = token;
          isAdmin = true;
          updateAdminState();
          await loadTestimonials();
        } catch (error) {
          alert('Login failed. Please check your credentials.');
        }
      } else {
        // Logout
        localStorage.removeItem(AUTH_TOKEN_KEY);
        authToken = null;
        isAdmin = false;
        updateAdminState();
        await loadTestimonials();
      }
    });
  }

  // Admin controls event delegation
  const testimonialsList = document.getElementById('testimonialsList');
  if (testimonialsList) {
    testimonialsList.addEventListener('click', async function(e) {
      if (!isAdmin) return;
      
      const btn = e.target.closest('.admin-btn');
      if (!btn) return;
      
      const id = btn.dataset.id;
      if (!id) return;

      try {
        if (btn.classList.contains('approve')) {
          await TestimonialsAPI.approve(id, authToken);
          await loadTestimonials();
        }
        if (btn.classList.contains('delete')) {
          if (!confirm('Delete this testimonial? This cannot be undone.')) return;
          await TestimonialsAPI.delete(id, authToken);
          await loadTestimonials();
        }
      } catch (error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          alert('Your admin session has expired. Please log in again.');
          localStorage.removeItem(AUTH_TOKEN_KEY);
          authToken = null;
          isAdmin = false;
          updateAdminState();
          await loadTestimonials();
        } else {
          alert('Error performing action. Please try again.');
        }
      }
    });
  }

  // Helper: Load and render testimonials
  async function loadTestimonials() {
    const listEl = document.getElementById('testimonialsList');
    if (!listEl) return;

    try {
      // Get approved testimonials
      const approved = await TestimonialsAPI.getApproved();
      
      // If admin, also get pending
      let pending = [];
      if (isAdmin && authToken) {
        pending = await TestimonialsAPI.getPending(authToken);
      }

      // Clear current list
      listEl.innerHTML = '';

      // Render approved testimonials
      approved.forEach(renderTestimonial);

      // Render pending if admin
      if (isAdmin) {
        pending.forEach(t => renderTestimonial(t, true));
      }

      // Update pending count badge
      updatePendingCount(pending.length);

    } catch (error) {
      console.error('Error loading testimonials:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        authToken = null;
        isAdmin = false;
        updateAdminState();
      }
    }
  }

  // Helper: Render single testimonial
  function renderTestimonial(testimonial, isPending = false) {
    const listEl = document.getElementById('testimonialsList');
    if (!listEl) return;

    const el = document.createElement('div');
      el.className = `testimonial-card${isPending ? ' pending' : ''}`;
      el.dataset.id = testimonial._id;
      el.innerHTML = `
        <div class="testimonial-header">
          <div class="testimonial-avatar">${escapeHtml((testimonial.name || ' ' ).charAt(0).toUpperCase())}</div>
          <div>
            <strong>${escapeHtml(testimonial.name)}</strong>
            ${testimonial.company ? `<div class="testimonial-meta">${escapeHtml(testimonial.company)}</div>` : ''}
          </div>
        </div>
        <p class="testimonial-text"><span>${escapeHtml(testimonial.text)}</span></p>
      `;

    // Add admin controls if pending
    if (isPending && isAdmin) {
      const controls = document.createElement('div');
      controls.className = 'admin-controls';
      controls.innerHTML = `
        <button class="admin-btn approve" data-id="${testimonial._id}">Approve</button>
        <button class="admin-btn delete" data-id="${testimonial._id}">Delete</button>
      `;
      el.appendChild(controls);
    }

    listEl.appendChild(el);
  }

  // Helper: Update admin state in UI
  function updateAdminState() {
    const adminToggle = document.getElementById('adminToggle');
    if (!adminToggle) return;
    
    adminToggle.textContent = isAdmin ? 'Admin (on)' : 'Admin';
    document.body.classList.toggle('admin-mode', isAdmin);
  }

  // Helper: Update pending count badge
  function updatePendingCount(count) {
    const adminToggle = document.getElementById('adminToggle');
    if (!adminToggle || !isAdmin) return;

    const badge = adminToggle.querySelector('.pending-badge') || document.createElement('span');
    badge.className = 'pending-badge';
    badge.textContent = count || '';
    
    if (count > 0 && !adminToggle.contains(badge)) {
      adminToggle.appendChild(badge);
    } else if (count === 0 && adminToggle.contains(badge)) {
      badge.remove();
    }
  }

  // Helper: Basic HTML escaping
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/`/g, '&#x60;');
  }
});