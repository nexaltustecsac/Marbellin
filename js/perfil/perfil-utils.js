// Capitalizar cada palabra
export const capitalizarPalabras = texto => {
  if (!texto) return '';
  let limpio = texto.replace(/[0-9()\/\-\+_&=]/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim()
                   .toLowerCase();

  // Diccionario básico de nombres comunes (se puede ampliar)
  const nombres = [
    "jean","enrique","jesus","carlos","luis","miguel",
    "maria","jose","antonio","fernanda","alejandro","alexander",
    "ana","flor","roberto","anderson"
  ];

  // Si ya tiene espacios → solo capitalizar
  if (/\s/.test(limpio)) {
    return limpio.split(' ')
      .filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  let resultado = [];
  let restante = limpio;

  while (restante.length > 0) {
    let encontrado = null;

    // Buscar el nombre más largo que haga match al inicio
    for (let n of nombres.sort((a, b) => b.length - a.length)) {
      if (restante.startsWith(n)) {
        encontrado = n;
        break;
      }
    }

    if (encontrado) {
      resultado.push(encontrado);
      restante = restante.slice(encontrado.length);
    } else {
      // Si no encuentra match → corta una parte mínima
      resultado.push(restante);
      break;
    }
  }

  return resultado
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
};

// Llenar <select> con opciones
export const llenarSelect = (selectEl, opciones = [], valor = '') => {
  if (!selectEl) return;

  let placeholder = 'Seleccione';
  if (selectEl.id.includes('departamento')) placeholder = 'Seleccione departamento';
  else if (selectEl.id.includes('provincia')) placeholder = 'Seleccione provincia';
  else if (selectEl.id.includes('distrito')) placeholder = 'Seleccione distrito';

  selectEl.innerHTML = `<option value="">${placeholder}</option>`;

  opciones.forEach(op => {
    const option = document.createElement('option');
    option.value = op;
    option.textContent = op;
    if (op === valor) option.selected = true;
    selectEl.appendChild(option);
  });
};