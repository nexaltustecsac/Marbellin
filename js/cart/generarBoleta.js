export async function generarBoletaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // ==========================
  // 🔢 NÚMERO DE BOLETA Y FECHA
  // ==========================
  const numeroBoleta = `B001-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const fecha = new Date().toLocaleDateString();

  // ==========================
  // 🌸 LOGO SUPERIOR
  // ==========================
  const logoPath = "../assets/icons/logo-marbellin.png";
  const logoBase64 = await new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logoPath;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
  });

  if (logoBase64) doc.addImage(logoBase64, "PNG", 15, 8, 35, 35);

  // ==========================
  // 🧾 CABECERA
  // ==========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MARBELLÍN", 105, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Av. Perú 123 - La Victoria - Lima", 105, 26, { align: "center" });
  doc.text("Tel: 922 886 724", 105, 31, { align: "center" });
  doc.text("Email: contacto@marbellin.com", 105, 36, { align: "center" });
  doc.text("Web: www.marbellin.com", 105, 41, { align: "center" });

  // Recuadro derecho
  doc.setFont("helvetica", "bold");
  doc.rect(150, 10, 50, 25);
  doc.text("R.U.C. 20612345678", 175, 17, { align: "center" });
  doc.text("BOLETA DE VENTA", 175, 23, { align: "center" });
  doc.text("ELECTRÓNICA", 175, 28, { align: "center" });
  doc.text(`N° ${numeroBoleta}`, 175, 33, { align: "center" });

  // ==========================
  // 👩 DATOS DEL CLIENTE
  // ==========================
  const nombres = document.getElementById("nombres")?.value || "";
  const apellidos = document.getElementById("apellidos")?.value || "";
  const correo = document.getElementById("correo")?.value || "";
  const dni = document.getElementById("dni")?.value || "";
  const telefono = document.getElementById("telefono")?.value || "";

  const modoEntrega = document.getElementById("btn-delivery")?.classList.contains("activo")
    ? "Delivery"
    : "Recojo en tienda";

  const departamento = document.getElementById("departamento")?.value || "";
  const provincia = document.getElementById("provincia")?.value || "";
  const distrito = document.getElementById("distrito")?.value || "";
  const direccion = document.getElementById("direccion")?.value || "";
  const referencia = document.getElementById("referencia")?.value || "";
  const tipoEnvio = document.getElementById("tipoEnvio")?.value || "";
  const direccionReal = document.getElementById("direccionReal")?.value || "";
  const metodoPago = document.querySelector('input[name="pago"]:checked')?.value || "No especificado";

  let y = 60;
  doc.setFont("helvetica", "bold");
  doc.text("Datos del cliente", 10, y);
  doc.line(10, y + 1, 200, y + 1);

  doc.setFont("helvetica", "normal");
  y += 7;
  doc.text(`Fecha de emisión: ${fecha}`, 10, y);
  y += 6;
  doc.text(`DNI: ${dni}`, 10, y);
  y += 6;
  doc.text(`Nombre: ${nombres} ${apellidos}`, 10, y);
  y += 6;
  doc.text(`Correo: ${correo}`, 10, y);
  y += 6;
  doc.text(`Teléfono: ${telefono}`, 10, y);
  y += 6;
  doc.text(`Método de pago: ${metodoPago}`, 10, y);

  // ==========================
  // 🏠 DIRECCIÓN DE ENTREGA ACTUALIZADA
  // ==========================
  if (modoEntrega === "Delivery") {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Dirección de entrega", 10, y);
    doc.line(10, y + 1, 200, y + 1);

    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Departamento: ${departamento}`, 10, y);
    y += 6;
    doc.text(`Provincia: ${provincia}`, 10, y);
    y += 6;
    doc.text(`Distrito: ${distrito}`, 10, y);
    y += 6;

    if (
      (departamento === "Lima" && provincia === "Lima Metropolitana") ||
      (departamento === "Callao" && provincia === "Prov. Const. del Callao")
    ) {
      doc.text(`Dirección: ${direccion}`, 10, y);
      if (referencia) {
        y += 6;
        doc.text(`Referencia: ${referencia}`, 10, y);
      }
    } else {
      doc.text(`Tipo de envío: ${tipoEnvio}`, 10, y);
      y += 6;
      doc.text(`Dirección real: ${direccionReal}`, 10, y);
    }
  } else {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Modo de entrega", 10, y);
    doc.line(10, y + 1, 200, y + 1);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Recojo en tienda principal (Av. Perú 123 - La Victoria)", 10, y);
  }

  // ==========================
  // 🛍️ DETALLE DE PRODUCTOS
  // ==========================
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Detalle de productos", 10, y);
  doc.line(10, y + 1, 200, y + 1);

  y += 7;
  doc.setFontSize(8.5);
  doc.text("Docenas", 10, y);
  doc.text("Descripción", 25, y);
  doc.text("P. Docena", 175, y, { align: "right" });
  doc.text("Total", 200, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  let subtotal = 0;
  y += 5;

  carrito.forEach((item) => {
    const totalProducto = item.precio * item.cantidad;
    subtotal += totalProducto;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    const descripcion = doc.splitTextToSize(item.nombre, 120);
    doc.text(`${item.cantidad}`, 10, y);
    doc.text(descripcion, 25, y);
    doc.text(`S/.${item.precio.toFixed(2)}`, 175, y, { align: "right" });
    doc.text(`S/.${totalProducto.toFixed(2)}`, 200, y, { align: "right" });
    y += 4 + descripcion.length * 3.2;
  });

  const totalFinal = subtotal;

  // ==========================
  // 💰 SUBTOTAL Y TOTAL
  // ==========================
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Subtotal:", 150, y);
  doc.text(`S/.${subtotal.toFixed(2)}`, 200, y, { align: "right" });

  y += 6;
  doc.text("Total:", 150, y);
  doc.text(`S/.${totalFinal.toFixed(2)}`, 200, y, { align: "right" });

  // ==========================
  // 📱 QR
  // ==========================
  const qrData = `
Boleta: ${numeroBoleta}
Cliente: ${nombres} ${apellidos}
Total: S/.${totalFinal.toFixed(2)}
Fecha: ${fecha}
Marbellín 💖
  `.trim();

  const qr = new QRious({ value: qrData, size: 100 });
  const qrBase64 = qr.toDataURL("image/png");

  const qrY = y + 10 > 240 ? 235 : y + 10;
  doc.addImage(qrBase64, "PNG", 160, qrY, 35, 35);

  // ==========================
  // 💾 GUARDAR PDF
  // ==========================
  doc.save(`boleta-${numeroBoleta}.pdf`);
}