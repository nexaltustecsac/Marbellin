export function renderResultados(resultados) {
    let contenedor = document.querySelector('.resultados-busqueda');

    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.classList.add('resultados-busqueda', 'oculto');
        document.querySelector('.buscador').appendChild(contenedor);
    }

    contenedor.innerHTML = '';

    if (!resultados || resultados.length === 0) {
        const sinResultados = document.createElement('div');
        sinResultados.classList.add('mensaje-sin-resultados');
        sinResultados.textContent = 'No se encontraron productos con ese nombre.';
        contenedor.appendChild(sinResultados);
        contenedor.classList.remove('oculto');
        return;
    }

    const path = window.location.pathname;
    const enIndex = path.endsWith('index.html') || path === '/';
    const enPages = path.includes('/pages/');

    resultados.forEach(producto => {
        const item = document.createElement('a');
        item.classList.add('item-busqueda');

        // Ajuste de ruta para producto-detalle.html
        if (enPages) {
            item.href = 'producto-detalle.html?id=' + producto.id;
        } else {
            item.href = 'pages/producto-detalle.html?id=' + producto.id;
        }

        // Primera imagen del producto
        let primeraImagen = (producto.imagenes && producto.imagenes.length > 0)
            ? producto.imagenes[0]
            : (producto.imagen || "");

        if (enIndex && primeraImagen.startsWith('../')) {
            primeraImagen = primeraImagen.replace('../', '');
        }

        item.innerHTML = `
            ${primeraImagen ? `<img src="${primeraImagen}" alt="${producto.nombre}" onerror="this.remove()" />` : ""}
            <div class="info-busqueda">
                <span class="nombre-producto">${producto.nombre}</span>
                <span class="precio-producto">S/ ${producto.precio.toFixed(2)} por docena</span>
            </div>
        `;

        contenedor.appendChild(item);
    });

    contenedor.classList.remove('oculto');
    agregarNavegacionTeclado(contenedor);
    cerrarAlClicFuera(contenedor);
}

export function ocultarResultados() {
    const contenedor = document.querySelector('.resultados-busqueda');
    if (contenedor) contenedor.classList.add('oculto');
}

// Navegación con teclado
function agregarNavegacionTeclado(contenedor) {
    const input = document.querySelector('.buscador input');
    let seleccionado = -1;

    input.addEventListener('keydown', e => {
        const items = Array.from(contenedor.querySelectorAll('.item-busqueda'));
        if (contenedor.classList.contains('oculto') || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            seleccionado = (seleccionado + 1) % items.length;
            resaltarItem(items, seleccionado);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            seleccionado = (seleccionado - 1 + items.length) % items.length;
            resaltarItem(items, seleccionado);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (seleccionado >= 0 && items[seleccionado]) {
                window.location.href = items[seleccionado].href;
            }
        }
    });
}

function resaltarItem(items, index) {
    items.forEach((item, i) => item.classList.toggle('seleccionado', i === index));
}

function cerrarAlClicFuera(contenedor) {
    document.addEventListener('click', e => {
        if (!contenedor.contains(e.target) && !document.querySelector('.buscador').contains(e.target)) {
            contenedor.classList.add('oculto');
        }
    });
}