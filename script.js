// JavaScript for MetroSafe Interactive Shopping Page

// Select relevant elements
const cartToggleBtn = document.querySelector('.cart-toggle');
const cartPanel = document.querySelector('.cart-panel');
const cartOverlay = document.querySelector('.cart-overlay');
const cartCloseBtn = document.querySelector('.cart-close');
const cartItemsContainer = document.querySelector('.cart-items');
const cartEmptyMessage = document.querySelector('.cart-empty');
const cartTotalElem = document.getElementById('cart-total');
const cartCountElem = document.getElementById('cart-count');

// Data structure to hold cart items (keyed by product id)
const cart = {};  // e.g., cart = { shirt: { name: "MetroSafe T-Shirt", price: 25, qty: 2 }, ... }

// Product info lookup (could also be data-* attributes, but using an object for convenience)
const products = {
  "shirt":      { name: "MetroSafe T-Shirt", price: 25.00, image: "shirt.png" },
  "sweatshirt": { name: "MetroSafe Sweatshirt", price: 40.00, image: "Sweatshirt.png" },
  "mug":        { name: "MetroSafe Mug", price: 12.00, image: "mug.png" },
  "book":       { name: "MetroSafe Notebook", price: 15.00, image: "hero_img.png" },  // using hero_img as placeholder image for the notebook
  "tote":       { name: "MetroSafe Tote Bag", price: 18.00, image: "totebag.png" },
  "phone":      { name: "MetroSafe Phone Case", price: 22.00, image: "phonecase.png" },
  "hat":        { name: "MetroSafe Hat", price: 20.00, image: "hat.png" },
  "dogtag":     { name: "MetroSafe Dog Tag", price: 8.00,  image: "dogtag.png" }
};

// Utility: update Cart Count and Total in UI
function updateCartSummary() {
  // Update cart item count
  let itemCount = 0;
  let totalPrice = 0;
  for (let pid in cart) {
    const item = cart[pid];
    itemCount += item.qty;
    totalPrice += item.price * item.qty;
  }
  cartCountElem.textContent = itemCount;
  cartTotalElem.textContent = totalPrice.toFixed(2);
  // Show or hide "empty cart" message
  if (itemCount === 0) {
    cartEmptyMessage.style.display = 'block';
  } else {
    cartEmptyMessage.style.display = 'none';
  }
}

// Render the cart items list in the sidebar
function renderCartItems() {
  cartItemsContainer.innerHTML = '';  // clear current items
  for (let pid in cart) {
    const item = cart[pid];
    // Create cart item element (using a template literal for HTML)
    const itemElem = document.createElement('div');
    itemElem.className = 'cart-item';
    itemElem.innerHTML = `
      <img src="${products[pid].image}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-qty">
          <button class="qty-decrease" data-product="${pid}">-</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-increase" data-product="${pid}">+</button>
        </div>
      </div>
      <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
    `;
    cartItemsContainer.appendChild(itemElem);
  }
  updateCartSummary();
}

// Add item to cart (or increase quantity if already in cart)
function addToCart(productId) {
  const product = products[productId];
  if (!product) return;
  if (cart[productId]) {
    // already in cart, increase quantity
    cart[productId].qty += 1;
  } else {
    // add new item
    cart[productId] = { name: product.name, price: product.price, qty: 1 };
  }
  // Re-render cart items and open cart panel
  renderCartItems();
  openCart();
}

// Open cart sidebar
function openCart() {
  cartPanel.classList.add('open');
  cartOverlay.style.display = 'block';
}

// Close cart sidebar
function closeCart() {
  cartPanel.classList.remove('open');
  cartOverlay.style.display = 'none';
}

// Event Listeners:

// 1. Cart toggle button (opens cart)
cartToggleBtn.addEventListener('click', openCart);

// 2. Cart close button (closes cart)
cartCloseBtn.addEventListener('click', closeCart);

// 3. Overlay click (closes cart if click outside cart)
cartOverlay.addEventListener('click', closeCart);

// 4. Add-to-Cart buttons in popups
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const productId = btn.getAttribute('data-product');
    addToCart(productId);
    e.stopPropagation();  // prevent click from bubbling (which might close popup)
  });
});

// 5. Hotspot clicks (for mobile support – toggle popup visibility)
document.querySelectorAll('.hotspot').forEach(hotspot => {
  hotspot.addEventListener('click', (e) => {
    // Toggle popup display on tap (mobile)
    const popup = hotspot.querySelector('.popup');
    if (!popup) return;
    const isVisible = popup.style.display === 'block';
    // Hide any other open popups first
    document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
    if (!isVisible) {
      // Show this popup
      popup.style.display = 'block';
    } else {
      // (If it was already visible, it will now be hidden by the above code)
    }
    e.stopPropagation();  // prevent triggering any parent handlers
  });
});

// 6. Click outside any hotspot/popup closes popups (for mobile)
document.addEventListener('click', (e) => {
  // If click is not inside a hotspot, close any open popups
  // We can check if the clicked element is a popup or marker or child of hotspot
  if (!e.target.closest('.hotspot')) {
    document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
  }
});

// 7. Cart quantity increase/decrease buttons
// We delegate this event to the cart items container for efficiency
cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('qty-increase') || e.target.classList.contains('qty-decrease')) {
    const productId = e.target.getAttribute('data-product');
    if (!productId || !cart[productId]) return;
    if (e.target.classList.contains('qty-increase')) {
      cart[productId].qty += 1;
    } else if (e.target.classList.contains('qty-decrease')) {
      cart[productId].qty -= 1;
      // Remove item if quantity goes to 0
      if (cart[productId].qty <= 0) {
        delete cart[productId];
      }
    }
    renderCartItems();
  }
});

// Initialize cart display (ensure correct empty state on load)
updateCartSummary();
