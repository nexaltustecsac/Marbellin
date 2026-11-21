/* NAVEGACIÓN Y MENÚ ADMIN — inicialización temprana e independiente.
   Se registra antes de los controladores de inventario para que un error
   en una función secundaria no inutilice el menú ni los accesos del panel. */
(function () {
  'use strict';
  const paneles = Object.freeze({
    inicio: 'panelInicio',
    productos: 'panelProductos',
    pedidos: 'panelPedidos',
    cliente: 'panelClientes',
    estadisticas: 'panelEstadisticas',
    distribuidora: 'panelDistribuidora',
    mensajeria: 'panelMensajeria',
    configuracion: 'panelConfiguracion'
  });

  function cerrarMenuAdmin() {
    const sidebar = document.getElementById('sidebar');
    const boton = document.getElementById('menuToggle');
    const fondo = document.getElementById('sidebarBackdrop');
    if (sidebar) {
      sidebar.classList.remove('open');
      sidebar.setAttribute('aria-hidden', 'true');
    }
    if (fondo) {
      fondo.classList.remove('visible');
      fondo.setAttribute('aria-hidden', 'true');
    }
    if (boton) {
      boton.classList.remove('hide');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
    }
    document.body.classList.remove('admin-menu-open');
  }

  function abrirMenuAdmin() {
    const sidebar = document.getElementById('sidebar');
    const boton = document.getElementById('menuToggle');
    const fondo = document.getElementById('sidebarBackdrop');
    if (!sidebar) return;
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    if (fondo) {
      fondo.classList.add('visible');
      fondo.setAttribute('aria-hidden', 'false');
    }
    if (boton) {
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', 'Cerrar menú');
    }
    document.body.classList.add('admin-menu-open');
  }

  function mostrarPanelAdmin(nombre) {
    const id = paneles[nombre];
    if (!id) return false;
    const destino = document.getElementById(id);
    if (!destino) {
      console.error('[Marbellín] No se encontró el panel:', id);
      return false;
    }

    Object.entries(paneles).forEach(([clave, panelId]) => {
      const panel = document.getElementById(panelId);
      if (!panel) return;
      const activo = clave === nombre;
      panel.hidden = !activo;
      panel.style.display = activo ? '' : 'none';
      panel.setAttribute('aria-hidden', activo ? 'false' : 'true');
    });

    // La navegación cambia de panel sin aplicar estados visuales rosados
    // ni resaltar el enlace o el icono seleccionado.
    document.querySelectorAll('[data-panel]').forEach(enlace => {
      enlace.classList.remove('active');
      enlace.removeAttribute('aria-current');
    });

    document.body.dataset.panelActivo = nombre;
    cerrarMenuAdmin();
    window.dispatchEvent(new CustomEvent('marbellin:panel-cambiado', {
      detail: { panel: nombre, elemento: destino }
    }));
    return true;
  }

  window.mostrarPanel = mostrarPanelAdmin;
  window.abrirMenuAdmin = abrirMenuAdmin;
  window.cerrarMenuAdmin = cerrarMenuAdmin;

  function iniciarMenuYNavegacion() {
    const botonMenu = document.getElementById('menuToggle');
    const botonCerrar = document.getElementById('closeBtn');
    const fondo = document.getElementById('sidebarBackdrop');

    if (botonMenu && !botonMenu.dataset.menuVinculado) {
      botonMenu.dataset.menuVinculado = 'true';
      botonMenu.addEventListener('click', event => {
        event.preventDefault();
        if (document.getElementById('sidebar')?.classList.contains('open')) cerrarMenuAdmin();
        else abrirMenuAdmin();
      });
    }
    if (botonCerrar && !botonCerrar.dataset.menuVinculado) {
      botonCerrar.dataset.menuVinculado = 'true';
      botonCerrar.addEventListener('click', event => { event.preventDefault(); cerrarMenuAdmin(); });
    }
    if (fondo && !fondo.dataset.menuVinculado) {
      fondo.dataset.menuVinculado = 'true';
      fondo.addEventListener('click', cerrarMenuAdmin);
    }

    // Captura el clic antes que cualquier otro controlador o enlace heredado.
    if (!document.documentElement.dataset.navegacionAdminVinculada) {
      document.documentElement.dataset.navegacionAdminVinculada = 'true';
      document.addEventListener('click', event => {
        const elemento = event.target instanceof Element ? event.target : null;
        const enlace = elemento?.closest('[data-panel]');
        if (!enlace) return;
        const nombre = enlace.getAttribute('data-panel');
        if (nombre && mostrarPanelAdmin(nombre)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') cerrarMenuAdmin();
      });
    }

    const solicitado = new URLSearchParams(window.location.search).get('panel');
    mostrarPanelAdmin(solicitado && paneles[solicitado] ? solicitado : 'inicio');
    cerrarMenuAdmin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarMenuYNavegacion, { once: true });
  } else {
    iniciarMenuYNavegacion();
  }
})();

/* PANEL DASHBOARD — Marbellín: inventario, resumen, menú y navegación consolidados. */
// Guardar en localStorage
function guardarEnLocalStorage() {
  localStorage.setItem("inventario", JSON.stringify(productos));
  window.dispatchEvent(new CustomEvent("marbellin:inventario-actualizado"));
}

