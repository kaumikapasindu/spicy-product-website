// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to cart
function addToCart(name, price, image, weight) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name && item.weight === weight);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            weight: weight,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in navbar
    updateCartCount();
    
    // Show confirmation
    alert(`${name} added to cart!`);
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems(); // Refresh cart display
}

// Function to update item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    // Ensure quantity doesn't go below 1
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems(); // Refresh cart display
}

// Function to update cart count in navbar
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = `(${totalItems})`;
    });
}

// Function to calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to display cart items (for cart.html)
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotalElement) cartTotalElement.textContent = 'Rs. 0';
        return;
    }
    
    let cartHTML = '';
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.weight}</p>
                    <p class="item-price">Rs. ${item.price}</p>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
                <div class="item-total">
                    Rs. ${item.price * item.quantity}
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `Rs. ${calculateTotal()}`;
    }
}

// Function to clear cart (for checkout)
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCartItems();
});

// NEW FUNCTION: Buy Now - redirects to checkout
function buyNow(name, price, image, weight) {
    // Create a temporary cart with just this one item
    const tempCart = [{
        name: name,
        price: price,
        image: image,
        weight: weight,
        quantity: 1
    }];
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(tempCart));
    
    // Update cart count
    updateCartCount();
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCartItems();
});


