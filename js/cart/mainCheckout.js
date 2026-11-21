// mainCheckout.js
import {
  mostrarResumenPedido,
  toggleEntrega,
  verificarEnvioFueraLima,
  validarPaso1,
  validarPaso2,
  obtenerValor,
  setReadonly,
  toggleClase
} from './checkout.js';

import { mostrarPaso, cargarDatosUsuario } from './checkoutPasos.js';
import { generarBoletaPDF } from './generarBoleta.js';
import { obtenerCarrito } from './carritoStorage.js';
import { inicializarUbicacion, reiniciarUbicacion } from '../cargar-ubicacion.js';

// 🧽 Función global para limpiar errores visuales
function limpiarErroresGlobales() {
  document.querySelectorAll(".error-msg").forEach(msg => msg.remove());
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

document.addEventListener("DOMContentLoaded", () => {

  inicializarUbicacion();
  mostrarResumenPedido();
  cargarDatosUsuario();

  // 🔸 Botones de navegación
  document.getElementById("siguiente-inicial")?.addEventListener("click", () => {
    if (validarPaso1()) {
      limpiarErroresGlobales();
      mostrarPaso(2);
    }
  });

  document.getElementById("siguiente-2")?.addEventListener("click", () => {
    if (validarPaso2()) {
      limpiarErroresGlobales();
      mostrarPaso(3);
    }
  });

  document.getElementById("anterior-2")?.addEventListener("click", () => {
    limpiarErroresGlobales();
    mostrarPaso(1);
  });

  document.getElementById("anterior-3")?.addEventListener("click", () => {
    limpiarErroresGlobales();
    mostrarPaso(2);
  });

  // 🔸 Limpiar datos
  document.getElementById("limpiar-datos")?.addEventListener("click", () => {
    ['nombres', 'apellidos', 'correo', 'dni', 'telefono'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    limpiarErroresGlobales();
  });

  // 🔸 Editar / Guardar / Cancelar
  document.getElementById("editar-datos")?.addEventListener("click", () => {
    setReadonly(['nombres', 'apellidos', 'telefono'], false);
    setReadonly(['correo', 'dni'], true);
    toggleClase("editar-datos", "oculto", true);
    toggleClase("guardar-datos", "oculto", false);
    toggleClase("cancelar-edicion", "oculto", false);
    toggleClase("siguiente-inicial", "oculto", true);
    limpiarErroresGlobales();
  });

  document.getElementById("guardar-datos")?.addEventListener("click", () => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || {};
    const nuevosDatos = {
      ...usuarioActual,
      nombres: obtenerValor("nombres"),
      apellidos: obtenerValor("apellidos"),
      telefono: obtenerValor("telefono"),
    };
    localStorage.setItem("usuarioActual", JSON.stringify(nuevosDatos));

    Swal.fire({
      icon: 'success',
      title: '✅ Datos guardados correctamente',
      confirmButtonText: 'Aceptar'
    });

    cargarDatosUsuario();
    limpiarErroresGlobales();
  });

  document.getElementById("cancelar-edicion")?.addEventListener("click", () => {
    cargarDatosUsuario();
    limpiarErroresGlobales();
  });

  // 🔸 Finalizar compra
  document.getElementById("paso3")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarErroresGlobales();

    const checkbox = e.target.querySelector("input[type='checkbox']");
    if (!checkbox?.checked) {
      Swal.fire({
        icon: 'warning',
        title: 'Términos y condiciones',
        text: 'Debes aceptar los términos antes de continuar.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuarioActual")) || {};
    const carrito = obtenerCarrito() || [];

    // 🚫 Si carrito está vacío
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Tu carrito está vacío 🛒',
        text: 'Agrega productos antes de finalizar tu compra.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // ✅ Crear mensaje
    const total = mostrarResumenPedido();
    const metodoPagoRadio = document.querySelector('input[name="pago"]:checked');
    const metodoPago = metodoPagoRadio ? metodoPagoRadio.value : "No especificado";

    let mensaje = `🛍️ *Nuevo Pedido - Marbellín Lencería*\n\n`;
    mensaje += `👩 *Cliente:* ${usuario.nombres || obtenerValor("nombres")} ${usuario.apellidos || obtenerValor("apellidos")}\n`;
    mensaje += `📞 *Teléfono:* ${usuario.telefono || obtenerValor("telefono")}\n`;
    mensaje += `📧 *Correo:* ${usuario.correo || obtenerValor("correo")}\n`;
    mensaje += `🆔 *DNI:* ${usuario.dni || obtenerValor("dni")}\n\n`;
    mensaje += `🧾 *Detalle del Pedido:*\n`;

    carrito.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} docenas — S/.${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    mensaje += `\n💰 *Total:* S/.${total.toFixed(2)}\n`;
    mensaje += `💳 *Método de pago:* ${metodoPago}\n`;

    const modoEntrega = document.getElementById("btn-delivery")?.classList.contains("activo")
      ? "Delivery" : "Recojo en tienda";

    mensaje += `\n📦 *Modo de entrega:* ${modoEntrega}\n`;

    if (modoEntrega === "Delivery") {
      const departamento = obtenerValor("departamento");
      const provincia = obtenerValor("provincia");
      const distrito = obtenerValor("distrito");
      const direccion = obtenerValor("direccion");
      const referencia = obtenerValor("referencia");
      const tipoEnvio = obtenerValor("tipoEnvio");
      const direccionReal = obtenerValor("direccionReal");

      mensaje += `\n📍 *Departamento:* ${departamento}\n`;
      mensaje += `🏙 *Provincia:* ${provincia}\n`;
      mensaje += `🏘 *Distrito:* ${distrito}\n`;

      if (
        (departamento === "Lima" && provincia === "Lima Metropolitana") ||
        (departamento === "Callao" && provincia === "Prov. Const. del Callao")
      ) {
        mensaje += `📫 *Dirección:* ${direccion}\n`;
        if (referencia) mensaje += `📍 *Referencia:* ${referencia}\n`;
      } else {
        mensaje += `🚚 *Tipo de envío:* ${tipoEnvio}\n`;
        mensaje += `🏠 *Dirección real:* ${direccionReal}\n`;
      }
    }

    const numeroWhatsApp = "922886724";
    const urlWhatsApp = `https://wa.me/51${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    try {
      await generarBoletaPDF();
    } catch (error) {
      console.error("Error generando boleta:", error);
    }

    // 🎉 Alerta elegante final
    Swal.fire({
      icon: 'success',
      title: '¡Pedido finalizado! 🎉',
      text: 'Redirigiendo al WhatsApp para confirmar tu pedido...',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: () => Swal.showLoading()
    }).then(() => {
      window.open(urlWhatsApp, "_blank");
      localStorage.removeItem("carrito");
      reiniciarUbicacion();
      setTimeout(() => (window.location.href = "../index.html"), 1500);
    });
  });
});