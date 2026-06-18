// checkout.js - Checkout page functionality

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    displayCheckoutItems();
    setupPaymentMethodToggle();
    setupFormValidation();
});

// Display items in checkout summary
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('subtotal');
    const grandTotalElement = document.getElementById('grand-total');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="checkout-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.weight} × ${item.quantity}</p>
                </div>
                <div class="checkout-item-price">
                    Rs. ${itemTotal.toLocaleString()}
                </div>
            </div>
        `;
    });
    
    checkoutItemsContainer.innerHTML = itemsHTML;
    
    const shipping = 200;
    const grandTotal = subtotal + shipping;
    
    subtotalElement.textContent = `Rs. ${subtotal.toLocaleString()}`;
    grandTotalElement.textContent = `Rs. ${grandTotal.toLocaleString()}`;
}

// Toggle payment method details
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('card-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
}

// Form validation
function setupFormValidation() {
    const form = document.getElementById('checkout-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            processOrder();
        }
    });
}

// Validate form inputs
function validateForm() {
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    // Validate email
    const email = document.getElementById('email');
    if (email.value && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    const phone = document.getElementById('phone');
    if (phone.value && !isValidPhone(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate card details if credit card is selected
    const creditCardSelected = document.getElementById('credit-card').checked;
    if (creditCardSelected) {
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        const cvv = document.getElementById('cvv');
        const cardName = document.getElementById('cardName');
        
        if (!cardNumber.value.trim()) {
            showError(cardNumber, 'Card number is required');
            isValid = false;
        }
        if (!expiryDate.value.trim()) {
            showError(expiryDate, 'Expiry date is required');
            isValid = false;
        }
        if (!cvv.value.trim()) {
            showError(cvv, 'CVV is required');
            isValid = false;
        }
        if (!cardName.value.trim()) {
            showError(cardName, 'Name on card is required');
            isValid = false;
        }
    }
    
    return isValid;
}

// Helper functions for validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
}

function showError(input, message) {
    clearError(input);
    input.style.borderColor = '#dc3545';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.fontSize = '0.8em';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function clearError(input) {
    input.style.borderColor = '#ddd';
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Process order
function processOrder() {
    const form = document.getElementById('checkout-form');
    const submitButton = form.querySelector('.place-order-btn');
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    document.body.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Save order details (in a real app, this would go to your backend)
        const orderDetails = {
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            },
            shipping: {
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                postalCode: document.getElementById('postalCode').value,
                country: document.getElementById('country').value
            },
            payment: {
                method: document.querySelector('input[name="paymentMethod"]:checked').value
            },
            items: JSON.parse(localStorage.getItem('cart')) || [],
            total: calculateOrderTotal(),
            orderId: generateOrderId(),
            date: new Date().toISOString()
        };
        
        // Save order to localStorage (in real app, send to backend)
        localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to confirmation page
        window.location.href = 'order-confirmation.html';
    }, 2000);
}

// Calculate order total
function calculateOrderTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 200;
    return subtotal + shipping;
}

// Generate random order ID
function generateOrderId() {
    return 'TC' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Navigation functions
function goBackToCart() {
    window.location.href = 'cart.html';
}

// Update cart.js to handle "Buy Now" buttons
// Add this to your existing cart.js file:

// Buy Now function - redirects to checkout directly
function buyNow(name, price, image, weight) {
    // Create a temporary cart with just this item
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
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

