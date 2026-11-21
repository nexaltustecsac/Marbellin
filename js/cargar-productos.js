import { productos } from "./productos.js";

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-productos");

    // Leer parámetros
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("cat");
    const terminoBusqueda = params.get("buscar")?.toLowerCase() || "";

    // Filtrar por categoría si existe
    let productosFiltrados = categoria
        ? productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase())
        : productos;

    // Filtrar por búsqueda parcial si existe término
    if (terminoBusqueda) {
        productosFiltrados = productosFiltrados.filter(p =>
            p.nombre.toLowerCase().includes(terminoBusqueda)
        );
    }

    // Mostrar mensaje si no hay resultados
    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = `
            <p style="text-align: center; font-weight: bold;">
                No se encontraron productos para esta búsqueda.
            </p>`;
        return;
    }

    // Renderizar productos
    productosFiltrados.forEach(producto => {
        const a = document.createElement("a");
        a.href = `producto-detalle.html?id=${producto.id}`;
        a.classList.add("producto");

        const imagenPrincipal = producto.imagen 
            || (producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : "");

        a.innerHTML = `
            ${imagenPrincipal ? `<img src="${imagenPrincipal}" alt="${producto.nombre}" onerror="this.remove()">` : ""}
            <h3>${producto.nombre}</h3>
            <p class="precio-unitario">S/${producto.precio.toFixed(2)} <span>por docena</span></p>
        `;

        contenedor.appendChild(a);
    });
});