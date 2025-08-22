// Cart functionality
let cart = [];
let total = 0;

function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    updateCartUI();
    showToast(`${name} added to cart!`);
}

function updateCartUI() {
    // This function will update your cart sidebar/summary
    // You can implement this based on your layout
    console.log("Cart Items:", cart);
    console.log("Total: $", total);
    
    // Example: Update a cart counter somewhere on the page
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        cartCounter.textContent = cart.length;
    }
}

function showToast(message, type = 'success') {
    // Create or reuse toast element
    let toast = document.getElementById('cart-toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.className = 'cart-toast';
        document.body.appendChild(toast);
    }
    
    // Set different styles based on message type
    if (type === 'warning') {
        toast.style.background = '#e67e22'; // Orange for warnings
    } else if (type === 'error') {
        toast.style.background = '#e74c3c'; // Red for errors
    } else {
        toast.style.background = '#27ae60'; // Green for success
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Custom cart functionality loaded');
});

// Function to update totals when quantity changes
function setupQuantityHandlers() {
    const quantityInputs = document.querySelectorAll('.qty-input');
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const price = parseFloat(this.closest('.cart-item').querySelector('.col-price').textContent.replace('$', ''));
            const quantity = parseInt(this.value);
            const totalElement = this.closest('.cart-item').querySelector('.col-total');
            
            totalElement.textContent = '$' + (price * quantity);
            updateGrandTotal();
        });
    });
}

// Function to calculate grand total
function updateGrandTotal() {
    let grandTotal = 0;
    const totals = document.querySelectorAll('.col-total');
    
    totals.forEach(total => {
        grandTotal += parseFloat(total.textContent.replace('$', ''));
    });
    
    // Update grand total display (you'll need to add this element to your HTML)
    const grandTotalElement = document.getElementById('grand-total');
    if (grandTotalElement) {
        grandTotalElement.textContent = '$' + grandTotal;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupQuantityHandlers();
});

// Global cart array to store items
let cartItems = [];

// Function to add item to cart
// Function to add item to cart with quantity restrictions
// Function to add item to cart with quantity restrictions
function addToCart(name, price, id) {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === id);
    
    // Define which items can have multiple quantities (only mock interviews)
    const allowMultipleQuantities = id.includes('mock-interview');
    
    if (existingItemIndex >= 0) {
        if (allowMultipleQuantities) {
            // For mock interviews, increase quantity
            cartItems[existingItemIndex].quantity += 1;
            showToast(`${name} added to cart! (Quantity: ${cartItems[existingItemIndex].quantity})`, 'success');
        } else {
            // For other items, show message that it's already in cart
            showToast(`${name} is already in your cart. You only need one copy.`, 'warning');
            return; // Exit without adding
        }
    } else {
        // Item doesn't exist, add new item with quantity 1
        cartItems.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
        showToast(`${name} added to cart!`, 'success');
    }
    
    updateCartSummary();
}

// Function to update cart summary
function updateCartSummary() {
    const itemsCountElement = document.querySelector('.items-count');
    const cartTotalElement = document.querySelector('.cart-total');
    
    // Calculate total items and total price
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update the banner
    itemsCountElement.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in cart`;
    cartTotalElement.textContent = `Total: ₹${totalPrice}`;
    
    // Update the cart panel if it's open
    updateCartPanel();
}

// Function to update cart panel
function updateCartPanel() {
    const cartItemsList = document.getElementById('cart-items-list');
    const panelTotalElement = document.getElementById('panel-total');
    
    if (!cartItemsList) return;
    
    // Clear current items
    cartItemsList.innerHTML = '';
    
    // Calculate total
    let totalPrice = 0;
    
    // Add items to panel
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-summary';
        itemElement.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-quantity">Qty: ${item.quantity}</div>
            <div class="cart-item-price">₹${itemTotal}</div>
        `;
        
        cartItemsList.appendChild(itemElement);
    });
    
    // Update total
    panelTotalElement.textContent = `₹${totalPrice}`;
}

// Function to toggle cart summary panel
function toggleCartSummary() {
    const panel = document.getElementById('cart-summary-panel');
    const overlay = document.getElementById('overlay');
    
    panel.classList.toggle('active');
    overlay.style.display = panel.classList.contains('active') ? 'block' : 'none';
    
    // Update panel content when opening
    if (panel.classList.contains('active')) {
        updateCartPanel();
    }
}

// Function to close cart panel
function closeCartPanel() {
    const panel = document.getElementById('cart-summary-panel');
    const overlay = document.getElementById('overlay');
    
    panel.classList.remove('active');
    overlay.style.display = 'none';
}

// Function to handle checkout
function proceedToCheckout() {
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items to your cart before checkout.');
        return;
    }
    
    alert('Proceeding to checkout! In a real application, this would redirect to a payment gateway.');
    // Here you would typically redirect to your payment page
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add overlay element dynamically
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';
    overlay.onclick = closeCartPanel;
    document.body.appendChild(overlay);
    
    // Add cart summary panel dynamically
    const cartPanel = document.createElement('div');
    cartPanel.id = 'cart-summary-panel';
    cartPanel.className = 'cart-summary-panel';
    cartPanel.innerHTML = `
        <div class="summary-panel-header">
            <h2>Your Cart</h2>
            <button class="close-panel" onclick="closeCartPanel()">×</button>
        </div>
        <div id="cart-items-list" class="cart-items-list"></div>
        <div class="summary-total">Total: <span id="panel-total">₹0</span></div>
        <button class="checkout-btn-panel" onclick="proceedToCheckout()">Proceed to Checkout</button>
    `;
    document.body.appendChild(cartPanel);
    
    // Set up quantity handlers
    setupQuantityHandlers();
    
    // Add animation to items
    const items = document.querySelectorAll('.cart-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
});
