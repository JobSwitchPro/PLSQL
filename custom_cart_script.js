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
    
    // Clear any existing timeouts
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Set different styles and durations based on message type
    let duration = 3000; // Default 3 seconds
    
    switch (type) {
        case 'warning':
            toast.style.background = '#e67e22'; // Orange
            duration = 5000; // 5 seconds for warnings
            break;
        case 'error':
            toast.style.background = '#e74c3c'; // Red
            duration = 5000; // 5 seconds for errors
            break;
        case 'info':
            toast.style.background = '#3498db'; // Blue
            duration = 7000; // 7 seconds for important info (auto-upgrade messages)
            break;
        default:
            toast.style.background = '#27ae60'; // Green
            duration = 4000; // 4 seconds for success
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.display = 'block';

    // Set timeout to hide toast
    toast.timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        
        // Completely hide after fadeout animation
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
        
    }, duration);
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


// Define kit relationships - which items include which others
const kitRelationships = {
    'pro-kit-notes': ['foundation-kit-notes'],
    'expert-kit-notes': ['pro-kit-notes', 'foundation-kit-notes'],
    '100_IQs': ['50_IQs'],
    '150_IQs': ['100_IQs', '50_IQs']
};

// Helper function to get friendly item name from ID
function getItemName(itemId) {
    const nameMap = {
        'foundation-kit-notes': 'Foundation Kit Notes',
        'pro-kit-notes': 'Pro Kit Notes', 
        'expert-kit-notes': 'Expert Kit Notes',
        '50-interview-questions': '50+ Interview Questions',
        '100-interview-questions': '100+ Interview Questions',
        '150-interview-questions': '150+ Interview Questions'
    };
    return nameMap[itemId] || itemId;
}

// Check if adding this item should be blocked due to existing inclusive items
// Keep the blocking logic for other scenarios
function shouldBlockItem(newItemId) {
    // Only block if the new item is LOWER tier than existing items
    const blockScenarios = {
        'foundation-kit-notes': ['pro-kit-notes', 'expert-kit-notes'],
        'pro-kit-notes': ['expert-kit-notes'],
        '50-interview-questions': ['100-interview-questions', '150-interview-questions'],
        '100-interview-questions': ['150-interview-questions']
    };
    
    if (blockScenarios[newItemId]) {
        const higherTiers = blockScenarios[newItemId];
        for (const higherTierId of higherTiers) {
            if (cartItems.some(item => item.id === higherTierId)) {
                return `${getItemName(higherTierId)} already includes this content.`;
            }
        }
    }
    
    return null;
}

// Automatically remove redundant items when adding a higher-tier item
function removeRedundantItems(newItemId) {
    if (kitRelationships[newItemId]) {
        const itemsToRemove = kitRelationships[newItemId];
        let removedCount = 0;
        
        // Remove all redundant items
        cartItems = cartItems.filter(item => {
            if (itemsToRemove.includes(item.id)) {
                removedCount++;
                return false; // Remove this item
            }
            return true; // Keep this item
        });
        
        // Show message if items were removed
        if (removedCount > 0) {
            showToast(`Removed ${removedCount} redundant item(s) automatically.`, 'info');
        }
    }
}

// Enhanced addToCart function with smart logic
// Enhanced addToCart function with auto-upgrade logic
function addToCart(name, price, id) {
    // First, check if we should auto-upgrade (remove lower tiers)
    if (shouldAutoUpgrade(id)) {
        // Auto-remove lower tier items and add the higher tier
        performAutoUpgrade(id, name, price);
        return true;
    }
    
    // Check if item should be blocked (redundant items)
    const blockReason = shouldBlockItem(id);
    if (blockReason) {
        showToast(blockReason, 'warning');
        return false;
    }
    
    // Normal add to cart logic
    const existingItemIndex = cartItems.findIndex(item => item.id === id);
    const allowMultipleQuantities = id.includes('mock-interview');
    
    if (existingItemIndex >= 0) {
        if (allowMultipleQuantities) {
            cartItems[existingItemIndex].quantity += 1;
            showToast(`${name} added to cart! (Quantity: ${cartItems[existingItemIndex].quantity})`, 'success');
        } else {
            showToast(`${name} is already in your cart.`, 'warning');
            return false;
        }
    } else {
        cartItems.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
        showToast(`${name} added to cart!`, 'success');
    }
    
    updateCartSummary();
    saveCartToStorage();
    return true;
}

// Example of how to call it from your HTML buttons:
// <button onclick="addToCart('Pro Kit Notes', 150, 'pro-kit-notes')">Add to Cart</button>



// Check if adding this item should trigger auto-upgrade
function shouldAutoUpgrade(newItemId) {
    const upgradeScenarios = {
        'pro-kit-notes': ['foundation-kit-notes'],
        'expert-kit-notes': ['pro-kit-notes', 'foundation-kit-notes'],
        '100-interview-questions': ['50-interview-questions'],
        '150-interview-questions': ['100-interview-questions', '50-interview-questions']
    };
    
    if (upgradeScenarios[newItemId]) {
        const lowerTiers = upgradeScenarios[newItemId];
        // Check if any lower tier exists that should be upgraded
        return lowerTiers.some(lowerTierId => 
            cartItems.some(item => item.id === lowerTierId)
        );
    }
    
    return false;
}

// Perform the auto-upgrade: remove lower tiers and add higher tier
function performAutoUpgrade(newItemId, newItemName, newItemPrice) {
    const upgradeMap = {
        'pro-kit-notes': ['foundation-kit-notes'],
        'expert-kit-notes': ['pro-kit-notes', 'foundation-kit-notes'],
        '100-interview-questions': ['50-interview-questions'],
        '150-interview-questions': ['100-interview-questions', '50-interview-questions']
    };
    
    const itemsToRemove = upgradeMap[newItemId] || [];
    let removedItems = [];
    
    // Remove lower tier items
    cartItems = cartItems.filter(item => {
        if (itemsToRemove.includes(item.id)) {
            removedItems.push(item.name);
            return false; // Remove this item
        }
        return true; // Keep this item
    });
    
    // Add the new higher tier item
    cartItems.push({
        id: newItemId,
        name: newItemName,
        price: newItemPrice,
        quantity: 1
    });
    
    // Show upgrade message
    if (removedItems.length > 0) {
        const upgradeMessage = `Auto-upgraded: Removed ${removedItems.join(' + ')} and added ${newItemName}`;
        showToast(upgradeMessage, 'info');
    }
    
    updateCartSummary();
    saveCartToStorage();
}