// Cargar desde localStorage
function cargarDesdeLocalStorage() {
  // Si existe inventario guardado, úsalo; si está dañado o no es una lista,
  // conserva el catálogo inicial para que el dashboard nunca quede vacío.
  try {
    const data = localStorage.getItem("inventario");
    if (!data) return false;
    const guardados = JSON.parse(data);
    if (!Array.isArray(guardados)) return false;
    productos = guardados.filter(item => item && typeof item === 'object' && item.id != null);
    return true;
  } catch (error) {
    console.warn('No se pudo leer el inventario guardado. Se usará el catálogo inicial.', error);
    return false;
  }
}

// Inventario inicial
let productos = [

{
    nombre: "Cachetero Dije",
    id: "1025",
    precio: 58.00,
    imagen: "imagenes/CACHETERO DIJE.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Cachetero Dije Estampado",
    id: "1052",
    precio: 58.00,
    imagen: "imagenes/CACHETERO DIJE ESTAMPADO.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Cachetero Corazon",
    id: "1027",
    precio: 65,
    imagen: "imagenes/CACHETEROCORAZON.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Cachetero Corazon Estampado",
    id: "1072",
    precio: 70,
    imagen: "imagenes/CACHETEROCORAZON ESTAMPADO.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Cachetero Blonda",
    id: "1029",
    precio: 64,
    imagen: "imagenes/CACHETERO BLONDA.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Cachetero Blonda Con Logo",
    id: "1028",
    precio: 70,
    imagen: "imagenes/CACHETERO BLONDA CON LOGO.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Semi Señorial Juvenil",
    id: "1048",
    precio: 73,
    imagen: "imagenes/SEMI SEÑORIAL JUVENIL.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Señorial Floreado",
    id: "1049",
    precio: 76,
    imagen: "imagenes/SEÑORIAL FLOREADO.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Encaje Atras",
    id: "1050",
    precio: 70,
    imagen: "imagenes/ENCAJE ATRAS.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Bikini Clasico",
    id: "1022",
    precio: 56,
    imagen: "imagenes/BIKINI CLASICO.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Bikini Animal Prink",
    id: "1020",
    precio: 61,
    imagen: "imagenes/BIKINI ANIMAL PRINK.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Bikini Estrella",
    id: "1019",
    precio: 63,
    imagen: "imagenes/BIKINI ESTRELLA.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Bikini Blonda",
    id: "1024",
    precio: 58,
    imagen: "imagenes/BIKINI BLONDA.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Bikini Pretina Ancha",
    id: "1033",
    precio: 62,
    imagen: "imagenes/BIKINI PRETINA ANCHA.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Bikini Blondita Completa",
    id: "1034",
    precio: 65.00,
    imagen: "imagenes/BIKINI MINI BLONDITA COMPLETA.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Semi Hilo Clasico",
    id: "1026",
    precio: 54,
    imagen: "imagenes/SEMI HILO CLASICO.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Semi Hilo Dije",
    id: "1031",
    precio: 55,
    imagen: "imagenes/SEMI HILO DIJE.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Semi Hilo Pretina Ancha",
    id: "1032",
    precio: 59,
    imagen: "imagenes/SEMI HILO PRETINA ANCHA.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Topsito Olimpico",
    id: "1003",
    precio: 67,
    imagen: "imagenes/TOPSITO OLIMPICO.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Topsito Con Tirante",
    id: "1002",
    precio: 67,
    imagen: "imagenes/TOPSITO CON TIRANTE.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  },
  {
    nombre: "Topsito Clasico",
    id: "1001",
    precio: 67,
    imagen: "imagenes/TOPSITO CLASICO.jpg",
    tallas: { S: 100, M: 100, L: 100, XL: 100 }
  }

];
cargarDesdeLocalStorage();

// Categorías del catálogo: tres categorías iniciales y nuevas categorías con ID consecutivo.
const CATEGORIAS_BASE = [
  { id: "CT0001", nombre: "Bikini" },
  { id: "CT0002", nombre: "Cachetero" },
  { id: "CT0003", nombre: "Semi hilo" }
];
function normalizarNombreCategoria(valor) { return String(valor || "").trim().replace(/\s+/g, " "); }
function obtenerCategoriasAdmin() {
  let guardadas = [];
  try { guardadas = JSON.parse(localStorage.getItem("marbellinCategorias") || "[]"); } catch (_) {}
  const salida = CATEGORIAS_BASE.map(c => ({...c}));
  if (Array.isArray(guardadas)) guardadas.forEach((item, index) => {
    const nombre = normalizarNombreCategoria(typeof item === "string" ? item : item?.nombre);
    if (!nombre) return;
    // No volver a incorporar las antiguas categorías retiradas (Topsito/Otros).
    if (["topsito", "otros"].includes(nombre.toLocaleLowerCase("es"))) return;
    const existente = salida.find(c => c.nombre.toLocaleLowerCase("es") === nombre.toLocaleLowerCase("es"));
    if (existente) return;
    const idGuardado = typeof item === "object" && item?.id ? String(item.id) : "";
    salida.push({ id: idGuardado || `CT${String(salida.length + 1).padStart(4, "0")}`, nombre });
  });
  return salida;
}
function guardarCategoriasAdmin(lista) {
  localStorage.setItem("marbellinCategorias", JSON.stringify(lista.map(c => ({ id: c.id, nombre: c.nombre }))));
}
function siguienteIdCategoria() {
  const maximo = obtenerCategoriasAdmin().reduce((max, c) => Math.max(max, Number(String(c.id).replace(/^CT/i, "")) || 0), 0);
  return `CT${String(maximo + 1).padStart(4, "0")}`;
}
function categoriaSugerida(nombre) {
  const n = String(nombre || "").toLowerCase();
  if (n.includes("cachetero")) return "Cachetero";
  if (n.includes("semi")) return "Semi hilo";
  if (n.includes("bikini") || n.includes("topsito")) return "Bikini";
  return "Semi hilo";
}
// Mantener todos los productos, pero normalizar categorías antiguas a las tres vigentes.
productos.forEach(p => {
  const actual = normalizarNombreCategoria(p.categoria);
  if (!["Bikini", "Cachetero", "Semi hilo"].some(c => c.toLocaleLowerCase("es") === actual.toLocaleLowerCase("es"))) {
    p.categoria = categoriaSugerida(p.nombre);
  }
});
function actualizarSelectCategorias() {
  const categorias = obtenerCategoriasAdmin();
  ["categoriaProducto", "categoriaEditar"].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const actual = select.value;
    select.innerHTML = '<option value="">Selecciona una categoría</option>' +
      categorias.map(c => `<option value="${escaparHTML(c.nombre)}">${escaparHTML(c.nombre)}</option>`).join("");
    if (categorias.some(c => c.nombre === actual)) select.value = actual;
  });
  const selectEditar = document.getElementById("categoriaSeleccionEditar");
  if (selectEditar) {
    const actual = selectEditar.value;
    selectEditar.innerHTML = categorias.map(c => `<option value="${escaparHTML(c.id)}">${escaparHTML(c.nombre)}</option>`).join("");
    if (categorias.some(c => c.id === actual)) selectEditar.value = actual;
  }
  const seleccion = categorias.find(c => c.id === selectEditar?.value) || categorias[0];
  const idEditar = document.getElementById("idCategoriaEditar");
  const nombreEditar = document.getElementById("nuevoNombreCategoria");
  if (idEditar && seleccion) idEditar.value = seleccion.id;
  if (nombreEditar && seleccion && !nombreEditar.dataset.touched) nombreEditar.value = seleccion.nombre;
  const idNuevo = document.getElementById("idNuevaCategoria");
  if (idNuevo) idNuevo.value = siguienteIdCategoria();
}
actualizarSelectCategorias();

