fetch('http://localhost:3000/api/products')
.then(response => response.json())
.then(products => {
  let productsHTML = '';
  products.forEach(product => {
    productsHTML += `
      <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.name}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>
    `;
  });

  document.getElementById('items').innerHTML = productsHTML;
})
.catch(error => {
  console.error('Erreur :', error);
});
