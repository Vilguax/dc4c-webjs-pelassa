let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart || !Array.isArray(cart) || cart.length === 0) {
    document.getElementById('cart__items').innerHTML = '<p>Votre panier est vide.</p>';
} else {
    let total = 0;
    let totalQuantity = 0;

    for (let i = 0; i < cart.length; i++) {
        const product = cart[i];

        fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(response => response.json())
            .then(productDetails => {
                const productTotal = productDetails.price * product.quantity;
                total += productTotal;
                totalQuantity += parseInt(product.quantity);

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
                            <p>${productTotal.toFixed(2)} €</p>
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
                productElement.querySelector('.deleteItem').addEventListener('click', () => {
                    cart = cart.filter(item => item.id !== product.id || item.selectedColor !== product.selectedColor);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    productElement.remove();
                    total -= productTotal;
                    totalQuantity -= parseInt(product.quantity);
                    document.getElementById('totalPrice').textContent = total.toFixed(2);
                    document.getElementById('totalQuantity').textContent = totalQuantity;
                });

                document.getElementById('totalPrice').textContent = total.toFixed(2);
                document.getElementById('totalQuantity').textContent = totalQuantity;
            });
    }
}

const orderForm = document.querySelector('.cart__order__form');
orderForm.addEventListener('submit', handleOrder);

function handleOrder(event) {
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