// Referencias DOM
const tablaProductos = document.getElementById("tablaProductos");
const formularioProducto = document.getElementById("formularioProducto");
const formularioAgregarCantidad = document.getElementById("formularioAgregarCantidad");
const formularioEliminarCantidad = document.getElementById("formularioEliminarCantidad");
const formularioEliminarProducto = document.getElementById("formularioEliminarProducto");
const formularioEditarProducto = document.getElementById("formularioEditarProducto");
const inputImagen = document.getElementById("imagen");
const labelImagen = document.getElementById("labelImagen");

// Capitalizar nombre
function capitalizarNombre(nombre) {
  return nombre
    .toLowerCase()
    .split(' ')
    .filter(p => p.trim() !== "")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

// Activar label de imagen
inputImagen.addEventListener("change", () => {
  labelImagen.classList.toggle("active", inputImagen.files.length > 0);
});


// Renderizado del inventario con filas tipo tarjeta, manteniendo la tabla exportable.
function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caracter => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[caracter]));
}
function resolverImagenProducto(producto) {
  const actual=String(producto.imagen||'');
  if(actual.startsWith('data:image/') || /^https?:\/\//i.test(actual) || actual.startsWith('../../assets/')) return actual;
  const nombre=String(producto.nombre||'').toLocaleLowerCase('es');
  const mapa={
    'cachetero dije':'Cachetero/cachetero-dije-1.jpg',
    'cachetero dije estampado':'Cachetero/cachetero-dije-estampado-1.jpg',
    'cachetero corazon':'Cachetero/cachetero-corazon-1.jpg',
    'cachetero corazon estampado':'Cachetero/cachetero-corazon-estampado-1.jpg',
    'cachetero blonda':'Cachetero/cachetero-blonda-1.jpg',
    'cachetero blonda con logo':'Cachetero/cachetero-blonda-con-logo-1.jpg',
    'semi señorial juvenil':'Semihilo/semi-senorial-juvenil-1.jpg',
    'señorial floreado':'Otros/senorial-floreado-1.jpg',
    'encaje atras':'Otros/encaje-atras-1.jpg',
    'bikini clasico':'Bikini/bikini-clasico-1.jpg',
    'bikini animal prink':'Bikini/bikini-animal-prink-1.jpg',
    'bikini estrella':'Bikini/bikini-estrella-1.jpg',
    'bikini blonda':'Bikini/bikini-blonda-1.jpg',
    'bikini pretina ancha':'Bikini/bikini-pretina-ancha-1.jpg',
    'bikini blondita completa':'Bikini/bikini-mini-blondita-completa-1.jpg',
    'semi hilo clasico':'Semihilo/semi-hilo-clasico-1.jpg',
    'semi hilo dije':'Semihilo/semi-hilo-dije-1.jpg',
    'semi hilo pretina ancha':'Semihilo/semi-hilo-pretina-ancha-1.jpg',
    'topsito olimpico':'Topsito/topsito-olimpico-1.jpg',
    'topsito con tirante':'Topsito/topsito-con-tirante-1.jpg',
    'topsito clasico':'Topsito/topsito-clasico-1.jpg'
  };
  const key=nombre.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const normalized=Object.keys(mapa).find(k=>k.normalize('NFD').replace(/[\u0300-\u036f]/g,'')===key);
  return normalized ? `../../assets/categoria/${mapa[normalized]}` : actual;
}
function renderizarTabla(lista = productos) {
  if (!tablaProductos) return;
  tablaProductos.innerHTML = "";
  const cards = document.getElementById('productCards');
  if (cards) cards.innerHTML = "";
  const unidades = p => ['S','M','L','XL'].reduce((n,t) => n + (Number(p.tallas?.[t]) || 0), 0);
  const totalUnidades = productos.reduce((n,p) => n + unidades(p), 0);
  const agotados = productos.filter(p => unidades(p) === 0).length;
  const set = (id, value) => { const el=document.getElementById(id); if(el) el.textContent=String(value); };
  set('productsCount', productos.length); set('productsUnits', totalUnidades); set('productsOut', agotados);
  const vacio = document.getElementById('mensajeVacio');
  if (!lista.length) { if(vacio) vacio.textContent = productos.length ? 'No encontramos productos con esa búsqueda.' : 'Aún no hay productos registrados.'; return; }
  if(vacio) vacio.textContent = '';
  lista.forEach(prod => {
    const id=escaparHTML(prod.id), nombre=escaparHTML(prod.nombre), imagen=escaparHTML(resolverImagenProducto(prod));
    const stock=unidades(prod);
    const tallas=['S','M','L','XL'].map(t=>`<span class="product-size-pill"><small>${t}</small><b>${Number(prod.tallas?.[t])||0}</b></span>`).join('');
    const estado=stock===0?'<span class="product-stock-status is-empty">Stock por registrar</span>':stock<=5?'<span class="product-stock-status is-low">Pocas unidades</span>':'<span class="product-stock-status is-ready">Disponible</span>';
    if(cards){
      const card=document.createElement('article'); card.className='product-card';
      card.innerHTML=`<div class="product-card-media"><img src="${imagen}" alt="${nombre}" loading="lazy"><span class="product-card-id">ID ${id}</span><span class="product-card-stock">${stock} ${stock===1?'unidad':'unid.'}</span></div><div class="product-card-content"><span class="product-card-category">${escaparHTML(prod.categoria || categoriaSugerida(prod.nombre))}</span><h3>${nombre}</h3><div class="product-card-price-line"><span>Precio por docena</span><strong>S/ ${Number(prod.precio||0).toFixed(2)}</strong></div><div class="product-card-inventory-heading"><span>Existencias</span><b>${stock} ${stock===1?'unidad':'unid.'}</b></div><div class="product-card-sizes">${tallas}</div>${estado}<div class="product-card-actions"><button type="button" class="product-card-edit" data-edit-product="${id}"><span class="material-icons">edit</span> Editar</button><button type="button" class="product-card-delete" data-delete-product="${id}"><span class="material-icons">delete_outline</span> Eliminar</button></div></div>`;
      const cardImg=card.querySelector('img'); cardImg.addEventListener('error',()=>{card.classList.add('product-card-no-image');cardImg.style.display='none';}); cards.appendChild(card);
    }
    // Tabla auxiliar conservada para exportación PDF.
    const fila=document.createElement('tr');
    fila.innerHTML=`<td class="product-photo-cell"><div class="product-thumb"><img src="${imagen}" alt="${nombre}" loading="lazy"><span class="material-icons">image</span></div></td><td><span class="product-code">${id}</span></td><td class="product-name-cell"><strong>${nombre}</strong><small>Producto Marbellín</small></td>${['S','M','L','XL'].map(t=>`<td class="product-size-cell"><span class="size-stock"><small>${t}</small><b>${Number(prod.tallas?.[t])||0}</b></span></td>`).join('')}<td><strong class="product-price">S/ ${Number(prod.precio||0).toFixed(2)} / doc.</strong></td><td><div class="product-row-actions"><button type="button" class="product-edit" data-edit-product="${id}" aria-label="Editar ${nombre}"><span class="material-icons">edit</span></button><button type="button" class="product-delete" data-delete-product="${id}" aria-label="Eliminar ${nombre}"><span class="material-icons">delete_outline</span></button></div></td>`;
    const img=fila.querySelector('img'); img.addEventListener('error',()=>{img.style.display='none';fila.querySelector('.product-thumb').classList.add('no-image');}); tablaProductos.appendChild(fila);
  });
  actualizarEstadisticas?.();
}

// Buscar sin modificar los datos originales.
document.getElementById('productSearch')?.addEventListener('input', function(){
  const q=this.value.trim().toLocaleLowerCase('es');
  renderizarTabla(productos.filter(p => String(p.nombre).toLocaleLowerCase('es').includes(q) || String(p.id).toLocaleLowerCase('es').includes(q)));
});
// Herramientas rápidas: los formularios se abren solo cuando se solicitan.
function actualizarVistaFormularioProducto(formId = null) {
  const workspace = document.getElementById('panelProductos');
  const abierto = Boolean(formId);
  workspace?.classList.toggle('has-active-product-form', abierto);
  document.querySelectorAll('.products-forms-area .product-form-card').forEach(card => card.classList.toggle('is-open', card.id === formId));
  document.querySelectorAll('[data-form-toggle]').forEach(button => button.classList.toggle('is-active', button.dataset.formToggle === formId));
}
function abrirFormularioProducto(formId, shouldScroll = true) {
  const panel = document.getElementById(formId);
  if (!panel) return;
  actualizarVistaFormularioProducto(formId);
  if (shouldScroll) panel.scrollIntoView({behavior:'smooth', block:'center'});
}
document.querySelectorAll('[data-form-toggle]').forEach(button => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.formToggle);
    const isOpen = target?.classList.contains('is-open');
    if (isOpen) actualizarVistaFormularioProducto(null);
    else abrirFormularioProducto(button.dataset.formToggle);
  });
});

