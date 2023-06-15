const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

fetch('http://localhost:3000/api/products/' + id)
    .then(response => response.json())
    .then(data => {
        document.getElementById('title').textContent = data.name;
        document.getElementById('price').textContent = data.price;
        document.getElementById('description').textContent = data.description;
        document.querySelector('.item__img').innerHTML = `<img src="${data.imageUrl}" alt="Photographie d'un canapé">`;

        let colorsOptions = data.colors.map(color => `<option value="${color}">${color}</option>`).join('');
        document.getElementById('colors').innerHTML += colorsOptions;

        const addToCartButton = document.getElementById('addToCart');

        addToCartButton.addEventListener('click', () => {
            const selectedColor = document.getElementById('colors').value;
            const quantity = document.getElementById('quantity').value;
            const product = {id, selectedColor, quantity};

            let cart = JSON.parse(localStorage.getItem('cart'));

            if (!cart) {
                cart = [];
            }

            const existingProductIndex = cart.findIndex(item => item.id === product.id && item.selectedColor === product.selectedColor);

            if (existingProductIndex !== -1) {
                const existingProduct = cart[existingProductIndex];
                existingProduct.quantity = parseInt(existingProduct.quantity) + parseInt(product.quantity);
                cart[existingProductIndex] = existingProduct;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        });
    })
    .catch(error => console.error('Erreur :', error));