let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart || !Array.isArray(cart) || cart.length === 0) {
    document.getElementById('cart__items').innerHTML = '<p>Votre panier est vide.</p>';
} else {
    let total = 0;
    let totalQuantity = 0;

    const updateTotal = async () => {
        total = 0;
        totalQuantity = 0;

        for (let i = 0; i < cart.length; i++) {
            const product = cart[i];

            try {
                const response = await fetch(`http://localhost:3000/api/products/${product.id}`);
                const productDetails = await response.json();

                const productTotal = productDetails.price * product.quantity;
                total += productTotal;
                totalQuantity += parseInt(product.quantity);

                const productElement = document.querySelector(`[data-id="${product.id}"][data-color="${product.selectedColor}"]`);
                if (productElement) {
                    productElement.querySelector('.cart__item__content__description p:last-child').textContent = `${productTotal.toFixed(2)} €`;
                }
            } catch (error) {
                console.error('Une erreur s\'est produite lors de la mise à jour des totaux :', error);
            }
        }

        document.getElementById('totalPrice').textContent = total.toFixed(2);
        document.getElementById('totalQuantity').textContent = totalQuantity;
    };

    const updateCartItem = async (product, productElement) => {
        const quantityInput = productElement.querySelector('.itemQuantity');
        quantityInput.addEventListener('change', async (event) => {
            const newQuantity = parseInt(event.target.value);
            const productIndex = cart.findIndex(item => item.id === product.id && item.selectedColor === product.selectedColor);
    
            if (productIndex !== -1) {
                const oldQuantity = parseInt(cart[productIndex].quantity);
                const quantityDifference = newQuantity - oldQuantity;
    
                if (quantityDifference !== 0) {
                    cart[productIndex].quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
    
                    const response = await fetch(`http://localhost:3000/api/products/${product.id}`);
                    const productDetails = await response.json();
    
                    const productTotal = productDetails.price * newQuantity;
                    productElement.querySelector('.cart__item__content__description p:last-child').textContent = `${productTotal.toFixed(2)} €`;
    
                    updateTotal();
                }
            }
        });
    };
    
    const renderCart = async () => {
        for (let i = 0; i < cart.length; i++) {
            const product = cart[i];
    
            try {
                const response = await fetch(`http://localhost:3000/api/products/${product.id}`);
                const productDetails = await response.json();
    
                const productElement = document.createElement('article');
                productElement.classList.add('cart__item');
                productElement.dataset.id = product.id;
                productElement.dataset.color = product.selectedColor;
                productElement.innerHTML = `
                    <div class="cart__item__img">
                        <img src="${productDetails.imageUrl}" alt="${productDetails.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${productDetails.name}</h2>
                            <p>${product.selectedColor}</p>
                            <p>${(productDetails.price * product.quantity).toFixed(2)} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                `;
    
                document.getElementById('cart__items').appendChild(productElement);
                await updateCartItem(product, productElement);
            } catch (error) {
                console.error('Une erreur s\'est produite lors de la mise à jour des éléments du panier :', error);
            }
        }
    
        updateTotal();
    };
    
    renderCart();

}

const orderForm = document.querySelector('.cart__order__form');
orderForm.addEventListener('submit', handleOrder);

function handleOrder(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;

    const orderData = {
        firstName,
        lastName,
        address,
        city,
        email,
        cart
    };

    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(order => {
            localStorage.removeItem('cart');
            window.location.href = `confirmation.html?id=${order.orderId}`;
        })
        .catch(error => console.error('Erreur :', error));
}