// Acciones directas de cada tarjeta.
document.getElementById('seccionPDF')?.addEventListener('click', async function(event){
  const edit=event.target.closest('[data-edit-product]');
  const del=event.target.closest('[data-delete-product]');
  if(edit){
    const prod=encontrarProductoPorId(edit.dataset.editProduct); if(!prod)return;
    document.getElementById('idEditar').value=prod.id;
    document.getElementById('nombreEditar').value=prod.nombre;
    document.getElementById('categoriaEditar').value=prod.categoria || categoriaSugerida(prod.nombre);
    document.getElementById('sEditar').value=prod.tallas?.S ?? 0;
    document.getElementById('mEditar').value=prod.tallas?.M ?? 0;
    document.getElementById('lEditar').value=prod.tallas?.L ?? 0;
    document.getElementById('xlEditar').value=prod.tallas?.XL ?? 0;
    document.getElementById('precioEditar').value=prod.precio ?? 0;
    abrirFormularioProducto('formEditProduct');
    document.getElementById('nombreEditar')?.focus({preventScroll:true});
  }
  if(del){
    const id=del.dataset.deleteProduct, prod=encontrarProductoPorId(id); if(!prod)return;
    const inputEliminar=document.getElementById('idEliminar_Producto');
    if(inputEliminar) inputEliminar.value=id;
    abrirFormularioProducto('formDeleteProduct');
  }
});

 // Exportar a PDF
