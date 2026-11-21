document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
     🎞 Carrusel automático
  ========================================== */
  const banners = document.querySelectorAll(".banner-img");
  let currentBanner = 0;

  if (banners.length > 0) {
    setInterval(() => {
      banners[currentBanner].classList.remove("visible");
      currentBanner = (currentBanner + 1) % banners.length;
      banners[currentBanner].classList.add("visible");
    }, 3500);
  }

  /* ==========================================
     📱 Menú hamburguesa (toggle en móviles)
  ========================================== */
  const menuToggle = document.getElementById("menuToggle");
  const menuNav = document.getElementById("menuNav");

  if (menuToggle && menuNav) {
    menuToggle.addEventListener("click", () => {
      menuNav.classList.toggle("show");
      menuToggle.classList.toggle("active"); // animación de hamburguesa
    });
  }

  /* ==========================================
     📂 Submenús en móviles (ej: Productos)
     - Un clic: abre/cierra submenú
     - Doble clic: sigue el enlace
  ========================================== */
  const subMenuLinks = document.querySelectorAll(".dropdown > a");
  let clickTimer = null;

  subMenuLinks.forEach((link) => {
    const submenu = link.nextElementSibling; // el <ul> del submenú

    if (!submenu) return;

    link.addEventListener("click", (e) => {
      if (window.innerWidth > 768) return; // solo móviles/tablets

      e.preventDefault();

      if (clickTimer) {
        // Doble clic → redirigir
        clearTimeout(clickTimer);
        clickTimer = null;
        window.location.href = link.getAttribute("href");
      } else {
        // Primer clic → abrir/cerrar submenú
        clickTimer = setTimeout(() => {
          submenu.classList.toggle("show");
          clickTimer = null;
        }, 250); // tiempo para detectar doble clic
      }
    });
  });

  /* ==========================================
     🔄 Cerrar submenú al hacer clic fuera
  ========================================== */
  document.addEventListener("click", (e) => {
    if (window.innerWidth > 768) return;

    subMenuLinks.forEach((link) => {
      const submenu = link.nextElementSibling;
      if (submenu && submenu.classList.contains("show")) {
        if (!submenu.contains(e.target) && !link.contains(e.target)) {
          submenu.classList.remove("show");
        }
      }
    });
  });
});