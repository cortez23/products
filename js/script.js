// Obtener elementos del DOM
const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productImageInput = document.getElementById('productImage');
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');

// Función para cargar productos desde la API
async function loadProducts() {
  try {
    const response = await fetch('/api/products');  // Hacemos una solicitud GET a la API
    const products = await response.json();  // Convertimos la respuesta en JSON
    renderProducts(products);  // Llamamos a la función para mostrar los productos
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// Función para renderizar productos en el frontend
function renderProducts(products) {
  productList.innerHTML = '';  // Limpiar la lista de productos antes de mostrar los nuevos
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      ${product.name} - $${product.price}
      <button onclick="deleteProduct('${product.id}')">Eliminar</button>
    `;
    productList.appendChild(li);
  });
}

// Función para buscar productos
function searchProduct() {
  const query = searchInput.value.toLowerCase();
  const items = document.querySelectorAll('#productList li');
  items.forEach(item => {
    const productName = item.innerText.toLowerCase();
    if (productName.includes(query)) {
      item.style.display = '';  // Mostrar el producto si el nombre incluye la búsqueda
    } else {
      item.style.display = 'none';  // Ocultar el producto si no coincide
    }
  });
}

// Función para agregar un nuevo producto
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();  // Evita que se recargue la página al enviar el formulario

  const newProduct = {
    name: productNameInput.value,
    price: parseFloat(productPriceInput.value),
    image: productImageInput.value
  };

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      productNameInput.value = '';
      productPriceInput.value = '';
      productImageInput.value = '';
      loadProducts();  // Recargar los productos después de agregar uno nuevo
    }
  } catch (error) {
    console.error('Error al agregar producto:', error);
  }
});

// Función para eliminar un producto
async function deleteProduct(productId) {
  try {
    await fetch(`/api/products/${productId}`, { method: 'DELETE' });  // Enviar una solicitud DELETE
    loadProducts();  // Recargar los productos después de eliminar uno
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
}

// Cargar los productos al inicio cuando la página se carga
loadProducts();

// Añadir la funcionalidad de búsqueda
searchInput.addEventListener('input', searchProduct);