async function exportarTablaAPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("landscape", "mm", "a4");

  const marginLeft = 8;
  const marginRight = 8;
  const marginTop = 12;
  const marginBottom = 12;

  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();

  const headerHeight = 18;
  const filasPorPagina = 4;
  const availableHeightForRows = pageHeight - marginTop - marginBottom - headerHeight;
  const rowHeight = availableHeightForRows / filasPorPagina;

  const anchoDisponible = pageWidth - marginLeft - marginRight;

  // Ajustamos columnas para juntar un poco más Nombre y tallas
  // Reduje el ancho de Nombre y de tallas para juntar
  const proporciones = [0.10, 0.06, 0.26, 0.11, 0.11, 0.11, 0.11, 0.14];
  const colWidths = proporciones.map(p => p * anchoDisponible);

  const tablaBody = document.querySelector("#tablaProductos");
  const filas = Array.from(tablaBody.querySelectorAll("tr"));

  function dibujarEncabezado(y) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    const headers = ["Imagen", "ID", "Nombre", "Talla S", "Talla M", "Talla L", "Talla XL", "Precio por docena"];
    let x = marginLeft;

    headers.forEach((header, i) => {
      // Centrar horizontalmente los textos del encabezado dentro de la columna
      const textWidth = pdf.getTextWidth(header);
      const posX = x + (colWidths[i] / 2) - (textWidth / 2);
      pdf.text(header, posX, y + 11);
      x += colWidths[i];
    });

    pdf.setDrawColor(0);
    pdf.setLineWidth(1);
    pdf.line(marginLeft, y + 14, pageWidth - marginRight, y + 14);
  }

  let y = marginTop;
  dibujarEncabezado(y);
  y += headerHeight;

  let filaContador = 0;

  for (const fila of filas) {
    if (filaContador >= filasPorPagina) {
      pdf.addPage();
      y = marginTop;
      dibujarEncabezado(y);
      y += headerHeight;
      filaContador = 0;
    }

    const celdas = fila.querySelectorAll("td");
    let x = marginLeft;

    // Imagen
    const imgSrc = celdas[0].querySelector("img")?.src || "";
    try {
      if (!imgSrc) throw new Error('Imagen no disponible');
      const imgData = await getImageData(imgSrc);
      const imgWidth = colWidths[0] * 0.7;
      const imgHeight = rowHeight * 0.7;
      pdf.addImage(imgData, "JPEG", x + (colWidths[0] - imgWidth) / 2, y + (rowHeight - imgHeight) / 2, imgWidth, imgHeight);
    } catch {}

    x += colWidths[0];

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");

    for (let i = 1; i < Math.min(celdas.length - 1, 8); i++) {
      let texto = celdas[i].textContent.trim();

      if (i === 2) { // columna Nombre
        // Dividir en dos líneas igual que antes
        const mitad = Math.floor(texto.length / 2);
        let splitPos = texto.indexOf(' ', mitad);
        if (splitPos === -1) splitPos = mitad;
        const linea1 = texto.substring(0, splitPos).trim();
        const linea2 = texto.substring(splitPos).trim();

        // Centrar horizontalmente cada línea dentro de la columna
        const anchoCol = colWidths[i];
        const textWidth1 = pdf.getTextWidth(linea1);
        const textWidth2 = pdf.getTextWidth(linea2);
        const posX1 = x + (anchoCol / 2) - (textWidth1 / 2);
        const posX2 = x + (anchoCol / 2) - (textWidth2 / 2);

        // Centrar verticalmente en la celda dividiendo rowHeight en dos líneas
        const linea1Y = y + (rowHeight / 2) - 4;
        const linea2Y = y + (rowHeight / 2) + 12;

        pdf.text(linea1, posX1, linea1Y);
        pdf.text(linea2, posX2, linea2Y);
      } else {
        // Para las otras columnas, centrar horizontal y verticalmente
        const anchoCol = colWidths[i];
        const textWidth = pdf.getTextWidth(texto);
        const posX = x + (anchoCol / 2) - (textWidth / 2);
        const posY = y + (rowHeight / 2) + 5;
        pdf.text(texto, posX, posY);
      }

      x += colWidths[i];
    }

    pdf.setDrawColor(200);
    pdf.setLineWidth(0.25);
    pdf.line(marginLeft, y + rowHeight, pageWidth - marginRight, y + rowHeight);

    y += rowHeight;
    filaContador++;
  }

  pdf.save("Inventio_Producto.pdf");
}

