// Menú del icono de usuario: distingue clientes de administración.
const usuarioToggle = document.getElementById('usuarioToggle');
const menuUsuario = document.getElementById('menuUsuario');

function capitalizar(texto) {
  if (!texto) return "";
  return texto.split(" ").map(p =>
    p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
  ).join(" ");
}

const enPages = window.location.pathname.includes("/pages/");
const ruta = (archivo) => enPages ? archivo : `pages/${archivo}`;
const rutaPanelAdmin = enPages ? "../admin/Panelproducto/Panel_dashboard.html" : "admin/Panelproducto/Panel_dashboard.html";

function obtenerUsuarioActual() {
  try { return JSON.parse(localStorage.getItem("usuarioActual") || "null"); }
  catch { return null; }
}

function esSesionAdminValida() {
  try {
    const admin = JSON.parse(sessionStorage.getItem("adminSession") || "null");
    return admin?.rol === "admin" && sessionStorage.getItem("accesoAdmin") === "true";
  } catch { return false; }
}

// Una marca administrativa antigua o incompleta no debe bloquear el acceso
// normal al menú de usuario: si no existe la marca de sesión, se limpia.
const usuarioInicial = obtenerUsuarioActual();
const estaEnAdministracion = window.location.pathname.includes("/admin/");
if (usuarioInicial?.rol === "admin") localStorage.removeItem("usuarioActual");

// Si el administrador actualiza o abre una página pública durante su sesión,
// vuelve directamente al panel administrativo.
if (esSesionAdminValida() && !estaEnAdministracion) {
  window.location.replace(rutaPanelAdmin);
}

function sincronizarUsuarioActual(usuarioActual) {
  if (!usuarioActual || usuarioActual.rol === "admin") return;
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const idx = usuarios.findIndex(u => u.correo === usuarioActual.correo || u.dni === usuarioActual.dni);
  if (idx !== -1) {
    usuarios[idx] = { ...usuarios[idx], ...usuarioActual };
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  sessionStorage.removeItem("accesoAdmin");
  sessionStorage.removeItem("usuarioActivo");
  localStorage.removeItem("usuarioActivo");
  menuUsuario?.classList.remove("show");
  window.location.href = enPages ? "../index.html" : "index.html";
}

function renderMenuUsuario(usuarioParam) {
  if (!menuUsuario) return;
  const usuario = usuarioParam || obtenerUsuarioActual();

  menuUsuario.classList.add("menu-usuario");

  if (esSesionAdminValida()) {
    // Una sesión administrativa válida siempre se dirige al panel; no se
    // muestran acciones administrativas en el menú público de clientes.
    menuUsuario.innerHTML = "";
    menuUsuario.classList.remove("show");
    usuarioToggle?.setAttribute("aria-label", "Sesión administrativa activa");
    usuarioToggle?.setAttribute("aria-expanded", "false");
  } else if (usuario && usuario.rol !== "admin") {
    sincronizarUsuarioActual(usuario);
    const nombre = capitalizar(usuario.nombres);
    const apellido = capitalizar(usuario.apellidos);

    menuUsuario.innerHTML = `
      <li><p>¡Bienvenido, <span class="nombre-usuario">${nombre || "Usuario"} ${apellido || ""}</span>!<br>
      Nos alegra verte en <span class="distribuidora">Marbellín</span>.</p></li>
      <li><a href="${ruta("perfil.html")}" id="linkPerfil" class="btn-menu-login">Mi perfil</a></li>
      <li><button type="button" id="btnCerrarSesion" class="btn-menu-login">Cerrar sesión</button></li>
    `;

    document.getElementById("btnCerrarSesion")?.addEventListener("click", cerrarSesion);
    document.getElementById("linkPerfil")?.addEventListener("click", (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");
      menuUsuario.classList.remove("show");
      window.location.href = href;
    });
  } else {
    menuUsuario.innerHTML = `
      <li><a href="${ruta("login.html")}" id="btnIniciarSesion" class="btn-menu-login">Iniciar sesión</a></li>
    `;
  }

  menuUsuario.classList.remove("show");
  usuarioToggle?.setAttribute("aria-expanded", "false");
}

window.addEventListener("storage", (e) => {
  if (e.key === "usuarioActual") renderMenuUsuario();
});
window.addEventListener("usuarioActualizado", (e) => renderMenuUsuario(e.detail));

usuarioToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!menuUsuario) return;
  const usuario = obtenerUsuarioActual();
  if (esSesionAdminValida()) {
    window.location.href = rutaPanelAdmin;
    return;
  }

  // Si no hay sesión válida, siempre se ofrece el acceso para clientes o admin.
  if (usuario?.rol === "admin") {
    localStorage.removeItem("usuarioActual");
    renderMenuUsuario(null);
  }

  if (window.innerWidth >= 769) {
    const rect = usuarioToggle.getBoundingClientRect();
    menuUsuario.style.position = "absolute";
    menuUsuario.style.top = rect.bottom + window.scrollY + 5 + "px";
    menuUsuario.style.right = window.innerWidth - rect.right + "px";
    menuUsuario.style.left = "auto";
  } else {
    menuUsuario.style.position = "relative";
    menuUsuario.style.top = "auto";
    menuUsuario.style.left = "auto";
    menuUsuario.style.right = "auto";
  }
  const abierto = menuUsuario.classList.toggle("show");
  usuarioToggle?.setAttribute("aria-expanded", String(abierto));
});

document.addEventListener("click", (e) => {
  if (!usuarioToggle?.contains(e.target) && !menuUsuario?.contains(e.target)) {
    menuUsuario?.classList.remove("show");
    usuarioToggle?.setAttribute("aria-expanded", "false");
  }
});
window.addEventListener("resize", () => {
  menuUsuario?.classList.remove("show");
  usuarioToggle?.setAttribute("aria-expanded", "false");
});
renderMenuUsuario();
