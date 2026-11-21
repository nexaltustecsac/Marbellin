import { obtenerCarrito, guardarCarrito } from "./carritoStorage.js";

export function mostrarCarritoMini() {
    const miniCarrito = document.getElementById("mini-carrito");
    const listaCarrito = document.querySelector(".lista-carrito");
    const subtotalGeneralDiv = document.getElementById("subtotal-general");
    const btnPagar = document.querySelector(".btn-ir-a-pagar");
    const btnVerCarrito = document.querySelector(".btn-ver-carrito");
    const btnContinuar = document.querySelector(".btn-continuar");
    const abrirCarritoBtn = document.getElementById("abrir-carrito");
    const cerrarCarritoBtn = document.getElementById("cerrar-carrito");

    if (!miniCarrito || !listaCarrito || !subtotalGeneralDiv || !abrirCarritoBtn) return;

    const enIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    // ---------------- Funciones ----------------
    const calcularSubtotal = (carrito) =>
        carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

    const actualizarSubtotal = (carrito) => {
        const subtotal = calcularSubtotal(carrito);
        subtotalGeneralDiv.textContent = `Subtotal: S/. ${subtotal.toFixed(2)}`;
    };

    const renderizarProductos = () => {
        const carrito = obtenerCarrito();
        listaCarrito.innerHTML = "";

        if (carrito.length === 0) {
            listaCarrito.innerHTML = "<li class='item-vacio'>Carrito vacío</li>";
        } else {
            carrito.forEach((producto, index) => {
                const rutaImagen = enIndex ? producto.imagen.replace("../", "") : producto.imagen;
                const subtotalProducto = producto.precio * producto.cantidad;

                const li = document.createElement("li");
                li.classList.add("item-carrito");

                li.innerHTML = `
                    <div class="fila-principal">
                        <div class="imagen">
                            <img src="${rutaImagen}" alt="${producto.nombre}">
                        </div>
                        <div class="nombre">${producto.nombre}</div>
                    </div>
                    <div class="fila-secundaria">
                        <div class="cantidad">Docenas: ${producto.cantidad}</div>
                        <div class="precio">Subtotal: S/. ${subtotalProducto.toFixed(2)}</div>
                        <div class="eliminar">
                            <button class="btn-eliminar" data-index="${index}" title="Eliminar producto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#880e4f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                    <path d="M10 11v6"></path>
                                    <path d="M14 11v6"></path>
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
                listaCarrito.appendChild(li);
            });

            actualizarSubtotal(carrito);
            configurarEliminar();
        }
    };

    const configurarEliminar = () => {
        const btnEliminar = listaCarrito.querySelectorAll(".btn-eliminar");
        btnEliminar.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute("data-index"));
                const carrito = obtenerCarrito();
                carrito.splice(idx, 1);
                guardarCarrito(carrito);
                renderizarProductos();
            });
        });
    };

    const abrirMiniCarrito = () => {
        miniCarrito.classList.add("mostrar");
        document.body.style.overflow = "hidden";
        renderizarProductos();
    };

    const cerrarMiniCarrito = () => {
        miniCarrito.classList.remove("mostrar");
        document.body.style.overflow = "";
    };

    // ---------------- Eventos ----------------
    abrirCarritoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        miniCarrito.classList.toggle("mostrar");
        document.body.style.overflow = miniCarrito.classList.contains("mostrar") ? "hidden" : "";
        renderizarProductos();
    });

    if (cerrarCarritoBtn) {
        cerrarCarritoBtn.addEventListener("click", cerrarMiniCarrito);
    }

    window.addEventListener("click", (e) => {
        if (
            miniCarrito.classList.contains("mostrar") &&
            !miniCarrito.contains(e.target) &&
            !abrirCarritoBtn.contains(e.target)
        ) {
            cerrarMiniCarrito();
        }
    });

    const basePath = window.location.pathname.includes("/pages/") ? "" : "pages/";

    if (btnVerCarrito) btnVerCarrito.addEventListener("click", () => window.location.href = `${basePath}resumen-pedido.html`);
    if (btnContinuar) btnContinuar.addEventListener("click", () => {
        cerrarMiniCarrito();
        window.location.href = `${basePath}productos.html`;
    });
    if (btnPagar) btnPagar.addEventListener("click", () => window.location.href = `${basePath}checkout.html`);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) cerrarMiniCarrito();
    });

    // Render inicial
    renderizarProductos();
}