function getImageData(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = () => reject();
    img.src = url;
  });
}

// Buscar producto
function encontrarProductoPorId(id) {
  return productos.find(p => p.id === id);
}

// Validación básica
function validarCantidadYPrecio(...valores) {
  return valores.every(val => !isNaN(val) && val >= 0);
}

// Agregar producto
formularioProducto.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById('id').value.trim();
  const nombre = capitalizarNombre(document.getElementById('nombre').value.trim());
  const s = Number(document.getElementById('s').value);
  const m = Number(document.getElementById('m').value);
  const l = Number(document.getElementById('l').value);
  const xl = Number(document.getElementById('xl').value);
  const precio = Number(document.getElementById('precio').value);
  const categoria = document.getElementById('categoriaProducto').value.trim();

  if (!id || !nombre || !categoria || !validarCantidadYPrecio(s, m, l, xl, precio)) {
    Swal.fire({ icon: 'error', title: 'Datos inválidos', text: 'Completa todos los campos con valores válidos.', timer: 2500, showConfirmButton: false });
    return;
  }

  const nombreNormalizado = nombre.toLowerCase().replace(/\s+/g, "");
  const duplicado = productos.find(p =>
    p.id === id || p.nombre.toLowerCase().replace(/\s+/g, "") === nombreNormalizado
  );
  if (duplicado) {
    this.reset();
    labelImagen.classList.remove("active");
    Swal.fire({ icon: 'error', title: 'Registro duplicado', text: 'Ya existe un producto con este ID o nombre.', timer: 2500, showConfirmButton: false });
    return;
  }

  const archivoImagen = document.getElementById("imagen").files[0];
  if (!archivoImagen || !archivoImagen.type.startsWith('image/')) {
    this.reset();
    labelImagen.classList.remove("active");
    Swal.fire({ icon: 'error', title: 'Imagen inválida', text: 'Debes seleccionar un archivo de imagen válido.', timer: 2500, showConfirmButton: false });
    return;
  }

  const lector = new FileReader();
  lector.onload = function(event) {
    const imagenBase64 = event.target.result;
    productos.push({ id, nombre, categoria, precio, imagen: imagenBase64, tallas: { S: s, M: m, L: l, XL: xl } });
    guardarEnLocalStorage();
    renderizarTabla();
    formularioProducto.reset();
    labelImagen.classList.remove("active");
    Swal.fire({ icon: 'success', title: 'Producto registrado', text: 'El nuevo producto fue agregado correctamente.', timer: 2000, showConfirmButton: false });
  };
  lector.readAsDataURL(archivoImagen);
});

// Agregar cantidad
formularioAgregarCantidad.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = this.idAgregar.value.trim();
  const talla = this.tallaAgregar.value;
  const cantidad = Number(this.cantidadAgregar.value);

  if (!validarCantidadYPrecio(cantidad)) {
    Swal.fire({ icon: 'error', title: 'Cantidad inválida', text: 'Debes ingresar una cantidad positiva.', timer: 2500, showConfirmButton: false });
    return;
  }

  const prod = encontrarProductoPorId(id);
  if (!prod || !prod.tallas.hasOwnProperty(talla)) {
    this.reset();
    Swal.fire({ icon: 'error', title: 'Datos inválidos', text: 'No se encontró el producto o la talla es incorrecta.', timer: 2500, showConfirmButton: false });
    return;
  }

  prod.tallas[talla] += cantidad;
  guardarEnLocalStorage();
  renderizarTabla();
  this.reset();
  Swal.fire({ icon: 'success', title: 'Cantidad actualizada', text: 'Stock actualizado exitosamente.', timer: 2000, showConfirmButton: false });
});

