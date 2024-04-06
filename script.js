const products = {
  Wheat: { price: 5.00, image: 'images/wheat.jpg' },
  Corn: { price: 7.00, image: 'images/corn.jpg' },
  Rice: { price: 3.00, image: 'images/rice.jpg' },
  // Add more products with their respective prices and image paths
};

function displayProducts() {
  const productListDiv = document.getElementById('productList');

  // Create buttons for each product
  Object.keys(products).forEach(productName => {
    const productButton = document.createElement('button');
    const productImage = document.createElement('img');
    productImage.src = products[productName].image;
    productImage.alt = productName;
    productButton.appendChild(productImage);

    // Display product name and amount
    const productDetails = document.createElement('p');
    productDetails.textContent = `${productName} - $${products[productName].price.toFixed(2)}`;
    productButton.appendChild(productDetails);

    productButton.className = 'product-button';
    productButton.addEventListener('click', () => selectProduct(productName));
    productListDiv.appendChild(productButton);
  });
}


function selectProduct(productName) {
  // Get the quantity for the selected product
  const quantity = prompt(`Enter quantity for ${productName}:`, '1');

  if (quantity !== null) {
    // Display the selected product, quantity, and total amount
    const selectedProductsDiv = document.getElementById('selectedProducts');
    const selectedProductDiv = document.createElement('div');
    selectedProductDiv.className = 'selected-product';

    const productAmount = products[productName].price * quantity;

    console.log(`Product: ${productName}, Price: ${products[productName].price}, Quantity: ${quantity}, Amount: ${productAmount}`);

    selectedProductDiv.textContent = `${productName} - Quantity: ${quantity} - Total: $${productAmount.toFixed(2)}`;
    selectedProductsDiv.appendChild(selectedProductDiv);
  }
}



function submitOrder() {
  const orderForm = document.getElementById('orderForm');
  const formData = new FormData(orderForm);

  const order = {};
  formData.forEach((value, key) => {
    order[key] = value;
  });

  // Get the selected products and quantities
  const selectedProducts = document.querySelectorAll('.selected-product');
  order.products = [];

  let totalAmount = 0;

  selectedProducts.forEach(selectedProduct => {
    const [productName, quantity] = selectedProduct.textContent.split(' - Quantity: ');
    const parsedQuantity = parseInt(quantity, 10);

    if (!isNaN(parsedQuantity)) {
      const productPrice = products[productName].price;
      const productAmount = productPrice * parsedQuantity;

      order.products.push({
        name: productName,
        singlePrice: productPrice,
        quantity: parsedQuantity,
        productAmount: productAmount,
      });

      totalAmount += productAmount;
    }
  });

  // Include total amount in the order data
  order.totalAmount = totalAmount;

  console.log('Order Data:', order);

  // Send order data to the server
  fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Order placed successfully:', data);
      // Handle success, e.g., show a confirmation message to the user
    })
    .catch(error => {
      console.error('Error placing order:', error);
      // Handle error, e.g., show an error message to the user
    });
}





// Call displayProducts when the script is loaded to populate the product list
displayProducts();
