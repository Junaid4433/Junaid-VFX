/* C:\Users\Junaid\.gemini\antigravity\scratch\3d-portfolio\js\main.js */
import { gsap } from 'gsap';

// Project Database for Modals
const projectData = {
  outpost: {
    title: 'Abandoned Outpost',
    subtitle: 'Live-Action VFX Integration',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    video: 'assets/outpost.mp4',
    breakdown: 'assets/playblast out main.mp4',
    tags: ['Maya', 'Matchmoving', 'VFX', 'Compositing', 'After Effects'],
    description: 'A seamless integration of 3D elements into a live-action plate. Features precise camera tracking and matchmoving to lock digital assets into a handheld environment, finalized with realistic lighting matches, depth of field, and cinematic compositing in After Effects.',
    features: [
      'High-precision 3D camera tracking of handheld camera motion with sub-pixel alignment.',
      'Custom lighting setup matched to the original high-dynamic-range (HDR) background plate.',
      'Deep compositing in After Effects including accurate depth map extraction and atmospheric effects.',
      'Seamless integration of distressed 3D elements with shadows, reflections, and contact occlusion.'
    ]
  },
  drone: {
    title: 'Urban Drone Integration',
    subtitle: '3D Tracking & Compositing Pipeline',
    img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop',
    video: 'assets/drone.mp4',
    breakdown: 'assets/drone-breakdown.mp4',
    tags: ['Maya', 'Matchmoving', 'VFX', 'Compositing', 'After Effects'],
    description: 'A complex visual effects integration utilizing a multi-software pipeline. Features precise live-action camera tracking, 3D scene blocking and lighting setup in Maya, multi-pass AOV rendering, and final cinematic compositing and grading in After Effects.',
    features: [
      'High-precision 3D tracking and reconstruction of complex urban drone camera movement.',
      'Advanced lighting integration matching shadow direction, color temperature, and contact occlusions.',
      'Multi-pass AOV rendering (diffuse, specular, refraction, shadow, Z-depth) out of Maya.',
      'Final compositing, color matching, grain integration, and color grading in After Effects.'
    ]
  },
  corridor: {
    title: 'Sci-Fi Corridor VFX Integration',
    subtitle: '3D Asset Integration & Digital Compositing',
    img: 'https://images.unsplash.com/photo-1615653051968-070ddce4c164?q=80&w=800&auto=format&fit=crop',
    video: 'assets/corridor_vfx_render_final.mp4',
    breakdown: 'assets/corridor_breakdown.mp4',
    tags: ['Maya', 'After Effects', 'VFX', 'Compositing'],
    description: 'A live-action visual effects shot set in a corridor, featuring integrated 3D elements—including overhead piping fixtures and decorative wall props—paired with heavy digital distortion, RGB displacement, static grain, and glitch transition effects. The sequence moves from a stable environment shot into a high-intensity distortion breakdown before fading out.',
    features: [
      'Extracted camera tracking data in After Effects to align 3D assets with the live-action hallway movement.',
      'Integrated custom 3D pipe structures and wall-mounted props modeled and lit in Maya into the plate.',
      'Applied custom glitch animations, chromatic aberration, wave distortion, and digital noise passes in After Effects for the transition sequence.'
    ]
  },
  alienPlanet: {
    title: 'Off-Grid Alien Planet Integration',
    subtitle: '3D Environment Modeling & Live-Action VFX Integration',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    video: 'assets/Off_Grid_Alien_Planet.mp4',
    breakdown: 'assets/Off_Grid_Alien_Planet_breakdown.mp4',
    tags: ['Maya', 'Matchmoving', 'VFX', 'Compositing', 'After Effects'],
    description: 'A cinematic visual effects shot depicting an astronaut exploring a rugged alien landscape featuring a derailed metallic train. The sequence tracks a live-action subject keyed and composited into a fully modeled 3D environment, featuring realistic space lighting, atmospheric particle effects, and anamorphic lens flares.',
    features: [
      'Solved 3D camera tracking and keying to lock the live-action actor into the digital environment.',
      'Built and textured a full 3D sci-fi landscape in Maya, including rocky terrain, mountains, and a derailed train asset.',
      'Matched directional key lighting, contact shadows, and environmental reflections across the suit and visor.',
      'Composited anamorphic lens flares, dust particles, and atmospheric depth passes in After Effects.'
    ]
  },
  triceratops: {
    title: 'Prehistoric Intrusion: Skeletal Triceratops VFX Breakdown',
    subtitle: 'VFX Artist & 3D Generalist',
    img: 'https://images.unsplash.com/photo-1549884570-5b128c704f0d?q=80&w=800&auto=format&fit=crop',
    video: 'assets/triceratops_vfx_shot_main.mp4',
    breakdown: 'assets/triceratops_vfx_breakdown.mp4',
    tags: ['Maya', 'After Effects', 'Matchmoving', '3D Animation', 'Compositing', 'VFX'],
    description: 'A seamless VFX shot featuring a walking skeletal Triceratops traversing an ancient stone ruin environment. The project showcases advanced camera tracking, 3D character animation, environment lighting, and rigorous digital compositing to blend the CGI creature seamlessly into the live-action plate.',
    features: [
      'Accurate camera and perspective tracking executed in After Effects.',
      'Detailed 3D modeling, skeletal rigging, and scene lighting built and rendered in Maya.',
      'Polished multi-pass digital compositing integrating realistic shadows, ground interaction, and dust elements in After Effects.'
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();
  setupScrollEffects();
  setupProjectModals();
  setupContactForm();
  setupNavigationHighlighting();
  setupProjectVideoPreviews();
  setupMobileMenu();
});

// 1. Scroll Reveal Animation with IntersectionObserver
function setupScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
}

