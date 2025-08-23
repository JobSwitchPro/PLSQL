// Global cart array to store items
let cartItems = [];

// Load cart from localStorage when page loads
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('jobswitchproCart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartSummary();
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('jobswitchproCart', JSON.stringify(cartItems));
}

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
            showToast(`${name} is already in your cart.`, 'warning');
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
    saveCartToStorage(); // Save to localStorage
}

// Function to remove item from cart
function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    updateCartSummary();
    saveCartToStorage();
    showToast('Item removed from cart', 'success');
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
    
    // Add items to panel with remove buttons
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-summary';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">Qty: ${item.quantity} × ₹${item.price} = ₹${itemTotal}</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" title="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
            </button>
        `;
        
        cartItemsList.appendChild(itemElement);
    });
    
    // Show empty message if cart is empty
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
    }
    
    // Update total
    panelTotalElement.textContent = `₹${totalPrice}`;
    
    // Update clear cart button visibility
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.style.display = cartItems.length > 0 ? 'block' : 'none';
    }
}

// Function to clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cartItems = [];
        updateCartSummary();
        localStorage.removeItem('jobswitchproCart');
        showToast('Cart cleared', 'success');
    }
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

// Function to update totals when quantity changes
function setupQuantityHandlers() {
    const quantityInputs = document.querySelectorAll('.qty-input');
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const price = parseFloat(this.closest('.cart-item').querySelector('.col-price').textContent.replace('₹', ''));
            const quantity = parseInt(this.value);
            const totalElement = this.closest('.cart-item').querySelector('.col-total');
            
            totalElement.textContent = '₹' + (price * quantity);
            updateGrandTotal();
        });
    });
}

// Function to calculate grand total
function updateGrandTotal() {
    let grandTotal = 0;
    const totals = document.querySelectorAll('.col-total');
    
    totals.forEach(total => {
        grandTotal += parseFloat(total.textContent.replace('₹', ''));
    });
    
    // Update grand total display
    const grandTotalElement = document.getElementById('grand-total');
    if (grandTotalElement) {
        grandTotalElement.textContent = '₹' + grandTotal;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    loadCartFromStorage();
    
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
            <button class="close-panel" onclick="closeCartPanel()">
                <span class="close-icon">X</span>
            </button>
        </div>
        <div id="cart-items-list" class="cart-items-list"></div>
        <div class="summary-total">Total: <span id="panel-total">₹0</span></div>
        <button class="checkout-btn-panel" onclick="proceedToCheckout()">Proceed to Checkout</button>
        <button class="clear-cart-btn" onclick="clearCart()" style="display: none;">Clear Cart</button>
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
    
    console.log('Custom cart functionality loaded');
});
