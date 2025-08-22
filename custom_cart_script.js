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

function showToast(message) {
    // Create or reuse toast element
    let toast = document.getElementById('cart-toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.className = 'cart-toast';
        document.body.appendChild(toast);
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
