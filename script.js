/* ============================================================
   Shuddhi Wellness — JavaScript & GSAP Animations
   ============================================================ */

(function () {
  "use strict";

  /* ── Utility: Reduced Motion Detection ─────────────────────── */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || window.innerWidth < 769;

  /* Register GSAP plugins */
  gsap.registerPlugin(ScrollTrigger);

  /* ── Preloader ─────────────────────────────────────────────── */
  const preloader = document.getElementById("preloader");
  const preloaderFill = preloader.querySelector(".preloader-fill");
  const preloaderTagline = preloader.querySelector(".preloader-tagline");

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 20 + 5;
    if (loadProgress > 100) loadProgress = 100;
    preloaderFill.style.width = loadProgress + "%";
    if (loadProgress >= 100) {
      clearInterval(loadInterval);
    }
  }, 150);

  gsap.to(preloaderTagline, { opacity: 1, delay: 0.5, duration: 0.8 });

  window.addEventListener("load", () => {
    loadProgress = 100;
    preloaderFill.style.width = "100%";

    gsap.timeline({ delay: 0.5 })
      .to(preloader.querySelector(".preloader-inner"), {
        opacity: 0, y: -30, duration: 0.6, ease: "power2.inOut",
      })
      .to(preloader, {
        yPercent: -100, duration: 0.9, ease: "power4.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          initAllAnimations();
        },
      }, "-=0.2");
  });

  /* ── Custom Cursor ─────────────────────────────────────────── */
  if (!isMobile) {
    const cursor = document.getElementById("cursor");
    const cursorDot = cursor.querySelector(".cursor-dot");
    const cursorRing = cursor.querySelector(".cursor-ring");
    const cursorText = cursor.querySelector(".cursor-text");
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      cursorRing.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      cursorText.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* Hover states */
    document.querySelectorAll("a, button, .magnetic-btn").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
    });

    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("cursor-view");
        cursorText.textContent = el.dataset.cursor;
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-view");
        cursorText.textContent = "";
      });
    });
  }

  /* ── Magnetic Buttons ──────────────────────────────────────── */
  // Removed magnetic effect as requested.


  /* ── Navigation ────────────────────────────────────────────── */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 80);
  });

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  /* ── Hero Particles (Canvas) ───────────────────────────────── */
  function initParticles(canvasId, count) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5
          ? `rgba(236,184,65,${Math.random() * 0.4 + 0.15})`
          : `rgba(4,70,46,${Math.random() * 0.35 + 0.1})`,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    if (!prefersReducedMotion) draw();
  }

  /* ── Floating Objects Parallax ─────────────────────────────── */
  function initParallaxObjects() {
    if (isMobile || prefersReducedMotion) return;
    const objects = document.querySelectorAll(".float-obj");
    let mx = 0, my = 0;

    document.addEventListener("mousemove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function update() {
      objects.forEach((obj) => {
        const speed = parseFloat(obj.dataset.speed) || 0.02;
        const offsetX = mx * speed * 100;
        const offsetY = my * speed * 100;
        gsap.to(obj, {
          x: offsetX, y: offsetY,
          duration: 1.2, ease: "power2.out",
        });
      });
      requestAnimationFrame(update);
    }
    update();
  }

  /* ── 3D Card Tilt ──────────────────────────────────────────── */
  function initCardTilt() {
    if (isMobile || prefersReducedMotion) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const inner = card.querySelector(".event-card-inner");
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -12;
        const rotateY = (x - 0.5) * 12;
        gsap.to(inner, {
          rotateX, rotateY,
          duration: 0.4, ease: "power2.out",
          transformPerspective: 800,
        });

        /* Card glow follows cursor */
        const glow = card.querySelector(".event-card-glow");
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(200,149,50,0.18) 0%, transparent 60%)`;
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(inner, {
          rotateX: 0, rotateY: 0,
          duration: 0.6, ease: "elastic.out(1, 0.6)",
        });
      });
    });
  }

  /* ── Rotating Words ────────────────────────────────────────── */
  function initRotatingWords() {
    const wordEl = document.getElementById("rotatingWord");
    if (!wordEl) return;
    const words = ["Healing", "Wellness", "Balance", "Detox", "Journey"];
    let index = 0;

    function rotateWord() {
      index = (index + 1) % words.length;
      gsap.timeline()
        .to(wordEl, {
          opacity: 0, y: -20, filter: "blur(4px)",
          duration: 0.4, ease: "power2.in",
        })
        .call(() => { wordEl.textContent = words[index]; })
        .to(wordEl, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.5, ease: "power2.out",
        });
    }

    setInterval(rotateWord, 3000);
  }

  /* ── Testimonials ──────────────────────────────────────────── */
  function initTestimonials() {
    const data = [
      {
        text: "Shuddhi Wellness changed my life. My chronic back pain and stiffness reduced naturally with Panchakarma. Dr. Garima Sharma truly treats the root cause.",
        author: "Ritu & Amit Negi",
        role: "Spondylosis Care — Dehradun",
      },
      {
        text: "From the first consultation to complete detox, the team made us feel cared for. My digestion, energy and sleep have improved beyond expectations.",
        author: "Meera Kapoor",
        role: "Panchakarma Detox — Dehradun",
      },
      {
        text: "My allergic rhinitis and headaches are finally under control without side effects. The herbal care, diet and yoga guidance is truly holistic.",
        author: "Ananya Patel",
        role: "Allergy Care — Dehradun",
      },
      {
        text: "They didn't just treat my symptoms — they restored my health. My weight, skin and confidence are transformed. Truly a place for complete wellness.",
        author: "Rohit Malhotra",
        role: "Weight & Skin Care — Dehradun",
      },
    ];

    const textEl = document.getElementById("testimonialText");
    const authorEl = document.getElementById("testimonialAuthor");
    const roleEl = document.getElementById("testimonialRole");
    const progressFill = document.getElementById("testimonialProgressFill");
    const btns = document.querySelectorAll(".testimonial-btn");
    let currentIdx = 0;

    function showTestimonial(idx) {
      if (idx === currentIdx && idx !== 0) return;
      currentIdx = idx;

      const tl = gsap.timeline();
      tl.to([textEl, authorEl, roleEl], {
        opacity: 0, y: -15, duration: 0.3, ease: "power2.in", stagger: 0.05,
      })
        .call(() => {
          textEl.textContent = data[idx].text;
          authorEl.textContent = data[idx].author;
          roleEl.textContent = data[idx].role;
        })
        .fromTo([textEl, authorEl, roleEl],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }
        );

      btns.forEach((b, i) => b.classList.toggle("active", i === idx));
      progressFill.style.transform = `translateX(${idx * 100}%)`;
    }

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        showTestimonial(parseInt(btn.dataset.index));
      });
    });

    /* Auto-rotate */
    let autoTimer = setInterval(() => {
      showTestimonial((currentIdx + 1) % data.length);
    }, 6000);

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
          showTestimonial((currentIdx + 1) % data.length);
        }, 6000);
      });
    });
  }

  /* ── Back to Top ───────────────────────────────────────────── */
  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ── Smooth Anchor Scrolling ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ============================================================
     MAIN INIT — Called after preloader completes
     ============================================================ */
  function initAllAnimations() {
    initParticles("ctaParticles", isMobile ? 20 : 50);
    initCardTilt();
    initTestimonials();
    initHeroSlider();
    initBlogCarousel();

    if (prefersReducedMotion) {
      /* Show everything instantly */
      gsap.set(".hero-tagline-wrap, .hero-title-main, .hero-title-script, .hero-ornament-divider, .hero-subtext, .hero-btn-group, .hero-service-dock, .about-section, .about-feature-item, .about-img-wrap, .journey-stage, .why-card, .stat, .contact-form-card, .contact-side, .contact-field, .insta-embed-card", {
        opacity: 1, filter: "none", transform: "none",
      });
      return;
    }

    animateHero();
    animateAbout();
    animateDoctor();
    animateJourney();
    animateEvents();
    animateWhy();
    animatePortfolio();
    animateTestimonials();
    animateStats();
    animateBlog();
    animateFinalCta();
    animateContact();
    animateInsta();
  }

  /* ── Hero Slider Interaction ───────────────────────────────── */
  function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide-content");
    const backgrounds = document.querySelectorAll(".hero-bg-media");
    const dots = document.querySelectorAll(".hero-slider-dots .h-dot");
    const prevBtn = document.querySelector(".hero-arrow-left");
    const nextBtn = document.querySelector(".hero-arrow-right");
    const heroSection = document.getElementById("hero");
    if (!slides.length) return;

    let currentSlide = 0;
    let autoSlideTimer = null;

    function setSlide(idx, animateText = true) {
      const prevIdx = currentSlide;
      currentSlide = (idx + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        const isActive = i === currentSlide;
        slide.classList.toggle("active", isActive);

        if (isActive && animateText && typeof gsap !== "undefined" && !prefersReducedMotion && prevIdx !== currentSlide) {
          const textItems = slide.querySelectorAll(".hero-tagline-wrap, .hero-title-main, .hero-title-script, .hero-ornament-divider, .hero-subtext, .hero-btn-group");
          gsap.fromTo(textItems,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
          );
        }
      });

      backgrounds.forEach((background, i) => {
        background.classList.toggle("active", i === currentSlide);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
      });
    }

    function nextSlide() {
      setSlide(currentSlide + 1);
    }

    function prevSlide() {
      setSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 7000);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        setSlide(i);
        startAutoSlide();
      });
    });

    /* Touch Swipe Support */
    if (heroSection) {
      let touchStartX = 0;
      let touchEndX = 0;

      heroSection.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSection.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoSlide();
        }
      }, { passive: true });

      heroSection.addEventListener("mouseenter", stopAutoSlide);
      heroSection.addEventListener("mouseleave", startAutoSlide);
    }

    startAutoSlide();
  }

  /* ── HERO Animations ───────────────────────────────────────── */
  function animateHero() {
    const heroTL = gsap.timeline({ delay: 0.2 });

    /* Tagline */
    heroTL.fromTo(".hero-tagline-wrap",
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
    );

    /* Main Title & Script */
    heroTL.fromTo(".hero-title-main",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    heroTL.fromTo(".hero-title-script",
      { opacity: 0, scale: 0.95, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power2.out" },
      "-=0.5"
    );

    /* Ornament divider & Subtext */
    heroTL.fromTo(".hero-ornament-divider",
      { opacity: 0, scaleX: 0.7 },
      { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    heroTL.fromTo(".hero-subtext",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.4"
    );

    /* Buttons */
    heroTL.fromTo(".hero-btn-group",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.4"
    );

    /* Floating service bar dock entrance */
    heroTL.fromTo(".hero-service-dock",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      "-=0.5"
    );

    heroTL.fromTo(".dock-item",
      { opacity: 0, y: 15, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
      "-=0.6"
    );
  }

  /* ── ABOUT Animations ──────────────────────────────────────── */
  function animateAbout() {
    gsap.from(".about-top-badge, .about-subtitle", {
      scrollTrigger: { trigger: ".about-section", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out"
    });
    gsap.from(".about-heading-main, .about-heading-script", {
      scrollTrigger: { trigger: ".about-section", start: "top 78%" },
      opacity: 0, y: 25, duration: 0.8, stagger: 0.15, ease: "power3.out"
    });
    gsap.from(".about-ornament-divider, .about-desc", {
      scrollTrigger: { trigger: ".about-section", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.7, stagger: 0.15, ease: "power2.out"
    });
    gsap.from(".about-feature-item", {
      scrollTrigger: { trigger: ".about-section", start: "top 72%" },
      opacity: 0, y: 20, duration: 0.6, stagger: 0.12, ease: "power2.out"
    });
    gsap.from(".about-cta-wrap", {
      scrollTrigger: { trigger: ".about-section", start: "top 70%" },
      opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.7)"
    });
    gsap.from(".about-img-wrap", {
      scrollTrigger: { trigger: ".about-section", start: "top 75%" },
      opacity: 0, x: 40, duration: 1, ease: "power3.out"
    });
    gsap.from(".about-left-flower-overlay", {
      scrollTrigger: { trigger: ".about-section", start: "top 85%" },
      opacity: 0, x: -30, duration: 1.2, ease: "power2.out"
    });
  }

  /* ── DOCTOR Animations ─────────────────────────────────────── */
  function animateDoctor() {
    gsap.from(".doctor-photo-frame", {
      scrollTrigger: { trigger: ".doctor-section", start: "top 75%" },
      opacity: 0, x: -50, scale: 0.95, duration: 1, ease: "power3.out"
    });
    gsap.from(".doctor-eyebrow, .doctor-heading-small, .doctor-heading-name", {
      scrollTrigger: { trigger: ".doctor-section", start: "top 72%" },
      opacity: 0, y: 25, duration: 0.8, stagger: 0.12, ease: "power3.out"
    });
    gsap.from(".doctor-heading-role, .doctor-desc, .doctor-desc-light", {
      scrollTrigger: { trigger: ".doctor-section", start: "top 68%" },
      opacity: 0, y: 20, duration: 0.7, stagger: 0.12, ease: "power2.out"
    });
    gsap.from(".doctor-point, .doctor-tag", {
      scrollTrigger: { trigger: ".doctor-section", start: "top 62%" },
      opacity: 0, y: 24, duration: 0.55, stagger: 0.09, ease: "power2.out"
    });
    gsap.from(".doctor-point-icon", {
      scrollTrigger: { trigger: ".doctor-section", start: "top 62%" },
      scale: 0.5, rotate: -15, opacity: 0, duration: 0.5, stagger: 0.09, ease: "back.out(2)",
      delay: 0.1
    });
    gsap.from(".doctor-actions", {
      scrollTrigger: { trigger: ".doctor-section", start: "top 58%" },
      opacity: 0, scale: 0.92, duration: 0.6, ease: "back.out(1.6)"
    });
  }

  /* ── JOURNEY Animations ────────────────────────────────────── */
  function animateJourney() {
    /* Section header */
    gsap.from(".journey .section-tag", {
      scrollTrigger: { trigger: ".journey", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".journey .section-title", {
      scrollTrigger: { trigger: ".journey", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });
    gsap.from(".journey .section-desc", {
      scrollTrigger: { trigger: ".journey", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.25,
    });

    /* Timeline line fill */
    gsap.to("#journeyLineFill", {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".journey-timeline",
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1,
      },
    });

    /* Each stage */
    document.querySelectorAll(".journey-stage").forEach((stage, i) => {
      const isOdd = i % 2 === 0;
      gsap.to(stage, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stage,
          start: "top 80%",
        },
      });

      const card = stage.querySelector(".journey-card");
      gsap.from(card, {
        x: isOdd ? -60 : 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stage,
          start: "top 75%",
        },
      });
    });
  }

  /* ── EVENTS Animations ─────────────────────────────────────── */
  function animateEvents() {
    /* Section header */
    gsap.from(".events .section-tag", {
      scrollTrigger: { trigger: ".events", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".events .section-title", {
      scrollTrigger: { trigger: ".events", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });
    gsap.from(".events .section-desc", {
      scrollTrigger: { trigger: ".events", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.25,
    });

    /* Staggered card reveal */
    gsap.from(".svc-item", {
      scrollTrigger: {
        trigger: ".events-grid",
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
    });
  }

  /* ── WHY Animations ────────────────────────────────────────── */
  function animateWhy() {
    gsap.from(".why-eyebrow", {
      scrollTrigger: { trigger: ".why", start: "top 75%" },
      opacity: 0, y: 16,
      duration: 0.6, ease: "power3.out",
    });

    gsap.from(".why-title", {
      scrollTrigger: { trigger: ".why", start: "top 75%" },
      opacity: 0, y: 24,
      duration: 0.8, delay: 0.1, ease: "power3.out",
    });

    gsap.from(".why-desc", {
      scrollTrigger: { trigger: ".why", start: "top 74%" },
      opacity: 0, y: 18,
      duration: 0.7, delay: 0.18, ease: "power3.out",
    });

    gsap.from(".why-card", {
      scrollTrigger: { trigger: ".why-grid", start: "top 85%" },
      opacity: 0, y: 22,
      duration: 0.6, stagger: 0.08, delay: 0.1, ease: "power3.out",
    });

    gsap.from(".why-cta", {
      scrollTrigger: { trigger: ".why-cta", start: "top 92%" },
      opacity: 0, y: 18,
      duration: 0.6, ease: "power3.out",
    });
  }

  /* ── PORTFOLIO Animations ──────────────────────────────────── */
  function animatePortfolio() {
    /* Section header */
    gsap.from(".portfolio .section-tag", {
      scrollTrigger: { trigger: ".portfolio", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".portfolio .section-title", {
      scrollTrigger: { trigger: ".portfolio", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });
    gsap.from(".portfolio .section-desc", {
      scrollTrigger: { trigger: ".portfolio", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.25,
    });

    /* Image reveal with clip-path */
    document.querySelectorAll(".portfolio-item").forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
        },
        clipPath: "inset(100% 0% 0% 0%)",
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
        delay: i * 0.08,
      });

      /* Parallax on scroll */
      gsap.to(item.querySelector(".portfolio-img"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
  }

  /* ── TESTIMONIALS Animations ───────────────────────────────── */
  function animateTestimonials() {
    gsap.from(".testimonials .section-tag", {
      scrollTrigger: { trigger: ".testimonials", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".testimonials .section-title", {
      scrollTrigger: { trigger: ".testimonials", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });

    gsap.from(".testimonial-quote-mark", {
      scrollTrigger: { trigger: ".testimonials-container", start: "top 80%" },
      opacity: 0, scale: 0.5, duration: 0.8, ease: "power3.out",
    });

    gsap.from(".testimonial-text", {
      scrollTrigger: { trigger: ".testimonials-container", start: "top 75%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.2,
    });
  }

  /* ── BLOG Animations ─────────────────────────────────────────── */
  /* ── Blog Carousel ─────────────────────────────────────────── */
  function initBlogCarousel() {
    const track = document.getElementById("blogTrack");
    const dotsWrap = document.getElementById("blogDots");
    const prevBtn = document.getElementById("blogPrev");
    const nextBtn = document.getElementById("blogNext");
    const carousel = document.querySelector(".blog-carousel");
    if (!track || !carousel) return;

    const cards = Array.from(track.children);
    function trackGap() {
      const g = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap);
      return isNaN(g) ? 28 : g;
    }
    let index = 0;
    let autoTimer = null;

    function perView() {
      const w = window.innerWidth;
      if (w <= 680) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, cards.length - perView());
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (let i = 0; i <= maxIndex(); i++) {
        const d = document.createElement("button");
        d.className = "blog-dot-nav" + (i === index ? " active" : "");
        d.setAttribute("aria-label", "Go to slide " + (i + 1));
        d.addEventListener("click", () => {
          goTo(i);
          restartAuto();
        });
        dotsWrap.appendChild(d);
      }
    }

    function update() {
      const pv = perView();
      const card = cards[0];
      if (!card) return;
      const cardW = card.getBoundingClientRect().width;
      const x = index * (cardW + trackGap());
      track.style.transform = "translateX(" + -x + "px)";
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((d, i) => {
          d.classList.toggle("active", i === index);
        });
      }
    }

    function goTo(i) {
      const m = maxIndex();
      index = ((i % (m + 1)) + (m + 1)) % (m + 1);
      update();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    function startAuto() {
      stopAuto();
      if (prefersReducedMotion) return;
      autoTimer = setInterval(next, 5000);
    }

    function restartAuto() { startAuto(); }

    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restartAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { next(); restartAuto(); });

    /* Touch swipe */
    let startX = 0;
    let endX = 0;
    track.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].screenX;
      const diff = startX - endX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) next(); else prev();
        restartAuto();
      }
    }, { passive: true });

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);

    window.addEventListener("resize", () => {
      if (index > maxIndex()) index = maxIndex();
      buildDots();
      update();
    });

    buildDots();
    update();
    startAuto();
  }

  function animateBlog() {
    gsap.from(".blog .section-tag", {
      scrollTrigger: { trigger: ".blog", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".blog .section-title", {
      scrollTrigger: { trigger: ".blog", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });
    gsap.from(".blog .section-desc", {
      scrollTrigger: { trigger: ".blog", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.25,
    });

    gsap.from(".blog-card", {
      scrollTrigger: {
        trigger: ".blog-track",
        start: "top 85%",
      },
      opacity: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "transform",
    });

    gsap.from(".blog-cta-wrap", {
      scrollTrigger: { trigger: ".blog-cta-wrap", start: "top 90%" },
      opacity: 0, y: 20, duration: 0.6, ease: "power2.out",
    });
  }

  /* ── STATS Animations ──────────────────────────────────────── */
  function animateStats() {
    document.querySelectorAll(".stat").forEach((stat, i) => {
      const countEl = stat.querySelector(".stat-count");
      const target = parseInt(stat.dataset.target);

      gsap.from(stat, {
        scrollTrigger: { trigger: ".stats-inner", start: "top 80%" },
        opacity: 0, y: 40,
        duration: 0.8, delay: i * 0.15, ease: "power2.out",
      });

      ScrollTrigger.create({
        trigger: stat,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              countEl.textContent = Math.floor(this.targets()[0].val);
            },
          });
        },
      });
    });
  }

  /* ── FINAL CTA Animations ──────────────────────────────────── */
  function animateFinalCta() {
    gsap.from(".fct-line", {
      scrollTrigger: { trigger: ".final-cta", start: "top 70%" },
      opacity: 0, y: 40,
      duration: 0.8, stagger: 0.15, ease: "power3.out",
    });

    gsap.from(".final-cta-sub", {
      scrollTrigger: { trigger: ".final-cta", start: "top 65%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.3,
    });

    gsap.from("#finalCtaBtn", {
      scrollTrigger: { trigger: ".final-cta", start: "top 60%" },
      opacity: 0, y: 20, scale: 0.95, duration: 0.8, delay: 0.45, ease: "power2.out",
    });

    /* Footer animations */
    gsap.from(".footer-divider", {
      scrollTrigger: { trigger: ".footer-divider", start: "top 90%" },
      opacity: 0, scaleX: 0,
      duration: 0.8, ease: "power2.out",
    });

    gsap.from(".footer-brand, .footer-col", {
      scrollTrigger: { trigger: ".footer-inner", start: "top 90%" },
      opacity: 0, y: 20,
      duration: 0.6, stagger: 0.1, ease: "power2.out",
    });
  }

  /* ── CONTACT (form + quote above map) Animations ───────────── */
  function animateContact() {
    gsap.from(".contact-form-card", {
      scrollTrigger: { trigger: ".contact-wrap", start: "top 80%" },
      opacity: 0, x: -40,
      duration: 0.9, ease: "power3.out",
    });
    gsap.from(".contact-side", {
      scrollTrigger: { trigger: ".contact-wrap", start: "top 80%" },
      opacity: 0, x: 40,
      duration: 0.9, delay: 0.12, ease: "power3.out",
    });
    gsap.from(".contact-field", {
      scrollTrigger: { trigger: ".contact-form", start: "top 85%" },
      opacity: 0, y: 18,
      duration: 0.55, stagger: 0.07, ease: "power2.out",
    });
  }

  /* ── INSTAGRAM FEED Animations ─────────────────────────────── */
  function animateInsta() {
    gsap.from(".insta .section-tag", {
      scrollTrigger: { trigger: ".insta", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".insta .section-title", {
      scrollTrigger: { trigger: ".insta", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });
    gsap.from(".insta-controls-wrap", {
      scrollTrigger: { trigger: ".insta", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.2,
    });
    gsap.from(".insta-embed-card", {
      scrollTrigger: { trigger: "#instaViewport", start: "top 85%" },
      opacity: 0, y: 35,
      duration: 0.7, stagger: 0.08, ease: "power3.out",
    });
    gsap.from(".insta-actions", {
      scrollTrigger: { trigger: ".insta-actions", start: "top 92%" },
      opacity: 0, y: 18, duration: 0.6, ease: "power3.out",
    });
  }

  /* ── Instagram Section (1-Line Slider + Grid View + Embeds) ─── */
  function initInstagram() {
    const viewport = document.getElementById("instaViewport");
    const track = document.getElementById("instaTrack");
    const btnSlider = document.getElementById("instaViewSlider");
    const btnGrid = document.getElementById("instaViewGrid");
    const btnPrev = document.getElementById("instaPrev");
    const btnNext = document.getElementById("instaNext");
    const counter = document.getElementById("instaSliderCounter");
    const navArrows = document.getElementById("instaNavArrows");
    if (!viewport || !track) return;

    // View switcher: 1-Line Slider vs Grid
    if (btnSlider && btnGrid) {
      btnSlider.addEventListener("click", () => {
        viewport.classList.remove("mode-grid");
        viewport.classList.add("mode-slider");
        btnSlider.classList.add("active");
        btnSlider.setAttribute("aria-selected", "true");
        btnGrid.classList.remove("active");
        btnGrid.setAttribute("aria-selected", "false");
        if (navArrows) navArrows.style.display = "inline-flex";
        updateSlider();
        processInstagramEmbeds();
      });

      btnGrid.addEventListener("click", () => {
        viewport.classList.remove("mode-slider");
        viewport.classList.add("mode-grid");
        btnGrid.classList.add("active");
        btnGrid.setAttribute("aria-selected", "true");
        btnSlider.classList.remove("active");
        btnSlider.setAttribute("aria-selected", "false");
        if (navArrows) navArrows.style.display = "none";
        processInstagramEmbeds();
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      });
    }

    // Slider navigation
    function getCardWidth() {
      const firstCard = track.querySelector(".insta-embed-card");
      if (!firstCard) return 320;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
      return firstCard.offsetWidth + gap;
    }

    function updateSlider() {
      if (!viewport.classList.contains("mode-slider")) return;
      const scrollLeft = viewport.scrollLeft;
      const cardWidth = getCardWidth();
      const cardsPerView = Math.max(1, Math.round(viewport.offsetWidth / cardWidth));
      const totalCards = track.querySelectorAll(".insta-embed-card").length;
      const totalPages = Math.max(1, Math.ceil(totalCards / cardsPerView));
      const currentPage = Math.min(totalPages, Math.max(1, Math.round(scrollLeft / (cardWidth * cardsPerView)) + 1));
      if (counter) counter.textContent = `${currentPage} / ${totalPages}`;
      if (btnPrev) btnPrev.style.opacity = scrollLeft <= 10 ? "0.45" : "1";
      if (btnNext) btnNext.style.opacity = scrollLeft >= (viewport.scrollWidth - viewport.clientWidth - 10) ? "0.45" : "1";
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        const scrollAmount = viewport.offsetWidth * 0.85;
        viewport.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        const scrollAmount = viewport.offsetWidth * 0.85;
        viewport.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
    }

    viewport.addEventListener("scroll", () => {
      requestAnimationFrame(updateSlider);
    }, { passive: true });

    window.addEventListener("resize", () => {
      requestAnimationFrame(updateSlider);
    });

    // Process Instagram embeds via official embed.js
    function processInstagramEmbeds() {
      if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function") {
        window.instgrm.Embeds.process();
      }
    }

    // Call process on load & after delay to ensure script has executed
    processInstagramEmbeds();
    setTimeout(processInstagramEmbeds, 600);
    setTimeout(processInstagramEmbeds, 2000);
    updateSlider();
  }
  initInstagram();


  /* ── Floating Contact Menu (Doctor avatar toggle) ─────────── */
  const nxqFloatMenu = document.querySelector(".nxq-float-menu");
  const nxqDoctorToggle = document.getElementById("nxqDoctorToggle");
  if (nxqFloatMenu && nxqDoctorToggle) {
    nxqDoctorToggle.addEventListener("click", () => {
      nxqFloatMenu.classList.toggle("closed");
    });
  }

  /* ── Contact form (validation + success) ─────────────────── */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const successEl = document.getElementById("contactSuccess");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameEl = document.getElementById("cfName");
      const phoneEl = document.getElementById("cfPhone");
      const concernEl = document.getElementById("cfConcern");
      let valid = true;

      [nameEl, phoneEl, concernEl].forEach((el) => {
        if (!el) return;
        const empty = !el.value || !el.value.trim();
        const phoneBad = el === phoneEl && !empty && !/^[0-9+() \-]{8,16}$/.test(el.value.trim());
        el.classList.toggle("error", empty || phoneBad);
        if (empty || phoneBad) valid = false;
      });

      if (!valid) {
        const firstErr = contactForm.querySelector(".error");
        if (firstErr) firstErr.focus();
        return;
      }

      if (successEl) {
        successEl.hidden = false;
        if (typeof gsap !== "undefined") {
          gsap.fromTo(successEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        }
        successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      contactForm.reset();
      setTimeout(() => { if (successEl) successEl.hidden = true; }, 8000);
    });

    /* Clear error state while typing */
    contactForm.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("error"));
      el.addEventListener("change", () => el.classList.remove("error"));
    });
  }

  /* ── Map pin card (close button) ─────────────────────────── */
  const mapPinCard = document.getElementById("mapPinCard");
  const mapPinClose = document.getElementById("mapPinClose");
  if (mapPinCard && mapPinClose) {
    mapPinClose.addEventListener("click", () => {
      mapPinCard.classList.add("hidden");
    });
  }

  /* ── Window Resize Handler ─────────────────────────────────── */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

})();
