document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRegistro");
  if (!form) return;
  const dniInput = document.getElementById("dni");
  const telefonoInput = document.getElementById("telefono");
  [dniInput, telefonoInput].forEach(input => input?.addEventListener("input", () => { input.value = input.value.replace(/\D/g, ""); }));
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombres = document.getElementById("nombres").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const dni = dniInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const departamento = document.getElementById("departamento").value;
    const provincia = document.getElementById("provincia").value;
    const distrito = document.getElementById("distrito").value;
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const contrasena = document.getElementById("contrasena").value;
    const confirmar = document.getElementById("confirmarContrasena").value;
    if (!/^\d{8}$/.test(dni)) { alert("El DNI debe contener 8 dígitos."); return; }
    if (!/^\d{9}$/.test(telefono)) { alert("El celular debe contener 9 dígitos."); return; }
    if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/.test(correo)) { alert("Ingrese un correo válido de Gmail o Hotmail."); return; }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(contrasena)) { alert("La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número."); return; }
    if (contrasena !== confirmar) { alert("Las contraseñas no coinciden."); return; }
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    // El correo administrativo está reservado y no puede registrarse como cliente.
    if (correo === "marbellinlenceria@gmail.com") { alert("Este correo está reservado para la administración de Marbellín."); return; }
    if (usuarios.some(u => u.correo?.toLowerCase() === correo)) { alert("Este correo ya está registrado."); return; }
    if (usuarios.some(u => u.dni === dni)) { alert("Este DNI ya está registrado."); return; }
    usuarios.push({nombres,apellidos,dni,telefono,departamento,provincia,distrito,correo,contrasena});
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Cuenta registrada exitosamente.");
    const origen = new URLSearchParams(location.search).get("origen");
    location.href = origen === "checkout" ? "login.html?origen=checkout" : "login.html";
  });
  document.querySelectorAll(".toggle-password").forEach(btn => btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target); if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    btn.innerHTML = input.type === "password" ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
  }));
});
