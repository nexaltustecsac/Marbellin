document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.getElementById("loginContainer");
  const recuperarContainer = document.getElementById("recuperarContainer");
  const formLogin = document.getElementById("formLogin");
  const formRecuperar = document.getElementById("formRecuperar");
  const params = new URLSearchParams(window.location.search);
  const desdeCheckout = params.get("origen") === "checkout";

  const codigoSimulado = document.getElementById("codigoSimulado");
  const enviarCodigoBtn = document.getElementById("enviarCodigo");
  const verificarCodigoBtn = document.getElementById("verificarCodigo");
  const inputUsuarioRecuperar = document.getElementById("usuarioRecuperar");
  const inputCodigoVerificacion = document.getElementById("codigoVerificacion");
  const nuevaContrasenaContainer = document.getElementById("nuevaContrasenaContainer");
  const inputNuevaContrasena = document.getElementById("nuevaContrasena");
  const inputConfirmarNueva = document.getElementById("confirmarNuevaContrasena");
  const actualizarContrasenaBtn = document.getElementById("actualizarContrasena");
  let usuarioRecuperar = null;
  let codigoGenerado = "";

  const ADMIN_EMAIL = "marbellinlenceria@gmail.com";
  const ADMIN_PASSWORD = "Marbellin2026@05";

  function redirigirPostLogin() {
    window.location.replace(desdeCheckout ? "checkout.html" : "../index.html");
  }

  function iniciarSesionAdministrador() {
    // Mantiene la sesión administrativa separada de las cuentas de clientes.
    sessionStorage.setItem("accesoAdmin", "true");
    sessionStorage.setItem("adminSession", JSON.stringify({
      rol: "admin",
      email: ADMIN_EMAIL,
      nombre: "Administrador"
    }));
    sessionStorage.removeItem("adminReturnUrl");
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("usuarioActivo");

    // Entrar directamente al dashboard principal, sin alertas ni pantallas intermedias.
    window.location.replace("../admin/Registro_producto.html");
  }

  formLogin?.addEventListener("submit", e => {
    e.preventDefault();
    const usuarioInput = document.getElementById("usuarioLogin").value.trim();
    const contrasena = document.getElementById("contrasenaLogin").value;
    if (!usuarioInput || !contrasena) { alert("Complete todos los campos."); return; }

    // Las credenciales administrativas también se reconocen desde este formulario.
    // Solo se concede el acceso cuando coinciden tanto el correo como la contraseña.
    if (usuarioInput.toLowerCase() === ADMIN_EMAIL) {
      if (contrasena !== ADMIN_PASSWORD) {
        alert("La contraseña del administrador es incorrecta.");
        return;
      }
      iniciarSesionAdministrador();
      return;
    }

    // Las demás cuentas continúan usando el acceso normal de clientes.
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(u => u.correo === usuarioInput || u.dni === usuarioInput);
    if (!usuarioEncontrado) { alert("Usuario no encontrado."); return; }
    if (usuarioEncontrado.contrasena !== contrasena) { alert("Contraseña incorrecta."); return; }
    const {nombres,apellidos,telefono,departamento,provincia,distrito,correo,dni} = usuarioEncontrado;
    // La sesión de cliente es independiente de la sesión administrativa.
    sessionStorage.removeItem("accesoAdmin");
    sessionStorage.removeItem("adminSession");
    localStorage.setItem("usuarioActual", JSON.stringify({nombres,apellidos,telefono,departamento,provincia,distrito,correo,dni,rol:"cliente"}));
    redirigirPostLogin();
  });

  document.getElementById("olvidarContrasena")?.addEventListener("click", e => {
    e.preventDefault(); loginContainer.style.display = "none"; recuperarContainer.style.display = "block";
    nuevaContrasenaContainer.style.display = "none"; codigoSimulado.innerHTML = "";
    inputUsuarioRecuperar.value = ""; inputCodigoVerificacion.value = ""; usuarioRecuperar = null; codigoGenerado = "";
  });
  document.getElementById("volverLogin")?.addEventListener("click", e => {
    e.preventDefault(); recuperarContainer.style.display = "none"; loginContainer.style.display = "block";
  });

  enviarCodigoBtn?.addEventListener("click", () => {
    const usuarioInput = inputUsuarioRecuperar.value.trim();
    if (!usuarioInput) { alert("Ingrese su correo o DNI."); return; }
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarioRecuperar = usuarios.find(u => u.correo === usuarioInput || u.dni === usuarioInput);
    if (!usuarioRecuperar) { alert("No se encontró un usuario con esos datos."); return; }
    codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();
    codigoSimulado.innerHTML = `<strong>Tu código de verificación:</strong> <span>${codigoGenerado}</span>`;
    alert("Código generado. Revisa el recuadro para continuar.");
  });
  verificarCodigoBtn?.addEventListener("click", () => {
    if (!usuarioRecuperar || !codigoGenerado) { alert("Primero ingrese un correo o DNI válido y genere el código."); return; }
    if (inputCodigoVerificacion.value.trim() === codigoGenerado) { alert("Código verificado. Ingresa tu nueva contraseña."); nuevaContrasenaContainer.style.display = "flex"; }
    else alert("Código incorrecto. Intenta nuevamente.");
  });
  actualizarContrasenaBtn?.addEventListener("click", () => {
    const nueva = inputNuevaContrasena.value.trim(), confirmar = inputConfirmarNueva.value.trim();
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(nueva)) { alert("La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número."); return; }
    if (nueva === usuarioRecuperar?.contrasena) { alert("La nueva contraseña no puede ser igual a la anterior."); return; }
    if (nueva !== confirmar) { alert("Las contraseñas no coinciden."); return; }
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const idx = usuarios.findIndex(u => u.correo === usuarioRecuperar.correo || u.dni === usuarioRecuperar.dni);
    if (idx !== -1) {
      usuarios[idx].contrasena = nueva; localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alert("Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
      recuperarContainer.style.display = "none"; loginContainer.style.display = "block";
      formRecuperar.reset(); nuevaContrasenaContainer.style.display = "none"; codigoSimulado.innerHTML = ""; codigoGenerado = ""; usuarioRecuperar = null;
    }
  });
  document.querySelectorAll(".toggle-password").forEach(btn => btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target); if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    btn.innerHTML = input.type === "password" ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
  }));
});
