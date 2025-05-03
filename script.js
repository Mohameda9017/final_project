// Cart state object
const cart = {};

// Utility function to update cart count and total
function updateCartSummary() {
  let count = 0;
  let total = 0;
  for (let id in cart) {
    const item = cart[id];
    count += item.quantity;
    total += item.price * item.quantity;
  }
  document.getElementById('cart-count').innerText = count;
  document.getElementById('cart-total').innerText = total.toFixed(2);
  // Show or hide "empty cart" message
  const emptyMsg = document.querySelector('.empty-cart-msg');
  if (emptyMsg) {
    emptyMsg.style.display = (count === 0 ? 'block' : 'none');
  }
}

// Handle Add to Cart buttons in popups
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent triggering item click/toggle
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;  // may be empty string if no image
    if (cart[id]) {
      // If already in cart, increase quantity
      cart[id].quantity += 1;
      // Update the quantity display for this item
      const qtySpan = document.querySelector(`.cart-item[data-id="${id}"] .qty`);
      if (qtySpan) qtySpan.innerText = cart[id].quantity;
    } else {
      // Add new item to cart
      cart[id] = { name: name, price: price, image: image, quantity: 1 };
      // Create a new cart item list element
      const cartList = document.getElementById('cart-items-list');
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.setAttribute('data-id', id);
      // Build inner HTML for the cart item
      let imgTag = '';
      if (image) {
        imgTag = `<img src="${image}" alt="${name}" class="cart-item-image" />`;
      }
      li.innerHTML = `
        ${imgTag}
        <div class="item-details">
          <div class="item-name-price">
            <span class="item-name">${name}</span>
            <span class="item-price">$${price.toFixed(2)}</span>
          </div>
          <div class="item-quantity">
            <button class="qty-btn minus" data-id="${id}">-</button>
            <span class="qty">${cart[id].quantity}</span>
            <button class="qty-btn plus" data-id="${id}">+</button>
          </div>
        </div>
      `;
      // Remove "empty cart" message if present (will be hidden via updateCartSummary as well)
      // Append the new item to the cart list
      cartList.appendChild(li);
    }
    // Update cart count and total
    updateCartSummary();
  });
});

// Handle plus/minus quantity buttons using event delegation
document.getElementById('cart-items-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('qty-btn')) {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('plus')) {
      cart[id].quantity += 1;
    } else if (e.target.classList.contains('minus')) {
      cart[id].quantity -= 1;
    }
    // If quantity drops to 0 or below, remove item from cart
    if (cart[id].quantity <= 0) {
      delete cart[id];
      const itemLi = e.target.closest('.cart-item');
      if (itemLi) itemLi.remove();
    } else {
      // Update the displayed quantity for this item
      const qtySpan = e.target.closest('.cart-item').querySelector('.qty');
      qtySpan.innerText = cart[id].quantity;
    }
    // Update cart count and total
    updateCartSummary();
  }
});

// Cart sidebar open/close logic
const cartIconBtn = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartCloseBtn = document.getElementById('cart-close');

// Toggle cart sidebar when cart icon is clicked
cartIconBtn.addEventListener('click', () => {
  const isOpen = cartSidebar.classList.contains('open');
  cartSidebar.classList.toggle('open');
  cartOverlay.classList.toggle('active');
});

// Close cart when clicking the close button or overlay
cartCloseBtn.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
});
cartOverlay.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
});

// Hotspot popup behavior for touch devices (enable tap to toggle popups)
document.querySelectorAll('.item').forEach(item => {
  // If device supports touch events
  if ('ontouchstart' in document.documentElement) {
    item.addEventListener('click', () => {
      // Toggle the popup on tap
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      } else {
        // hide any other open popups
        document.querySelectorAll('.item.active').forEach(openItem => {
          openItem.classList.remove('active');
        });
        item.classList.add('active');
      }
    });
  }
});

// If tapping outside any hotspot popup on mobile, close all popups
if ('ontouchstart' in document.documentElement) {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.item')) {
      document.querySelectorAll('.item.active').forEach(openItem => {
        openItem.classList.remove('active');
      });
    }
  });
}
