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
  // DATA PRODUK DISESUAIKAN DENGAN KONTEN ASLI ANDA
  const products = [
    { id: 'P001', name: 'PDH Himti', price: 150000, image: 'image/Produk.jpg' },
    { id: 'P002', name: 'Kipas Custom', price: 10000, image: 'image/produk_kipas.jpg' },
    { id: 'P003', name: 'Totebag Custom', price: 175000, image: 'image/w2e.jpg' },
    { id: 'P004', name: 'Gantungan Kunci Kustom', price: 225000, image: 'image/produk_ganci.jpeg' }
  ];

  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
        <button class="add-to-cart-btn">Tambah ke Keranjang</button>
      </div>
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
      <td>Rp ${item.price.toLocaleString('id-ID')}</td>
      <td>${item.quantity}</td>
      <td>Rp ${itemTotal.toLocaleString('id-ID')}</td>
      <td><button class="delete-btn" data-index="${index}">Hapus</button></td>
    `;

    tableBody.appendChild(row);
  });

  totalDiv.innerHTML = `<h3>Total Keseluruhan: Rp ${grandTotal.toLocaleString('id-ID')}</h3>`;

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


// ----------------------------
// Initializer (BLOK BARU UNTUK MENJALANKAN SEMUANYA)
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Panggil fungsi ini di setiap halaman untuk memastikan jumlah keranjang selalu update
  updateCartCount();

  // Cek path halaman saat ini untuk memanggil fungsi yang relevan
  const currentPage = window.location.pathname;

  // Kondisi ini akan cocok untuk halaman root (seperti http://127.0.0.1:5500/) 
  // atau yang secara eksplisit memanggil index.html
  if (currentPage.endsWith('index.html') || currentPage.endsWith('/')) {
    renderProducts();
  }

  if (currentPage.includes('cart.html')) {
    renderCartItems();
  }
});