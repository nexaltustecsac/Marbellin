import { capitalizarPalabras, llenarSelect } from './perfil-utils.js';
import { ubicacionPeru } from '../ubicacion-peru.js';

export function inicializarPerfilDatos(usuario) {
  const inputs = {
    nombres: document.getElementById('perfil-nombres'),
    apellidos: document.getElementById('perfil-apellidos'),
    dni: document.getElementById('perfil-dni'),
    correo: document.getElementById('perfil-correo'),
    telefono: document.getElementById('perfil-telefono'),
    departamento: document.getElementById('perfil-departamento'),
    provincia: document.getElementById('perfil-provincia'),
    distrito: document.getElementById('perfil-distrito')
  };

  const textos = {
    departamento: document.getElementById('perfil-departamentoTexto'),
    provincia: document.getElementById('perfil-provinciaTexto'),
    distrito: document.getElementById('perfil-distritoTexto')
  };

  const btnEditar = document.getElementById('perfil-btnEditar');
  const btnGuardar = document.getElementById('perfil-btnGuardar');
  const btnCancelar = document.getElementById('perfil-btnCancelar');
  const btnCerrarSesion = document.getElementById('perfil-btnCerrarSesion');
  const btnCerrarEdicion = document.getElementById('perfil-btnCerrarEdicion');

  const actualizarProvincias = (valorProvincia = usuario.provincia) => {
    const dep = inputs.departamento.value;
    const provincias = dep ? Object.keys(ubicacionPeru[dep]) : [];
    llenarSelect(inputs.provincia, provincias, valorProvincia);
    actualizarDistritos();
  };

  const actualizarDistritos = (valorDistrito = usuario.distrito) => {
    const dep = inputs.departamento.value;
    const prov = inputs.provincia.value;
    const distritos = dep && prov ? ubicacionPeru[dep][prov] : [];
    llenarSelect(inputs.distrito, distritos, valorDistrito);
  };

  const cargarDatos = () => {
    inputs.nombres.value = capitalizarPalabras(usuario.nombres || '');
    inputs.apellidos.value = capitalizarPalabras(usuario.apellidos || '');
    inputs.dni.value = usuario.dni || '';
    inputs.correo.value = usuario.correo || '';
    inputs.telefono.value = usuario.telefono || '';
    inputs.correo.disabled = true;

    textos.departamento.textContent = capitalizarPalabras(usuario.departamento || '—');
    textos.provincia.textContent = capitalizarPalabras(usuario.provincia || '—');
    textos.distrito.textContent = capitalizarPalabras(usuario.distrito || '—');

    llenarSelect(inputs.departamento, Object.keys(ubicacionPeru), usuario.departamento);
    actualizarProvincias(usuario.provincia);
    actualizarDistritos(usuario.distrito);

    Object.values(inputs).forEach(input => input.disabled = true);
    inputs.departamento.style.display = 'none';
    inputs.provincia.style.display = 'none';
    inputs.distrito.style.display = 'none';
    Object.values(textos).forEach(t => t.style.display = 'inline-block');
  };

  const estadoInicialBotones = () => {
    btnEditar.style.display = 'inline-block';
    btnCerrarSesion.style.display = 'inline-block';
    btnGuardar.style.display = 'none';
    btnCancelar.style.display = 'none';
  };

  const habilitarEdicion = () => {
    Object.values(inputs).forEach(input => {
      if (input.id !== 'perfil-dni' && input.id !== 'perfil-correo') input.disabled = false;
    });
    inputs.departamento.style.display = 'inline-block';
    inputs.provincia.style.display = 'inline-block';
    inputs.distrito.style.display = 'inline-block';
    Object.values(textos).forEach(t => t.style.display = 'none');

    btnEditar.style.display = 'none';
    btnCerrarSesion.style.display = 'none';
    btnGuardar.style.display = 'inline-block';
    btnCancelar.style.display = 'inline-block';
  };

  const deshabilitarEdicion = () => {
    Object.values(inputs).forEach(input => input.disabled = true);
    inputs.departamento.style.display = 'none';
    inputs.provincia.style.display = 'none';
    inputs.distrito.style.display = 'none';
    Object.values(textos).forEach(t => t.style.display = 'inline-block');
    estadoInicialBotones();
  };

  const validarTelefono = numero => /^[0-9]{9}$/.test(numero);
  inputs.telefono.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
  });

  const limpiarTexto = texto => {
    return capitalizarPalabras(
      texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    );
  };

  const guardarCambios = () => {
    const nombresLimpios = limpiarTexto(inputs.nombres.value);
    const apellidosLimpios = limpiarTexto(inputs.apellidos.value);

    if (!nombresLimpios || !apellidosLimpios) {
      alert('Complete correctamente los campos de nombres y apellidos.');
      return;
    }
    if (!inputs.telefono.value || !validarTelefono(inputs.telefono.value)) {
      alert('El teléfono debe contener exactamente 9 números.');
      return;
    }

    usuario.nombres = nombresLimpios;
    usuario.apellidos = apellidosLimpios;
    usuario.telefono = inputs.telefono.value;
    usuario.departamento = inputs.departamento.value;
    usuario.provincia = inputs.provincia.value;
    usuario.distrito = inputs.distrito.value;

    localStorage.setItem('usuarioActual', JSON.stringify(usuario));

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const idx = usuarios.findIndex(u => u.dni === usuario.dni);
    if (idx !== -1) {
      usuarios[idx] = { ...usuarios[idx], ...usuario };
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    // 🔑 Refrescar inmediatamente en pantalla
    inputs.nombres.value = usuario.nombres;
    inputs.apellidos.value = usuario.apellidos;
    inputs.telefono.value = usuario.telefono;
    textos.departamento.textContent = capitalizarPalabras(usuario.departamento || '—');
    textos.provincia.textContent = capitalizarPalabras(usuario.provincia || '—');
    textos.distrito.textContent = capitalizarPalabras(usuario.distrito || '—');

    deshabilitarEdicion();
    alert('Cambios guardados correctamente');
    window.dispatchEvent(new Event('usuarioActualizado'));
  };

  const cancelarEdicion = () => {
    cargarDatos();
    deshabilitarEdicion();
    alert('Se canceló la edición de información');
  };

  btnEditar.addEventListener('click', habilitarEdicion);
  btnGuardar.addEventListener('click', guardarCambios);
  btnCancelar.addEventListener('click', cancelarEdicion);

  btnCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('usuarioActual');
    const enPages = window.location.pathname.includes('/pages/');
    window.location.href = enPages ? '../index.html' : 'index.html';
  });

  btnCerrarEdicion.addEventListener('click', () => {
    const menuUsuario = document.getElementById('menuUsuario');
    if (menuUsuario) menuUsuario.classList.remove('show');

    if (window.history.length > 1) {
      window.history.back();
    } else {
      const enPages = window.location.pathname.includes('/pages/');
      window.location.href = enPages ? '../index.html' : 'index.html';
    }
  });

  cargarDatos();
  estadoInicialBotones();

  inputs.departamento.addEventListener('change', () => actualizarProvincias());
  inputs.provincia.addEventListener('change', () => actualizarDistritos());
}