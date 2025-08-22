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