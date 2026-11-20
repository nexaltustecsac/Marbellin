// cargar-ubicacion.js
import { ubicacionPeru } from "./ubicacion-peru.js";

export function inicializarUbicacion() {
  // --- Selección de elementos principales ---
  const departamentoSelect = document.getElementById("departamento");
  const provinciaSelect = document.getElementById("provincia");
  const distritoSelect = document.getElementById("distrito");

  if (!departamentoSelect || !provinciaSelect || !distritoSelect) return;

  // --- Bloques de tipo de envío ---
  const bloqueLimaCallao = document.getElementById("bloque-lima-callao");
  const bloqueOtrasProvincias = document.getElementById("bloque-otras-provincias");
  const bloqueRecojoTienda = document.getElementById("bloque-recojo-tienda"); // 🟢 soporte para imágenes de tiendas

  // --- Inicialmente ocultos ---
  ocultarBloquesEnvio();

  // --- Cargar selects iniciales ---
  departamentoSelect.innerHTML = '<option value="">Seleccione un departamento</option>';
  provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
  distritoSelect.innerHTML = '<option value="">Seleccione un distrito</option>';

  // --- Cargar departamentos desde el objeto ubicacionPeru ---
  for (const dep in ubicacionPeru) {
    const option = document.createElement("option");
    option.value = dep;
    option.textContent = dep;
    departamentoSelect.appendChild(option);
  }

  /* ============================================================
     🔸 NORMALIZADOR DE TEXTO (quita tildes, mayúsculas y espacios)
  ============================================================ */
  const normalize = str =>
    (str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\./g, "")
      .trim();

  /* ============================================================
     🔹 PROVINCIAS válidas dentro de Lima y Callao
  ============================================================ */
  const provinciasDentroPorDepartamento = {
    lima: ["lima", "lima metropolitana", "provincia de lima", "lima provincia"],
    callao: [
      "callao",
      "prov const del callao",
      "provincia constitucional del callao",
      "provincia const callao",
      "provincia const del callao"
    ]
  };

  /* ============================================================
     🔹 Determinar si ubicación está dentro de Lima o Callao
  ============================================================ */
  const esDentroDeLima = (departamento, provincia) => {
    const d = normalize(departamento);
    const p = normalize(provincia);
    if (!d || !p) return false;

    if (d.includes("lima"))
      return provinciasDentroPorDepartamento.lima.some(prov => p.includes(prov));

    if (d.includes("callao"))
      return provinciasDentroPorDepartamento.callao.some(prov => p.includes(prov));

    return false;
  };

  /* ============================================================
     🔹 Cambiar departamento → cargar provincias
  ============================================================ */
  departamentoSelect.addEventListener("change", () => {
    const dep = departamentoSelect.value;
    provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
    distritoSelect.innerHTML = '<option value="">Seleccione un distrito</option>';

    if (dep && ubicacionPeru[dep]) {
      for (const prov in ubicacionPeru[dep]) {
        const option = document.createElement("option");
        option.value = prov;
        option.textContent = prov;
        provinciaSelect.appendChild(option);
      }
    }
    actualizarBloquesEnvio();
  });

  /* ============================================================
     🔹 Cambiar provincia → cargar distritos y actualizar envío
  ============================================================ */
  provinciaSelect.addEventListener("change", () => {
    const dep = departamentoSelect.value;
    const prov = provinciaSelect.value;
    distritoSelect.innerHTML = '<option value="">Seleccione un distrito</option>';

    if (dep && prov && ubicacionPeru[dep]?.[prov]) {
      ubicacionPeru[dep][prov].forEach(d => {
        const option = document.createElement("option");
        option.value = d;
        option.textContent = d;
        distritoSelect.appendChild(option);
      });
    }
    actualizarBloquesEnvio();
  });

  /* ============================================================
     🔹 Mostrar / Ocultar bloques según ubicación
  ============================================================ */
  function actualizarBloquesEnvio() {
    const dep = departamentoSelect.value;
    const prov = provinciaSelect.value;

    if (!dep || !prov) {
      ocultarBloquesEnvio();
      return;
    }

    if (esDentroDeLima(dep, prov)) {
      mostrarBloque(bloqueLimaCallao);
    } else {
      mostrarBloque(bloqueOtrasProvincias);
    }
  }

  function ocultarBloquesEnvio() {
    bloqueLimaCallao?.classList.add("oculto");
    bloqueOtrasProvincias?.classList.add("oculto");
    bloqueRecojoTienda?.classList.add("oculto");
  }

  function mostrarBloque(bloque) {
    ocultarBloquesEnvio();
    bloque?.classList.remove("oculto");
  }

  /* ============================================================
     🔹 Escuchar botones “Delivery” / “Recojo en tienda”
  ============================================================ */
  const btnDelivery = document.getElementById("btn-delivery");
  const btnTienda = document.getElementById("btn-tienda");

  if (btnTienda) {
    btnTienda.addEventListener("click", () => {
      ocultarBloquesEnvio();
      bloqueRecojoTienda?.classList.remove("oculto"); // 🟢 Mostrar imágenes de tiendas
    });
  }

  if (btnDelivery) {
    btnDelivery.addEventListener("click", () => {
      ocultarBloquesEnvio();
      bloqueRecojoTienda?.classList.add("oculto");
      departamentoSelect.value = "";
      provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
      distritoSelect.innerHTML = '<option value="">Seleccione un distrito</option>';
    });
  }
}

/* ============================================================
   🔁 Función para reiniciar todo el formulario de ubicación
   (para cuando se finaliza la compra o se inicia otra)
============================================================ */
export function reiniciarUbicacion() {
  const departamentoSelect = document.getElementById("departamento");
  const provinciaSelect = document.getElementById("provincia");
  const distritoSelect = document.getElementById("distrito");
  const bloqueLimaCallao = document.getElementById("bloque-lima-callao");
  const bloqueOtrasProvincias = document.getElementById("bloque-otras-provincias");
  const bloqueRecojoTienda = document.getElementById("bloque-recojo-tienda");

  if (!departamentoSelect || !provinciaSelect || !distritoSelect) return;

  // Reiniciar selects
  departamentoSelect.innerHTML = '<option value="">Seleccione un departamento</option>';
  provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
  distritoSelect.innerHTML = '<option value="">Seleccione un distrito</option>';

  // Recargar departamentos
  for (const dep in ubicacionPeru) {
    const option = document.createElement("option");
    option.value = dep;
    option.textContent = dep;
    departamentoSelect.appendChild(option);
  }

  // Ocultar bloques
  bloqueLimaCallao?.classList.add("oculto");
  bloqueOtrasProvincias?.classList.add("oculto");
  bloqueRecojoTienda?.classList.add("oculto");
}

// --- Auto inicialización si el archivo se carga directamente ---
document.addEventListener("DOMContentLoaded", inicializarUbicacion);