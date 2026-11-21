document.addEventListener("DOMContentLoaded", () => {
  const preguntas = document.querySelectorAll(".pregunta-question");

  preguntas.forEach((pregunta) => {
    pregunta.addEventListener("click", () => {
      const respuesta = pregunta.nextElementSibling;
      const isActive = pregunta.classList.contains("active");

      // Cerrar todas las preguntas antes de abrir la nueva
      preguntas.forEach((p) => {
        p.classList.remove("active");
        if (p.nextElementSibling) {
          p.nextElementSibling.classList.remove("show");
        }
      });

      // Si no estaba activa, abrirla
      if (!isActive) {
        pregunta.classList.add("active");
        respuesta.classList.add("show");

        // Scroll suave hacia la pregunta seleccionada
        pregunta.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });
  });
});