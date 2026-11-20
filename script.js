document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     1. MOBILE HAMBURGER MENU TOGGLE
     ============================================================ */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     2. PERSISTENT DARK / LIGHT MODE TOGGLE ACROSS ALL PAGES
     ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function applyTheme(mode) {
    const isDark = mode === 'dark';
    if (isDark) {
      document.body.classList.add('dark-theme');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeLabel) themeLabel.textContent = 'Light';
    } else {
      document.body.classList.remove('dark-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeLabel) themeLabel.textContent = 'Dark';
    }
  }

  const savedTheme = localStorage.getItem('geopulse-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
      localStorage.setItem('geopulse-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  /* ============================================================
     3. SMOOTH SCROLL REVEAL ANIMATION
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============================================================
     4. CONTACT FORM VALIDATION (ERROR & SUCCESS MESSAGES)
     ============================================================ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const serviceSelect = document.getElementById('serviceType');
    const messageInput = document.getElementById('projectMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const serviceError = document.getElementById('serviceError');
    const messageError = document.getElementById('messageError');

    const formSuccess = document.getElementById('formSuccess');
    const successText = document.getElementById('successText');
    const formGlobalError = document.getElementById('formGlobalError');

    function setFieldError(inputEl, errorEl, msg) {
      if (msg) {
        inputEl.classList.add('invalid');
        errorEl.textContent = msg;
        return false;
      } else {
        inputEl.classList.remove('invalid');
        errorEl.textContent = '';
        return true;
      }
    }

    function validateName() {
      const val = fullNameInput.value.trim();
      if (!val) return setFieldError(fullNameInput, nameError, 'Full name is required.');
      if (val.length < 3) return setFieldError(fullNameInput, nameError, 'Please enter at least 3 characters.');
      return setFieldError(fullNameInput, nameError, '');
    }

    function validateEmail() {
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) return setFieldError(emailInput, emailError, 'Email address is required.');
      if (!emailRegex.test(val)) return setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      return setFieldError(emailInput, emailError, '');
    }

    function validateService() {
      if (!serviceSelect.value) {
        return setFieldError(serviceSelect, serviceError, 'Please select a geospatial service.');
      }
      return setFieldError(serviceSelect, serviceError, '');
    }

    function validateMessage() {
      const val = messageInput.value.trim();
      if (!val) return setFieldError(messageInput, messageError, 'Project details are required.');
      if (val.length < 15) {
        return setFieldError(messageInput, messageError, 'Please write at least 15 characters describing your project.');
      }
      return setFieldError(messageInput, messageError, '');
    }

    fullNameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    serviceSelect.addEventListener('change', validateService);
    messageInput.addEventListener('input', validateMessage);

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.classList.remove('show');
      formGlobalError.classList.remove('show');

      const isNameOk = validateName();
      const isEmailOk = validateEmail();
      const isServiceOk = validateService();
      const isMessageOk = validateMessage();

      if (isNameOk && isEmailOk && isServiceOk && isMessageOk) {
        const senderName = fullNameInput.value.trim();
        const chosenService = serviceSelect.value;
        successText.textContent = `Thank you, ${senderName}! Your inquiry regarding "${chosenService}" has been validated and submitted.`;
        formSuccess.classList.add('show');
        contactForm.reset();
      } else {
        formGlobalError.classList.add('show');
      }
    });
  }

  /* ============================================================
     5. PAGE-SPECIFIC BACKGROUNDS:
        - Home: 3D Rotating Earth + Moving Satellites
        - About: Ambient Orbs + Cartographic Topographic Contours
        - Contact: Ambient Orbs + Curved Communication Arcs
     ============================================================ */
  if (!document.querySelector('.world-map-backdrop')) {
    const mapDiv = document.createElement('div');
    mapDiv.className = 'world-map-backdrop';
    mapDiv.setAttribute('aria-hidden', 'true');
    document.body.prepend(mapDiv);
  }

  let bgContainer = document.getElementById('geopulse-3d-bg');
  if (!bgContainer) {
    bgContainer = document.createElement('div');
    bgContainer.id = 'geopulse-3d-bg';
    bgContainer.className = 'orbital-bg-stage';
    bgContainer.setAttribute('aria-hidden', 'true');
    document.body.prepend(bgContainer);
  }

  if (!document.querySelector('.glass-atmosphere')) {
    const atmDiv = document.createElement('div');
    atmDiv.className = 'glass-atmosphere';
    atmDiv.setAttribute('aria-hidden', 'true');
    bgContainer.after(atmDiv);
  }

  const path = window.location.pathname.toLowerCase();
  const pageMode =
    document.body.dataset.bgMode ||
    (path.includes('about') ? 'about' : path.includes('contact') ? 'contact' : 'home');

  /* ------------------------------------------------------------
     HOME PAGE: REALISTIC 3D ROTATING EARTH + MOVING SATELLITES
     ------------------------------------------------------------ */
  function initHome3DEarth() {
    if (typeof THREE === 'undefined' || bgContainer.dataset.initialized === 'true') return;
    bgContainer.dataset.initialized = 'true';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.25, 8.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    bgContainer.appendChild(renderer.domElement);

    let scrollProgress = 0;
    window.addEventListener(
      'scroll',
      () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      },
      { passive: true }
    );

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    scene.add(new THREE.AmbientLight(0xF8FAFC, 0.78));
    const sunLight = new THREE.DirectionalLight(0xFFFDF8, 2.2);
    sunLight.position.set(5.5, 3.8, 6.8);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x93C5FD, 0.6);
    rimLight.position.set(-5.0, -2.5, 4.0);
    scene.add(rimLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    function createProceduralEarthTexture() {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 512;
      const ctx = c.getContext('2d');

      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
      oceanGrad.addColorStop(0, '#162B4D');
      oceanGrad.addColorStop(0.5, '#1D4ED8');
      oceanGrad.addColorStop(1, '#162B4D');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 1024, 512);

      ctx.fillStyle = '#3B6E52';
      const blobs = [
        [240, 175, 85, 55],
        [295, 315, 58, 82],
        [525, 165, 92, 48],
        [545, 275, 66, 85],
        [695, 185, 125, 68],
        [810, 345, 55, 42]
      ];
      blobs.forEach(([x, y, rx, ry]) => {
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      return new THREE.CanvasTexture(c);
    }

    function createSoftOrbitTrailTexture(r, g, b) {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      const rad = ctx.createRadialGradient(256, 256, 185, 256, 256, 246);
      rad.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, 0)`);
      rad.addColorStop(0.38, `rgba(${r}, ${g}, ${b}, 0.14)`);
      rad.addColorStop(0.50, `rgba(${r}, ${g}, ${b}, 0.34)`);
      rad.addColorStop(0.62, `rgba(${r}, ${g}, ${b}, 0.14)`);
      rad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(c);
    }

    function createSolarPanelTexture() {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 128;
      const ctx = c.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 256, 128);
      grad.addColorStop(0, '#162B4D');
      grad.addColorStop(0.5, '#2563EB');
      grad.addColorStop(1, '#1E3A5F');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);

      ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x <= 256; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 128); ctx.stroke();
      }
      for (let y = 0; y <= 128; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    }

    const solarTex = createSolarPanelTexture();

    function buildSatellite(foilColor, beamColor) {
      const sat = new THREE.Group();
      const foilMat = new THREE.MeshStandardMaterial({ color: foilColor, metalness: 0.80, roughness: 0.28 });
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.82, roughness: 0.24 });
      const wingMat = new THREE.MeshPhysicalMaterial({ map: solarTex, metalness: 0.50, roughness: 0.28, clearcoat: 0.65 });

      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.42, 6), foilMat);
      core.rotation.z = Math.PI / 2;
      sat.add(core);

      const sensor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.10, 0.18, 20),
        new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.5, roughness: 0.35 })
      );
      sensor.position.set(0.05, -0.16, 0);
      sat.add(sensor);

      const beam = new THREE.Mesh(
        new THREE.ConeGeometry(0.20, 0.62, 20, 1, true),
        new THREE.MeshBasicMaterial({
          color: beamColor,
          transparent: true,
          opacity: 0.14,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      beam.position.set(0.05, -0.56, 0);
      sat.add(beam);

      function makeWing(side) {
        const g = new THREE.Group();
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.24, 8), frameMat);
        strut.rotation.x = Math.PI / 2;
        strut.position.z = side * 0.26;
        g.add(strut);

        [0.52, 0.88].forEach((zOff) => {
          const panel = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.01, 0.32), wingMat);
          panel.position.z = side * zOff;
          g.add(panel);
        });
        return g;
      }

      const leftWing = makeWing(1);
      const rightWing = makeWing(-1);
      sat.add(leftWing);
      sat.add(rightWing);

      return { sat, leftWing, rightWing };
    }

    const earthGroup = new THREE.Group();
    earthGroup.position.set(1.15, 0.05, 0);
    earthGroup.rotation.z = 0.23;

    const earthMat = new THREE.MeshStandardMaterial({
      map: createProceduralEarthTexture(),
      roughness: 0.72,
      metalness: 0.06,
      bumpScale: 0.07
    });

    textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    });

    textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png', (bump) => {
      earthMat.bumpMap = bump;
      earthMat.needsUpdate = true;
    });

    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(1.85, 72, 72), earthMat);
    earthGroup.add(earthMesh);

    const cloudMat = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.55, depthWrite: false });
    textureLoader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png', (cTex) => {
      cloudMat.map = cTex;
      cloudMat.needsUpdate = true;
    });
    const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.88, 72, 72), cloudMat);
    earthGroup.add(cloudMesh);
    scene.add(earthGroup);

    const orbit1 = new THREE.Group();
    orbit1.position.set(1.15, 0.05, 0);
    orbit1.rotation.x = 0.34;
    orbit1.rotation.z = -0.32;
    scene.add(orbit1);

    const r1 = 2.60;
    const ring1 = new THREE.Mesh(
      new THREE.RingGeometry(r1 - 0.14, r1 + 0.14, 112),
      new THREE.MeshBasicMaterial({
        map: createSoftOrbitTrailTexture(200, 90, 50),
        transparent: true,
        opacity: 0.62,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    ring1.rotation.x = Math.PI / 2;
    orbit1.add(ring1);

    const sat1 = buildSatellite(0xE2C08D, 0xC85A32);
    sat1.sat.scale.set(0.54, 0.54, 0.54);
    orbit1.add(sat1.sat);

    const orbit2 = new THREE.Group();
    orbit2.position.set(0.88, 0.01, 0);
    orbit2.rotation.x = 0.42;
    orbit2.rotation.z = 0.46;
    scene.add(orbit2);

    const r2 = 2.88;
    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(r2 - 0.14, r2 + 0.14, 112),
      new THREE.MeshBasicMaterial({
        map: createSoftOrbitTrailTexture(37, 99, 235),
        transparent: true,
        opacity: 0.54,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    ring2.rotation.x = Math.PI / 2;
    orbit2.add(ring2);

    const sat2 = buildSatellite(0xCBD5E1, 0x3B82F6);
    sat2.sat.scale.set(0.50, 0.50, 0.50);
    orbit2.add(sat2.sat);

    let a1 = 0.9;
    let a2 = 3.6;

    function animateHome() {
      requestAnimationFrame(animateHome);
      earthMesh.rotation.y += 0.0019;
      cloudMesh.rotation.y += 0.0025;

      const boost = scrollProgress * Math.PI * 1.6;
      a1 += 0.0044;
      const cur1 = a1 + boost;
      sat1.sat.position.set(Math.cos(cur1) * r1, 0, Math.sin(cur1) * r1);
      sat1.sat.rotation.y = -cur1 + Math.PI / 2;
      sat1.leftWing.rotation.x = Math.sin(cur1) * 0.22;
      sat1.rightWing.rotation.x = Math.sin(cur1) * 0.22;

      a2 -= 0.0036;
      const cur2 = a2 - boost * 0.75;
      sat2.sat.position.set(Math.cos(cur2) * r2, 0, Math.sin(cur2) * r2);
      sat2.sat.rotation.y = -cur2 - Math.PI / 2;
      sat2.leftWing.rotation.x = Math.cos(cur2) * 0.22;
      sat2.rightWing.rotation.x = Math.cos(cur2) * 0.22;

      renderer.render(scene, camera);
    }
    animateHome();
  }

  /* ------------------------------------------------------------
     ABOUT & CONTACT PAGES: VISIBLE AMBIENT GLOW + SUBTLE GIS ART
     ------------------------------------------------------------ */
  function initSubtleThematicBackground(mode) {
    if (bgContainer.dataset.initialized === 'true') return;
    bgContainer.dataset.initialized = 'true';

    if (mode === 'about') {
      bgContainer.innerHTML = `
        <div class="ambient-orb orb-primary"></div>
        <div class="ambient-orb orb-secondary"></div>
        <div class="ambient-orb orb-center"></div>
        <svg class="ambient-gis-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
          <!-- Top-Right Cartographic Contour Lines -->
          <path d="M900 -40 C980 155, 1185 225, 1480 190" stroke="currentColor" stroke-width="1.8"/>
          <path d="M975 -40 C1045 120, 1225 180, 1480 145" stroke="currentColor" stroke-width="1.5"/>
          <path d="M1055 -40 C1115 85, 1265 135, 1480 100" class="accent-stroke" stroke-width="1.7" stroke-dasharray="7 6"/>
          <path d="M1140 -40 C1185 50, 1305 90, 1480 58" stroke="currentColor" stroke-width="1.3"/>
          <!-- Bottom-Left Cartographic Contour Lines -->
          <path d="M-60 610 C220 590, 385 710, 465 940" stroke="currentColor" stroke-width="1.8"/>
          <path d="M-60 675 C175 660, 320 755, 390 940" stroke="currentColor" stroke-width="1.5"/>
          <path d="M-60 740 C130 730, 255 805, 315 940" class="accent-stroke" stroke-width="1.7" stroke-dasharray="7 6"/>
          <path d="M-60 805 C85 798, 190 850, 235 940" stroke="currentColor" stroke-width="1.3"/>
        </svg>
      `;
    } else {
      bgContainer.innerHTML = `
        <div class="ambient-orb orb-primary"></div>
        <div class="ambient-orb orb-secondary"></div>
        <div class="ambient-orb orb-center"></div>
        <svg class="ambient-gis-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
          <!-- Curved Communication & Collaboration Arcs -->
          <path d="M140 220 Q 630 50, 1123 378" stroke="currentColor" stroke-width="1.8" stroke-dasharray="8 7"/>
          <path d="M210 750 Q 700 660, 1123 378" class="accent-stroke" stroke-width="1.8" stroke-dasharray="6 7"/>
          <path d="M1390 130 Q 1245 235, 1123 378" stroke="currentColor" stroke-width="1.6"/>
          <path d="M1350 760 Q 1220 560, 1123 378" stroke="currentColor" stroke-width="1.4" stroke-dasharray="5 8"/>
          <!-- Remote Client Nodes -->
          <circle cx="140" cy="220" r="5.5" fill="currentColor"/>
          <circle cx="210" cy="750" r="5.5" fill="var(--accent-copper)"/>
          <circle cx="1350" cy="760" r="4.5" fill="currentColor"/>
          <!-- Lahore Studio Destination Node -->
          <circle class="pulse-ring" cx="1123" cy="378" r="16" stroke="var(--accent-copper)" stroke-width="1.8"/>
          <circle cx="1123" cy="378" r="6" fill="var(--accent-copper)"/>
        </svg>
      `;
    }
  }

  /* ------------------------------------------------------------
     INITIALIZE PAGE BACKGROUND
     ------------------------------------------------------------ */
  if (pageMode === 'home') {
    if (typeof THREE !== 'undefined') {
      initHome3DEarth();
    } else {
      const threeScript = document.createElement('script');
      threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
      threeScript.onload = initHome3DEarth;
      document.head.appendChild(threeScript);
    }
  } else {
    initSubtleThematicBackground(pageMode);
  }
});