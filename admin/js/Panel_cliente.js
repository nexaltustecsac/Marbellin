/* Panel_cliente — inicialización aislada del módulo.
   La lógica funcional compartida sigue en los controladores existentes. */
(function () {
  'use strict';
  const iniciar = () => {
    const modulo = document.getElementById('panelClientes');
    if (!modulo || modulo.dataset.moduloInicializado === 'true') return;
    modulo.dataset.moduloInicializado = 'true';
    modulo.dataset.moduloAdmin = 'cliente';
    modulo.classList.add('admin-module-ready');
    modulo.dispatchEvent(new CustomEvent('marbellin:modulo-listo', {
      bubbles: true,
      detail: { modulo: 'cliente', elemento: modulo }
    }));
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
