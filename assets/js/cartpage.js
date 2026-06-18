// cart-page.js
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some delicious spices to your cart!</p>
                <button class="continue-shopping" onclick="window.location.href='product.html'">
                    Start Shopping
                </button>
            </div>
        `;
        cartTotalElement.textContent = '0';
        return;
    }
    
    let total = 0;
    let itemsHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='placeholder-image.jpg'">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Rs. ${item.price} / ${item.weight}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="item-total">Rs. ${itemTotal}</div>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    cartTotalElement.textContent = total;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // For now, just show an alert. You can implement actual checkout later
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Proceeding to checkout! Total: Rs. ${total}\n\nThis is a demo. Checkout functionality can be implemented here.`);
}

// Initialize cart page when loaded
document.addEventListener('DOMContentLoaded', function() {
    renderCartItems();
    updateCartCount(); // Make sure cart count is updated
});