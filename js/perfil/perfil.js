import { inicializarPerfilDatos } from './perfildato.js';

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
  if (!usuario) {
    const enPages = window.location.pathname.includes('/pages/');
    window.location.href = enPages ? 'login.html' : 'pages/login.html';
    return;
  }

  // Inicializar módulo de datos
  inicializarPerfilDatos(usuario);
});