// Rutas ajustadas según tu estructura actual
import { productos } from '../productos.js'; // sube un nivel desde /js/search/ a /js/
import { renderResultados, ocultarResultados } from './render-resultados.js'; // mismo nivel

document.addEventListener('DOMContentLoaded', () => {
    const inputBusqueda = document.querySelector('.buscador input');
    const botonBuscar = document.querySelector('.boton-buscar');
    let seleccionado = -1;

    // ==========================
    // Recuperar término desde URL
    // ==========================
    const params = new URLSearchParams(window.location.search);
    const terminoURL = params.get('buscar');
    if (terminoURL) {
        inputBusqueda.value = terminoURL;
        buscarResultados(terminoURL); // opcional, despliega resultados al cargar
    }

    // ==========================
    // Búsqueda parcial para desplegable
    // ==========================
    function buscarResultados(termino) {
        termino = termino.trim().toLowerCase();
        if (!termino) {
            ocultarResultados();
            return [];
        }
        const resultados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(termino)
        );
        renderResultados(resultados); // muestra desplegable
        return resultados;
    }

    // ==========================
    // Input: búsqueda en vivo
    // ==========================
    inputBusqueda.addEventListener('input', () => {
        buscarResultados(inputBusqueda.value);
        seleccionado = -1;
    });

    // ==========================
    // Botón: redirige a productos.html
    // ==========================
    botonBuscar.addEventListener('click', () => {
        const termino = inputBusqueda.value.trim();
        const desdeIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
        const destino = desdeIndex ? 'pages/productos.html' : 'productos.html';

        ocultarResultados(); // Oculta desplegable antes de redirigir
        if (termino) {
            window.location.href = `${destino}?buscar=${encodeURIComponent(termino)}`;
        } else {
            window.location.href = destino;
        }
    });

    // ==========================
    // Enter en input
    // ==========================
    inputBusqueda.addEventListener('keydown', e => {
        const contenedor = document.querySelector('.resultados-busqueda');
        const items = contenedor ? Array.from(contenedor.querySelectorAll('.item-busqueda')) : [];

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (items.length === 0) return;
            seleccionado = (seleccionado + 1) % items.length;
            resaltarItem(items, seleccionado);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (items.length === 0) return;
            seleccionado = (seleccionado - 1 + items.length) % items.length;
            resaltarItem(items, seleccionado);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (seleccionado >= 0 && items[seleccionado]) {
                ocultarResultados(); // Oculta desplegable antes de ir al producto
                window.location.href = items[seleccionado].href;
            } else {
                botonBuscar.click();
            }
        }
    });

    // ==========================
    // Resaltar item en el desplegable
    // ==========================
    function resaltarItem(items, index) {
        items.forEach((item, i) => item.classList.toggle('seleccionado', i === index));
        if (items[index]) {
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    // ==========================
    // Ocultar resultados al hacer clic fuera
    // ==========================
    document.addEventListener('click', e => {
        const contenedor = document.querySelector('.resultados-busqueda');
        if (!contenedor.contains(e.target) && !document.querySelector('.buscador').contains(e.target)) {
            ocultarResultados();
            seleccionado = -1;
        }
    });

    // ==========================
    // Ocultar desplegable al inicio
    // ==========================
    ocultarResultados();
});