// ----------------------------
// Utility: Notifikasi
// ----------------------------
function showNotification(message, duration = 3000) {
  const notif = document.getElementById('notification');
  if (!notif) return;

  notif.textContent = message;
  notif.style.display = 'block';
  setTimeout(() => {
    notif.style.display = 'none';
  }, duration);
}

// ----------------------------
// Local Storage Cart Handler
// ----------------------------
function getCartItems() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCartItems(items) {
  localStorage.setItem('cart', JSON.stringify(items));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCartItems();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCartItems(cart);
  showNotification('Produk ditambahkan ke keranjang!');
}

// ----------------------------
// Update Cart Count in Navbar
// ----------------------------
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const cartItems = getCartItems();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  cartCountElements.forEach(el => {
    el.textContent = totalQuantity;
  });
}

// ----------------------------
// Render Products (for index.html)
// ----------------------------
function renderProducts() {
  const products = [
    { id: 1, name: 'Kaos HITAM HIMTI', price: 50000, image: 'img/kaos.jpg' },
    { id: 2, name: 'Topi HIMTI', price: 30000, image: 'img/topi.jpg' },
    { id: 3, name: 'Stiker HIMTI', price: 10000, image: 'img/stiker.jpg' }
  ];

  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Rp ${product.price.toLocaleString()}</p>
      <button class="add-to-cart-btn">Tambah ke Keranjang</button>
    `;

    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      addToCart(product);
    });

    container.appendChild(card);
  });
}

// ----------------------------
// Render Cart Items (for cart.html)
// ----------------------------
function renderCartItems() {
  const tableBody = document.querySelector('#cart-table tbody');
  const totalDiv = document.getElementById('cart-total');
  const cart = getCartItems();

  if (!tableBody || !totalDiv) return;

  tableBody.innerHTML = '';
  totalDiv.textContent = '';

  if (cart.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">Keranjang Anda kosong.</td></tr>`;
    return;
  }

  let grandTotal = 0;

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>Rp ${item.price.toLocaleString()}</td>
      <td>${item.quantity}</td>
      <td>Rp ${itemTotal.toLocaleString()}</td>
      <td><button class="delete-btn" data-index="${index}">Hapus</button></td>
    `;

    tableBody.appendChild(row);
  });

  totalDiv.innerHTML = `<h3>Total Keseluruhan: Rp ${grandTotal.toLocaleString()}</h3>`;

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      const cart = getCartItems();
      cart.splice(index, 1);
      saveCartItems(cart);
      renderCartItems();
      showNotification('Item dihapus dari keranjang');
    });
  });

  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      localStorage.removeItem('cart');
      renderCartItems();
      showNotification('Keranjang dikosongkan');
      updateCartCount();
    };
  }
}