// Eliminar cantidad
formularioEliminarCantidad.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = this.idEliminar.value.trim();
  const talla = this.tallaEliminar.value;
  const cantidad = Number(this.cantidadEliminar.value);

  if (!validarCantidadYPrecio(cantidad)) {
    Swal.fire({ icon: 'error', title: 'Cantidad inválida', text: 'Debes ingresar una cantidad válida.', timer: 2500, showConfirmButton: false });
    return;
  }

  const prod = encontrarProductoPorId(id);
  if (!prod || !prod.tallas.hasOwnProperty(talla)) {
    this.reset();
    Swal.fire({ icon: 'error', title: 'Datos inválidos', text: 'No se encontró el producto o la talla es incorrecta.', timer: 2500, showConfirmButton: false });
    return;
  }

  if (prod.tallas[talla] < cantidad) {
    this.reset();
    Swal.fire({ icon: 'warning', title: 'Stock insuficiente', text: 'No hay suficientes unidades disponibles para eliminar.', timer: 2500, showConfirmButton: false });
    return;
  }

  prod.tallas[talla] -= cantidad;
  guardarEnLocalStorage();
  renderizarTabla();
  this.reset();
  Swal.fire({ icon: 'success', title: 'Cantidad eliminada', text: 'La cantidad fue actualizada correctamente.', timer: 2000, showConfirmButton: false });
});

// Eliminar producto
formularioEliminarProducto.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = this.idEliminar_Producto.value.trim();
  const prodIndex = productos.findIndex(p => p.id === id);

  if (prodIndex === -1) {
    this.reset();
    Swal.fire({ icon: 'error', title: 'Producto no encontrado', text: 'No se halló ningún producto con el ID ingresado.', timer: 2500, showConfirmButton: false });
    return;
  }

  Swal.fire({
    title: `¿Deseas eliminar el producto con ID "${id}"?`,
    text: "Esta acción eliminará el producto permanentemente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      productos.splice(prodIndex, 1);
      guardarEnLocalStorage();
      renderizarTabla();
      formularioEliminarProducto.reset();
      Swal.fire({ icon: 'success', title: 'Producto eliminado', text: 'El producto fue eliminado del inventario.', timer: 2000, showConfirmButton: false });
    } else {
      formularioEliminarProducto.reset();
    }
  });
});

// Prellenar datos para edición
document.getElementById("idEditar").addEventListener("input", function() {
  const id = this.value.trim();
  const producto = encontrarProductoPorId(id);

  document.getElementById("nombreEditar").value = producto ? producto.nombre : "";
  document.getElementById("sEditar").value = producto ? producto.tallas.S : "";
  document.getElementById("mEditar").value = producto ? producto.tallas.M : "";
  document.getElementById("lEditar").value = producto ? producto.tallas.L : "";
  document.getElementById("xlEditar").value = producto ? producto.tallas.XL : "";
  document.getElementById("precioEditar").value = producto ? producto.precio : "";
  document.getElementById("categoriaEditar").value = producto ? (producto.categoria || categoriaSugerida(producto.nombre)) : "";
});

// Guardar edición
formularioEditarProducto.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("idEditar").value.trim();
  const nombreNuevo = capitalizarNombre(document.getElementById("nombreEditar").value.trim());
  const s = document.getElementById("sEditar").value;
  const m = document.getElementById("mEditar").value;
  const l = document.getElementById("lEditar").value;
  const xl = document.getElementById("xlEditar").value;
  const precio = document.getElementById("precioEditar").value;
  const categoria = document.getElementById("categoriaEditar").value;

  const producto = encontrarProductoPorId(id);
  if (!producto) {
    this.reset();
    Swal.fire({ icon: 'error', title: 'Producto no encontrado', text: 'No se halló ningún producto con ese ID.', timer: 2500, showConfirmButton: false });
    return;
  }

  const nombreNormalizado = nombreNuevo.toLowerCase().replace(/\s+/g, "");
  const duplicado = productos.find(p =>
    p.id !== id && p.nombre.toLowerCase().replace(/\s+/g, "") === nombreNormalizado
  );
  if (duplicado) {
    this.reset();
    Swal.fire({ icon: 'error', title: 'Nombre en uso', text: 'Ya existe otro producto con este nombre.', timer: 2500, showConfirmButton: false });
    return;
  }

  if (nombreNuevo) producto.nombre = nombreNuevo;
  if (categoria) producto.categoria = categoria;
  if (s !== "" && validarCantidadYPrecio(Number(s))) producto.tallas.S = parseInt(s);
  if (m !== "" && validarCantidadYPrecio(Number(m))) producto.tallas.M = parseInt(m);
  if (l !== "" && validarCantidadYPrecio(Number(l))) producto.tallas.L = parseInt(l);
  if (xl !== "" && validarCantidadYPrecio(Number(xl))) producto.tallas.XL = parseInt(xl);
  if (precio !== "" && validarCantidadYPrecio(Number(precio))) producto.precio = parseFloat(precio);

  guardarEnLocalStorage();
  renderizarTabla();
  formularioEditarProducto.reset();
  Swal.fire({ icon: 'success', title: 'Producto actualizado', text: 'La información fue modificada correctamente.', timer: 2000, showConfirmButton: false });
});

// Crear categorías con ID automático consecutivo.
document.getElementById("formularioCategoria")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const input = document.getElementById("nombreCategoria");
  const nombre = normalizarNombreCategoria(input.value);
  if (!nombre) return;
  const categorias = obtenerCategoriasAdmin();
  if (categorias.some(c => c.nombre.toLocaleLowerCase("es") === nombre.toLocaleLowerCase("es"))) {
    Swal.fire({ icon:"info", title:"Categoría existente", text:"Ese nombre ya está registrado." });
    return;
  }
  const nueva = { id: siguienteIdCategoria(), nombre };
  categorias.push(nueva);
  guardarCategoriasAdmin(categorias);
  actualizarSelectCategorias();
  const selectProducto = document.getElementById("categoriaProducto");
  if (selectProducto) selectProducto.value = nombre;
  this.reset();
  actualizarSelectCategorias();
  Swal.fire({ icon:"success", title:"Categoría creada", text:`${nueva.id} · ${nombre} ya está disponible.`, timer:2000, showConfirmButton:false });
});