// 2. GSAP Hero Entrance Animations
function setupScrollEffects() {
  gsap.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 1, ease: 'power4.out', delay: 0.2 });
  gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1.2, ease: 'power4.out', delay: 0.35 });
  gsap.from('.hero-description', { opacity: 0, y: 25, duration: 1, ease: 'power4.out', delay: 0.55 });
  gsap.from('.hero-cta-row', { opacity: 0, y: 20, duration: 1, ease: 'power4.out', delay: 0.7 });
  gsap.from('.hero-stats', { opacity: 0, y: 20, duration: 1, ease: 'power4.out', delay: 0.85 });
  gsap.from('.hero-profile-card', { opacity: 0, x: 40, duration: 1.2, ease: 'power4.out', delay: 0.4 });
}

// 3. Project Detail Modals
function setupProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body-content');

  if (!modal || !modalClose || !modalBody) return;

  const openTriggers = document.querySelectorAll('[data-open-modal]');
  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = trigger.getAttribute('data-open-modal');
      const data = projectData[projectKey];

      if (data) {
        modalBody.innerHTML = `
          <h2 style="font-family: var(--font-heading); font-size: 1.9rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 0.4rem;">${data.title}</h2>
          <h4 style="font-family: var(--font-heading); color: var(--accent-orange); text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; margin-bottom: 1.25rem;">${data.subtitle}</h4>

          <div style="position: relative; width: 100%;">
            ${data.breakdown ? `
              <div id="modal-breakdown-badge" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 92, 0, 0.2); border: 1px solid var(--accent-orange); color: #fff; padding: 0.4rem 0.8rem; border-radius: 30px; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; z-index: 10; display: flex; align-items: center; gap: 0.25rem; cursor: pointer; transition: all 0.2s ease;">
                <span>Breakdown Below</span> <span class="badge-arrow" style="font-size: 0.85rem; display: inline-block;">&darr;</span>
              </div>
            ` : ''}

            ${data.video ? `
              <video autoplay loop muted playsinline controls style="width: 100%; max-height: 350px; border-radius: 14px; margin-bottom: 0.5rem; display: block; object-fit: cover;">
                <source src="${data.video}" type="video/mp4">
              </video>
            ` : `
              <img src="${data.img}" alt="${data.title}" style="display: block; width: 100%; max-height: 350px; border-radius: 14px; object-fit: cover; margin-bottom: 0.5rem;">
            `}
          </div>

          <div class="modal-tech-stack">
            ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>

          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.75; margin-bottom: 1.25rem;">${data.description}</p>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-family: var(--font-heading); font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.75rem;">Key Highlights</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; color: var(--text-muted); font-size: 0.92rem;">
              ${data.features.map(f => `<li style="position: relative; padding-left: 1.5rem;"><span style="position: absolute; left: 0; color: var(--accent-orange);">&#9670;</span>${f}</li>`).join('')}
            </ul>
          </div>

          ${data.breakdown ? `
            <div id="modal-breakdown-section" style="margin-top: 1.5rem; border-top: 1px solid #1e1e1e; padding-top: 1.5rem;">
              <h4 style="font-family: var(--font-heading); color: var(--accent-orange); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 2px; font-size: 0.78rem;">VFX Breakdown</h4>
              <video loop muted playsinline controls style="width: 100%; max-height: 350px; border-radius: 14px; object-fit: cover; display: block;">
                <source src="${data.breakdown}" type="video/mp4">
              </video>
            </div>
          ` : ''}
        `;

        modal.classList.add('active');

        const breakdownBadge = modal.querySelector('#modal-breakdown-badge');
        const breakdownSec = modal.querySelector('#modal-breakdown-section');
        if (breakdownBadge && breakdownSec) {
          breakdownBadge.addEventListener('click', () => {
            breakdownSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }

        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModalFunc = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalClose.addEventListener('click', closeModalFunc);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFunc(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModalFunc(); });
}

// 4. Contact Form
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (res.ok && json.success) { showToast(name, false); form.reset(); }
      else { showToast(name, true); }
    } catch (err) {
      showToast(name, true);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showToast(name, isError = false) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
    background: #111; border-left: 3px solid ${isError ? '#ff5c00' : '#00d4ff'};
    border-radius: 12px; padding: 1.25rem 1.75rem;
    opacity: 0; transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    font-family: var(--font-body); min-width: 280px;
  `;
  toast.innerHTML = isError
    ? `<h4 style="font-family: var(--font-heading); color: var(--accent-orange); margin-bottom: 0.2rem; font-size: 0.95rem;">Transmission Failed</h4><p style="font-size: 0.85rem; color: var(--text-muted);">Sorry ${name}, there was an issue. Please try again.</p>`
    : `<h4 style="font-family: var(--font-heading); color: #00d4ff; margin-bottom: 0.2rem; font-size: 0.95rem;">Message Sent!</h4><p style="font-size: 0.85rem; color: var(--text-muted);">Thanks, ${name}! I'll get back to you soon.</p>`;

  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 100);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

// 5. Navigation Highlighting on Scroll
function setupNavigationHighlighting() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - section.clientHeight / 2.5) {
        currentSectionId = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) link.classList.add('active');
    });
  });
}

// 6. Video Preview on Hover
function setupProjectVideoPreviews() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const video = card.querySelector('.project-video-preview');
    if (!video) return;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

// 7. Mobile Navigation Drawer
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileNavOverlay) return;

  const toggleMenu = () => {
    const isOpen = mobileMenuBtn.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  mobileMenuBtn.addEventListener('click', toggleMenu);
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}
