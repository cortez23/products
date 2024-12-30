const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta para obtener todos los productos
app.get('/api/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/products.json')));
  res.json(data.productos);
});

// Ruta para agregar un producto
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/products.json')));

  // Crear un ID único para el nuevo producto
  newProduct.id = Date.now().toString();

  // Agregar el nuevo producto al arreglo de productos
  data.productos.push(newProduct);
  fs.writeFileSync(path.join(__dirname, '../public/products.json'), JSON.stringify(data));

  res.status(201).json(newProduct);
});

// Ruta para eliminar un producto
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/products.json')));

  // Filtrar el producto con el ID especificado
  data.productos = data.productos.filter(product => product.id !== productId);

  // Guardar el archivo actualizado
  fs.writeFileSync(path.join(__dirname, '../public/products.json'), JSON.stringify(data));

  res.status(200).json({ message: 'Producto eliminado' });
});

// Servir archivos estáticos (HTML, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
