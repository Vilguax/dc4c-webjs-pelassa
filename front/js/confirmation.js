const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');

document.getElementById('orderId').textContent = orderId;
localStorage.removeItem('cart');