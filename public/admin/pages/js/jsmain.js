document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('form[data-demo-form], #contact-form, #product-form, #order-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const output = form.querySelector('[data-form-message], #form-message');
      if (output) {
        output.textContent = 'Formulario validado. Para guardar datos o enviar el mensaje, se necesita conectar este formulario con el servidor.';
        output.setAttribute('role', 'status');
      }
    });
  });

  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
  });
});