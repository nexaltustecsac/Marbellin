import { obtenerCarrito } from './carritoStorage.js';
import { productos } from '../productos.js';

// DATOS DE TIENDAS
export const tiendas = {
  tienda1: { direccion: "Jr. América 325, La Victoria.", imagen: "../assets/img/tienda/tienda1.jpg" },
  tienda2: { direccion: "Jr. Hipólito Unanue 1457, La Victoria. A una cuadra del Parque Cánepa.", imagen: "../assets/img/tienda/tienda2.jpg" }
};

// UTILIDADES
export const obtenerValor = id => document.getElementById(id)?.value.trim() || "";
export const toggleClase = (id, clase, estado) => document.getElementById(id)?.classList.toggle(clase, estado);
export const setReadonly = (ids, estado) => ids.forEach(id => {
  const input = document.getElementById(id);
  if (input) estado ? input.setAttribute("readonly", true) : input.removeAttribute("readonly");
});

// MOSTRAR RESUMEN PEDIDO
export function mostrarResumenPedido() {
  const carrito = obtenerCarrito() || [];
  const contenedor = document.getElementById("listaResumen");
  const totalSpan = document.getElementById("totalResumen");
  if (!contenedor || !totalSpan) return;

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    const producto = productos.find(p => p.id == item.id.split("-")[0]);
    if (!producto) return;
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const imagenSrc = producto.imagenes?.[0] || "../assets/img/sin-imagen.jpg";

    contenedor.innerHTML += `
      <div class="item-resumen">
        <img src="${imagenSrc}" alt="${producto.nombre}">
        <div>
          <p><strong>${item.nombre}</strong></p>
          <p>Cantidad: ${item.cantidad} docenas cerradas (12 prendas c/u)</p>
          <p>Subtotal: S/.${subtotal.toFixed(2)}</p>
        </div>
      </div>`;
  });

  totalSpan.textContent = `S/.${total.toFixed(2)}`;
  return total;
}

// ENTREGA: DELIVERY O RECOJO
export function toggleEntrega(modo) {
  limpiarErroresGlobal(); // 🧹 limpia errores al cambiar modo

  const esDelivery = modo === "delivery";
  const deliveryFields = document.getElementById("delivery-fields");
  const tiendaFields = document.getElementById("tienda-fields");
  const selectTienda = document.getElementById("tiendaSeleccionada");
  const tiendaInfo = document.getElementById("tienda-info");
  const tiendaImg = document.getElementById("tienda-img");
  const tiendaDireccion = document.getElementById("tienda-direccion");

  toggleClase("btn-delivery", "activo", esDelivery);
  toggleClase("btn-tienda", "activo", !esDelivery);

  if (deliveryFields) deliveryFields.style.display = esDelivery ? "block" : "none";
  if (tiendaFields) tiendaFields.style.display = esDelivery ? "none" : "block";

  if (esDelivery && selectTienda) {
    selectTienda.value = "";
    if (tiendaInfo) tiendaInfo.classList.add("oculto");
    if (tiendaImg) tiendaImg.src = "";
    if (tiendaDireccion) tiendaDireccion.textContent = "";
  }

  if (!esDelivery) mostrarTiendaSeleccionada();
  verificarEnvioFueraLima();
}

// MOSTRAR TIENDA SELECCIONADA
export function mostrarTiendaSeleccionada() {
  const select = document.getElementById("tiendaSeleccionada");
  const infoDiv = document.getElementById("tienda-info");
  const img = document.getElementById("tienda-img");
  const direccion = document.getElementById("tienda-direccion");
  if (!select || !infoDiv || !img || !direccion) return;

  const actualizarTienda = () => {
    const tienda = select.value.trim();
    if (tienda && tiendas[tienda]) {
      img.src = tiendas[tienda].imagen;
      direccion.textContent = tiendas[tienda].direccion;
      infoDiv.classList.remove("oculto");
    } else {
      img.src = "";
      direccion.textContent = "";
      infoDiv.classList.add("oculto");
    }
    limpiarErroresGlobal(); // 🧹 limpia errores al seleccionar tienda
  };

  select.addEventListener("change", actualizarTienda);
  actualizarTienda();
}

// VERIFICAR ENVÍO
export function verificarEnvioFueraLima() {
  const departamento = obtenerValor("departamento");
  const provincia = obtenerValor("provincia");
  if (!departamento || !provincia) {
    document.getElementById("bloque-lima-callao")?.classList.add("oculto");
    document.getElementById("bloque-otras-provincias")?.classList.add("oculto");
    return;
  }

  const dentroLima =
    (departamento === "Lima" && provincia === "Lima Metropolitana") ||
    (departamento === "Callao" && provincia === "Prov. Const. del Callao");

  toggleClase("bloque-lima-callao", "oculto", !dentroLima);
  toggleClase("bloque-otras-provincias", "oculto", dentroLima);
}

