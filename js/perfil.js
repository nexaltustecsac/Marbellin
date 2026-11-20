import { ubicacionPeru } from './ubicacion-peru.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- Cargar usuario actual ---
  const rawUsuario = localStorage.getItem('usuarioActual');
  if (!rawUsuario) {
    window.location.href = 'login.html'; // Redirige si no hay usuario
    return;
  }

  const usuario = JSON.parse(rawUsuario);

  // --- Elementos del DOM ---
  const inputs = {
    nombres: document.getElementById('nombres'),
    apellidos: document.getElementById('apellidos'),
    dni: document.getElementById('dni'),
    correo: document.getElementById('correo'),
    telefono: document.getElementById('telefono'),
    departamento: document.getElementById('departamento'),
    provincia: document.getElementById('provincia'),
    distrito: document.getElementById('distrito')
  };

  const textos = {
    departamento: document.getElementById('departamentoTexto'),
    provincia: document.getElementById('provinciaTexto'),
    distrito: document.getElementById('distritoTexto')
  };

  // --- Funciones de ayuda ---
  const capitalizar = texto => texto ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase() : '';

  const llenarSelect = (selectEl, opciones = [], valor = '') => {
    if (!selectEl) return;
    selectEl.innerHTML = '<option value="">— Seleccione —</option>';
    opciones.forEach(op => {
      const option = document.createElement('option');
      option.value = op;
      option.textContent = op;
      if (op === valor) option.selected = true;
      selectEl.appendChild(option);
    });
  };

  const actualizarProvincias = () => {
    const dep = inputs.departamento.value;
    const provincias = dep ? Object.keys(ubicacionPeru[dep]) : [];
    llenarSelect(inputs.provincia, provincias, usuario.provincia);
    actualizarDistritos();
  };

  const actualizarDistritos = () => {
    const dep = inputs.departamento.value;
    const prov = inputs.provincia.value;
    const distritos = dep && prov ? ubicacionPeru[dep][prov] : [];
    llenarSelect(inputs.distrito, distritos, usuario.distrito);
  };

  // --- Cargar datos en campos ---
  const cargarDatos = () => {
    if (inputs.nombres) inputs.nombres.value = capitalizar(usuario.nombres || '');
    if (inputs.apellidos) inputs.apellidos.value = capitalizar(usuario.apellidos || '');
    if (inputs.dni) inputs.dni.value = usuario.dni || '';
    if (inputs.correo) inputs.correo.value = usuario.correo || '';
    if (inputs.telefono) inputs.telefono.value = usuario.telefono || '';

    textos.departamento.textContent = usuario.departamento || '—';
    textos.provincia.textContent = usuario.provincia || '—';
    textos.distrito.textContent = usuario.distrito || '—';

    llenarSelect(inputs.departamento, Object.keys(ubicacionPeru), usuario.departamento);
    actualizarProvincias();
  };

  // --- Inicializa ---
  cargarDatos();

  // Actualizar provincias y distritos si el usuario cambia selección
  inputs.departamento.addEventListener('change', actualizarProvincias);
  inputs.provincia.addEventListener('change', actualizarDistritos);
});