// Mostrar/editar nombre de categoría: el ID es permanente y de solo lectura.
document.getElementById("btnMostrarEditarCategoria")?.addEventListener("click", function() {
  const form = document.getElementById("formularioEditarCategoria");
  form.hidden = !form.hidden;
  if (!form.hidden) actualizarSelectCategorias();
});
document.getElementById("categoriaSeleccionEditar")?.addEventListener("change", function() {
  const categoria = obtenerCategoriasAdmin().find(c => c.id === this.value);
  if (!categoria) return;
  document.getElementById("idCategoriaEditar").value = categoria.id;
  const nombre = document.getElementById("nuevoNombreCategoria");
  nombre.value = categoria.nombre;
  nombre.dataset.touched = "";
});
document.getElementById("nuevoNombreCategoria")?.addEventListener("input", function(){ this.dataset.touched = "1"; });
document.getElementById("formularioEditarCategoria")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("idCategoriaEditar").value;
  const nuevoNombre = normalizarNombreCategoria(document.getElementById("nuevoNombreCategoria").value);
  const categorias = obtenerCategoriasAdmin();
  const categoria = categorias.find(c => c.id === id);
  if (!categoria || !nuevoNombre) return;
  if (categorias.some(c => c.id !== id && c.nombre.toLocaleLowerCase("es") === nuevoNombre.toLocaleLowerCase("es"))) {
    Swal.fire({ icon:"info", title:"Nombre existente", text:"Otra categoría ya utiliza ese nombre." });
    return;
  }
  const nombreAnterior = categoria.nombre;
  categoria.nombre = nuevoNombre;
  productos.forEach(p => { if (String(p.categoria || "").toLocaleLowerCase("es") === nombreAnterior.toLocaleLowerCase("es")) p.categoria = nuevoNombre; });
  guardarCategoriasAdmin(categorias);
  guardarEnLocalStorage();
  actualizarSelectCategorias();
  renderizarTabla();
  document.getElementById("nuevoNombreCategoria").dataset.touched = "";
  Swal.fire({ icon:"success", title:"Categoría actualizada", text:`El ID ${id} se conservó y el nombre fue actualizado.`, timer:2000, showConfirmButton:false });
});

// Inicializar tabla
actualizarSelectCategorias();
renderizarTabla();





  

/* Resumen y métricas de Marbellín */

(function(){
  'use strict';
  function getInventory(){
    // El resumen lee la misma fuente que el catálogo y tolera registros incompletos.
    try {
      if (typeof productos !== 'undefined' && Array.isArray(productos)) {
        return productos.filter(product => product && typeof product === 'object');
      }
    } catch (error) {
      console.warn('No se pudo calcular el inventario del dashboard.', error);
    }
    return [];
  }
  function refreshDashboard(){
    const products=getInventory();
    const sizes=['S','M','L','XL'];
    const totals=Object.fromEntries(sizes.map(size=>[size,0]));
    let units=0,low=0;
    let threshold=3;
    try{const prefs=JSON.parse(localStorage.getItem('marbellinAdminSettings')||'{}');threshold=Number(prefs.stockThreshold??3);}catch(e){}
    products.forEach(product=>{
      let productUnits=0;
      sizes.forEach(size=>{
        const raw = Number(product.tallas?.[size]);
        const amount = Number.isFinite(raw) ? Math.max(0, raw) : 0;
        totals[size] += amount;
        productUnits += amount;
      });
      units += productUnits;
      if(productUnits>0 && productUnits<=threshold) low++;
    });
    const put=(id,value)=>{const node=document.getElementById(id);if(node)node.textContent=Number(value).toLocaleString('es-PE');};
    put('homeProducts',products.length);put('homeUnits',units);put('homeLowStock',low);
    const max=Math.max(1,...Object.values(totals));
    sizes.forEach(size=>{
      put('val'+size,totals[size]);
      const bar=document.getElementById('bar'+size);
      if(bar)bar.style.width=(totals[size]/max*100)+'%';
    });
    const name=(()=>{try{return localStorage.getItem('marbellinAdminName')||'Administrador';}catch(e){return 'Administrador';}})();
    const welcome=document.getElementById('welcomeAdminName');if(welcome)welcome.textContent=name;
  }
  function init(){
    refreshDashboard();
    // Reintenta tras cargar la vista inicial para cubrir navegadores móviles
    // que terminan de construir el DOM después de ejecutar scripts diferidos.
    requestAnimationFrame(refreshDashboard);
    window.setTimeout(refreshDashboard, 250);
    const search=document.getElementById('dashboardSearch');
    search?.addEventListener('input',()=>{
      const query=search.value.trim().toLocaleLowerCase('es');
      document.querySelectorAll('.quick-link').forEach(link=>{link.style.display=!query||link.textContent.toLocaleLowerCase('es').includes(query)?'flex':'none';});
    });
    const name=document.getElementById('adminNameInput');
    name?.addEventListener('input',refreshDashboard);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshDashboard();});
    window.addEventListener('storage',refreshDashboard);
    window.addEventListener('marbellin:inventario-actualizado',refreshDashboard);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
