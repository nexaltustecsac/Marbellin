/* Panel_pedidos — inicialización aislada del módulo.
   La lógica funcional compartida sigue en los controladores existentes. */
(function () {
  'use strict';
  const iniciar = () => {
    const modulo = document.getElementById('panelPedidos');
    if (!modulo || modulo.dataset.moduloInicializado === 'true') return;
    modulo.dataset.moduloInicializado = 'true';
    modulo.dataset.moduloAdmin = 'pedidos';
    modulo.classList.add('admin-module-ready');
    modulo.dispatchEvent(new CustomEvent('marbellin:modulo-listo', {
      bubbles: true,
      detail: { modulo: 'pedidos', elemento: modulo }
    }));
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