// VALIDACIONES
function mostrarError(id, mensaje) {
  const input = document.getElementById(id);
  if (!input) return;
  let errorMsg = input.parentNode.querySelector(".error-msg");
  if (errorMsg) errorMsg.remove();
  errorMsg = document.createElement("div");
  errorMsg.className = "error-msg";
  errorMsg.textContent = mensaje;
  input.insertAdjacentElement("afterend", errorMsg);
  input.classList.add("input-error");
}

// 🧹 Limpia todos los errores globalmente
export function limpiarErroresGlobal() {
  document.querySelectorAll(".error-msg").forEach(msg => msg.remove());
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

// VALIDAR PASO 1
export function validarPaso1() {
  const campos = ['nombres','apellidos','correo','dni','telefono'];
  limpiarErroresGlobal();

  for (const id of campos) {
    const input = document.getElementById(id);
    const valor = input?.value.trim() || "";
    if (!valor) { mostrarError(id,"Campo incompleto"); input.focus(); return false; }
    if (id==='correo' && !/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/.test(valor)) { mostrarError(id,"Correo inválido"); input.focus(); return false; }
    if (id==='dni' && !/^\d{8}$/.test(valor)) { mostrarError(id,"DNI 8 dígitos"); input.focus(); return false; }
    if (id==='telefono' && !/^\d{9}$/.test(valor)) { mostrarError(id,"Teléfono 9 dígitos"); input.focus(); return false; }
  }
  return true;
}

// VALIDAR PASO 2
export function validarPaso2() {
  const esDelivery = document.getElementById("btn-delivery")?.classList.contains("activo");
  limpiarErroresGlobal();

  if (esDelivery) {
    const departamento = obtenerValor("departamento");
    const provincia = obtenerValor("provincia");
    const dentroLima =
      (departamento === "Lima" && provincia === "Lima Metropolitana") ||
      (departamento === "Callao" && provincia === "Prov. Const. del Callao");

    const campos = dentroLima
      ? ['departamento','provincia','distrito','direccion']
      : ['departamento','provincia','distrito','tipoEnvio','direccionReal'];

    for (const id of campos) {
      const campo = document.getElementById(id);
      if (!campo?.value.trim()) { mostrarError(id,"Campo incompleto"); campo.focus(); return false; }
    }
  } else {
    const tienda = document.getElementById("tiendaSeleccionada");
    if (!tienda?.value.trim()) { mostrarError('tiendaSeleccionada',"Selecciona tienda"); tienda.focus(); return false; }
  }

  return true;
}

// ✅ VALIDAR CARRITO ANTES DE FINALIZAR COMPRA
export function validarCarrito() {
  const carrito = obtenerCarrito() || [];
  if (carrito.length === 0) {
    alert("⚠️ No puedes finalizar la compra sin productos en el carrito.");
    return false;
  }
  return true;
}

// FINALIZAR COMPRA
export function finalizarCompra() {
  if (!validarCarrito()) return;
  if (!validarPaso1() || !validarPaso2()) {
    alert("Por favor, completa correctamente todos los campos antes de finalizar.");
    return;
  }

  alert("✅ Compra finalizada con éxito. ¡Gracias por tu pedido!");
}

// EVENTOS GLOBALES
document.addEventListener("DOMContentLoaded", () => {
  const dni = document.getElementById("dni");
  const telefono = document.getElementById("telefono");
  const btnFinalizar = document.getElementById("btnFinalizarCompra");

  if (dni) dni.addEventListener("input", () => dni.value = dni.value.replace(/\D/g,"").slice(0,8));
  if (telefono) telefono.addEventListener("input", () => telefono.value = telefono.value.replace(/\D/g,"").slice(0,9));

  // 🟢 Borrar errores al escribir o seleccionar algo
  document.querySelectorAll("input, select").forEach(campo => {
    campo.addEventListener("input", () => {
      const msg = campo.parentElement.querySelector(".error-msg");
      if (msg) msg.remove();
      campo.classList.remove("input-error");
    });
    campo.addEventListener("change", () => {
      const msg = campo.parentElement.querySelector(".error-msg");
      if (msg) msg.remove();
      campo.classList.remove("input-error");
    });
  });

  if (btnFinalizar) btnFinalizar.addEventListener("click", finalizarCompra);

  mostrarTiendaSeleccionada();
});