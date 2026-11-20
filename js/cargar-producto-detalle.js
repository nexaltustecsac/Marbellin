import { agregarAlCarrito } from "./cart/carritoStorage.js";
import { productos } from "./productos.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const producto = productos.find(p => p.id === id);
  const contenedor = document.getElementById("detalle-producto");

  if (!producto) {
    contenedor.innerHTML = `<p>Producto no encontrado.</p>`;
    return;
  }

  const { nombre, descripcion, precioUnidad, precioCuarto, precioDocena, imagenes, imagen } = producto;
  const imagenesArray = Array.isArray(imagenes) && imagenes.length ? imagenes : imagen ? [imagen] : [];

  // ---------- HTML inicial ----------
  const renderImagenes = () => imagenesArray.map(src => `<img src="${src}" alt="${nombre}" draggable="false">`).join("");
  const renderDots = () => imagenesArray.map((_, i) => `<button data-index="${i}" class="${i === 0 ? "active" : ""}" aria-label="Ir a la imagen ${i + 1}"></button>`).join("");

  contenedor.innerHTML = `
    <section class="detalle">
      <div class="media">
        <div class="slider">
          <div class="slider-track">${renderImagenes()}</div>
          <div class="slider-dots">${renderDots()}</div>
        </div>

        <div class="tabla-tallas">
          <h3>Guía de Tallas</h3>
          <table>
            <thead>
              <tr><th>Talla</th><th>Busto (cm)</th><th>Cintura (cm)</th><th>Cadera (cm)</th></tr>
            </thead>
            <tbody>
              <tr><td>S</td><td>80-85</td><td>60-65</td><td>85-90</td></tr>
              <tr><td>M</td><td>86-91</td><td>66-71</td><td>91-96</td></tr>
              <tr><td>L</td><td>92-98</td><td>72-77</td><td>97-102</td></tr>
              <tr><td>XL</td><td>99-105</td><td>78-83</td><td>103-108</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="info">
        <h2>${nombre}</h2>
        <p class="descripcion">${descripcion}</p>

        <p><strong>Selecciona presentación:</strong></p>
        <div class="tipo-precio-opciones">
          <button class="precio-opcion" data-tipo="unidad">Unidad - ${precioUnidad.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}</button>
          <button class="precio-opcion" data-tipo="cuarto">1/4 Docena - ${precioCuarto.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}</button>
          <button class="precio-opcion" data-tipo="docena">Docena - ${precioDocena.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}</button>
        </div>

        <div class="selector-color">
          <p><strong>Colores disponibles:</strong></p>
          <div class="colores-disponibles"></div>
          <div id="mensaje-error" class="mensaje-error" style="margin-top:6px;color:red;"></div>
          <p id="nota-colores" style="margin-top:6px;color:#555;">Selecciona presentación para elegir colores.</p>
        </div>

        <label for="talla">Talla:</label>
        <select id="talla">
          <option value="">Seleccionar</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
        </select>

        <label for="cantidad">Cantidad:</label>
        <input type="number" id="cantidad" min="1" value="1" />

        <button id="btnAgregarCarrito">Agregar al carrito</button>
        <button id="btnLimpiarSeleccion" style="background-color:#777; margin-top: 8px;">Limpiar selección</button>
      </div>
    </section>
  `;

  // ---------- Variables ----------
  const slider = contenedor.querySelector(".slider");
  const track = contenedor.querySelector(".slider-track");
  const slides = Array.from(track.children);
  const dots = Array.from(contenedor.querySelectorAll(".slider-dots button"));
  const colorContainer = contenedor.querySelector(".colores-disponibles");
  const notaColores = contenedor.querySelector("#nota-colores");
  const mensajeError = contenedor.querySelector("#mensaje-error");
  const botonesPrecio = contenedor.querySelector(".tipo-precio-opciones");
  const btnAgregar = contenedor.querySelector("#btnAgregarCarrito");
  const btnLimpiar = contenedor.querySelector("#btnLimpiarSeleccion");
  const selectTalla = contenedor.querySelector("#talla");
  const inputCantidad = contenedor.querySelector("#cantidad");

  let currentIndex = 0;
  let tipoPrecioSeleccionado = "";
  let coloresSeleccionados = [];
  let precioActivo = false;

  const maxColoresPorTipo = { unidad: 1, cuarto: 3, docena: 0 };

  const coloresDisponibles = [
  { nombre: "Azul noche", hex: "#0a1a2f" },
  { nombre: "Beige", hex: "#faf0dc" },
  { nombre: "Blanco", hex: "#fff" },
  { nombre: "Grape", hex: "#694784" },
  { nombre: "Lila", hex: "#c8a2c8" },
  { nombre: "Melani", hex: "#d6d3d1" },
  { nombre: "Melón", hex: "#ffe7e0" },
  { nombre: "Minty Fresh", hex: "#D4F1E3" },
  { nombre: "Negro", hex: "#000" },
  { nombre: "Neu", hex: "#004F79" },
  { nombre: "Palo rosa", hex: "#a35b67" },
  { nombre: "Rojo", hex: "#ff0000" },
  { nombre: "Rosado", hex: "#fcd3dc" },
  { nombre: "Topo", hex: "#6b6057" },
  { nombre: "Verde cemento", hex: "#9aa79d" },
  { nombre: "Vino", hex: "#5e2129" }
];

  // ---------- Funciones ----------
  const updateSlider = () => {
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(-${currentIndex * slider.clientWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  };

  const inicializarSlider = () => {
    dots.forEach(d => d.addEventListener("click", e => {
      currentIndex = +e.currentTarget.dataset.index;
      updateSlider();
    }));
    slides.forEach(img => img.addEventListener("dragstart", e => e.preventDefault()));
    window.addEventListener("resize", updateSlider);
    let startX = 0, isDragging = false;
    slider.addEventListener("touchstart", e => { startX = e.touches[0].clientX; isDragging = true; });
    slider.addEventListener("touchmove", e => {
      if(!isDragging) return;
      const diff = startX - e.touches[0].clientX;
      if(Math.abs(diff) > 20){
        if(diff>0 && currentIndex<slides.length-1) currentIndex++;
        else if(diff<0 && currentIndex>0) currentIndex--;
        updateSlider();
        isDragging=false;
      }
    });
    slider.addEventListener("touchend", ()=>{isDragging=false;});
    updateSlider();
  };

  const crearColores = () => {
    coloresDisponibles.forEach(c => {
      const box = document.createElement("span");
      box.className = "color-box inactivo";
      box.style.backgroundColor = c.hex;
      box.dataset.color = c.nombre;
      box.setAttribute("aria-label", c.nombre);
      box.addEventListener("click", () => {
        if (!precioActivo || tipoPrecioSeleccionado === "docena") return;
        const max = maxColoresPorTipo[tipoPrecioSeleccionado];
        if (box.classList.contains("seleccionado")) {
          box.classList.remove("seleccionado");
          coloresSeleccionados = coloresSeleccionados.filter(cl => cl !== c.nombre);
        } else if (coloresSeleccionados.length < max) {
          box.classList.add("seleccionado");
          coloresSeleccionados.push(c.nombre);
        } else {
          mostrarMensaje(`Solo puedes elegir ${max} colores.`, "error");
        }
      });
      colorContainer.appendChild(box);
    });
  };

  const actualizarColores = () => {
    const boxes = colorContainer.querySelectorAll(".color-box");
    if (!precioActivo) {
      boxes.forEach(b => { b.classList.add("inactivo"); b.classList.remove("seleccionado"); });
      coloresSeleccionados = [];
      notaColores.textContent = "Selecciona presentación para elegir colores.";
    } else if (tipoPrecioSeleccionado === "docena") {
      boxes.forEach(b => { b.classList.add("inactivo"); b.classList.remove("seleccionado"); });
      coloresSeleccionados = ["Surtido"];
      notaColores.textContent = "Colores surtidos (no se puede elegir).";
    } else {
      boxes.forEach(b => b.classList.remove("inactivo", "seleccionado"));
      coloresSeleccionados = [];
      notaColores.textContent = `Debes elegir ${maxColoresPorTipo[tipoPrecioSeleccionado]} color(es).`;
    }
  };

  const limpiarSeleccion = () => {
    tipoPrecioSeleccionado = "";
    precioActivo = false;
    botonesPrecio.querySelectorAll(".precio-opcion").forEach(b => b.classList.remove("seleccionado"));
    selectTalla.value = "";
    inputCantidad.value = "1";
    actualizarColores();
  };

  const mostrarMensaje = (texto, tipo="info") => {
    mensajeError.textContent = texto;
    mensajeError.style.color = tipo==="error" ? "red" : "green";
    mensajeError.style.fontWeight = "bold";
    mensajeError.style.backgroundColor = tipo==="error" ? "#ffe5e5" : "#e0ffe0";
    mensajeError.style.padding = "8px";
    mensajeError.style.borderRadius = "6px";
    setTimeout(() => {
      mensajeError.textContent = "";
      mensajeError.style.backgroundColor = "transparent";
      mensajeError.style.color = "red";
    }, 2500);
  };

  const agregarCarritoHandler = () => {
    const talla = selectTalla.value;
    let cantidad = parseInt(inputCantidad.value, 10);
    if (!tipoPrecioSeleccionado || !talla || cantidad < 1) {
      mostrarMensaje("Selecciona presentación, talla y cantidad válidas.", "error");
      return;
    }
    cantidad = Math.max(1, cantidad);
    const maxColores = maxColoresPorTipo[tipoPrecioSeleccionado];
    if ((tipoPrecioSeleccionado !== "docena") && coloresSeleccionados.length !== maxColores) {
      mostrarMensaje(`Debes seleccionar ${maxColores} color(es).`, "error");
      return;
    }

    const precioMap = { unidad: precioUnidad, cuarto: precioCuarto, docena: precioDocena };
    const etiquetaMap = { unidad: "Unidad", cuarto: "1/4 Docena", docena: "Docena" };

    agregarAlCarrito({
      id: `${producto.id}-${tipoPrecioSeleccionado}-${coloresSeleccionados.join("-")}-${talla}`,
      nombre: `${nombre} (${etiquetaMap[tipoPrecioSeleccionado]}, Colores: ${coloresSeleccionados.join(", ")}, Talla ${talla})`,
      precio: precioMap[tipoPrecioSeleccionado],
      cantidad,
      imagen: imagenesArray[0] || ""
    });

    mostrarMensaje("Producto añadido al carrito.", "success");
    limpiarSeleccion();
  };

  // ---------- Inicialización ----------
  inicializarSlider();
  crearColores();

  botonesPrecio.addEventListener("click", e => {
    const btn = e.target.closest(".precio-opcion");
    if (!btn) return;
    botonesPrecio.querySelectorAll(".precio-opcion").forEach(b => b.classList.remove("seleccionado"));
    btn.classList.add("seleccionado");
    tipoPrecioSeleccionado = btn.dataset.tipo;
    precioActivo = true;
    actualizarColores();
  });

  document.addEventListener("click", e => {
    const clicEnPrecio = e.target.closest(".precio-opcion");
    const clicEnColor = e.target.closest(".color-box");
    const clicEnTallaOCantidad = e.target.closest("#talla") || e.target.closest("#cantidad");
    if (!clicEnPrecio && !clicEnColor && !clicEnTallaOCantidad) {
      precioActivo = false;
      tipoPrecioSeleccionado = "";
      actualizarColores();
    }
  });

  btnAgregar.addEventListener("click", agregarCarritoHandler);
  btnLimpiar.addEventListener("click", limpiarSeleccion);
});