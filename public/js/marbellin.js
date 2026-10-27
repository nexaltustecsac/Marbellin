(() => {
  const KEY = 'marbellin-cart';
  const readCart = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } };
  const saveCart = cart => { localStorage.setItem(KEY, JSON.stringify(cart)); renderCart(); };
  const money = value => 'S/ ' + Number(value || 0).toFixed(2);
  function renderCart() {
    const cart = readCart();
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0));
    document.querySelectorAll('[data-cart-subtotal]').forEach(el => el.textContent = money(cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0)));
    document.querySelectorAll('[data-cart-items]').forEach(container => {
      if (!cart.length) { container.innerHTML = '<p class="muted">Tu carrito está vacío. <a href="/productos">Explora el catálogo</a>.</p>'; return; }
      container.replaceChildren();
      cart.forEach(item => {
        const row = document.createElement('div'); row.className = 'cart-item';
        const info = document.createElement('div'); const name = document.createElement('strong'); name.textContent = item.name;
        const details = document.createElement('small'); details.textContent = item.qty + ' × ' + money(item.price);
        info.append(name, details);
        const actions = document.createElement('div'); actions.append(document.createTextNode(money(item.price * item.qty) + ' '));
        const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Quitar'; remove.setAttribute('aria-label', 'Quitar ' + item.name);
        remove.addEventListener('click', () => saveCart(readCart().filter(p => String(p.id) !== String(item.id))));
        actions.append(remove); row.append(info, actions); container.append(row);
      });
    });
  }
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add-cart]');
    if (add) {
      const id = add.dataset.id, name = add.dataset.name, price = Number(add.dataset.price);
      if (!id || !name || !Number.isFinite(price) || price < 0) return;
      const cart = readCart(), found = cart.find(item => String(item.id) === String(id));
      if (found) found.qty += 1; else cart.push({ id, name, price, qty: 1 });
      saveCart(cart);
      const original = add.textContent; add.textContent = 'Añadido ✓'; add.setAttribute('aria-live','polite');
      setTimeout(() => { if (add.isConnected) add.textContent = original; }, 1400);
    }
    if (event.target.closest('[data-clear-cart]')) saveCart([]);
  });
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle'), nav = document.querySelector('.nav');
    if (toggle && nav) toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? '×' : '☰';
    });
    renderCart();
  });
})();