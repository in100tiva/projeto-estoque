document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let name = document.getElementById('productName').value;
    let expiry = document.getElementById('productExpiry').value;
    let quantity = document.getElementById('productQuantity').value;
    let product = { name, expiry, quantity };
    addProduct(product);
    document.getElementById('productForm').reset();
    saveProducts();
});

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(product => addProduct(product));
}

function saveProducts() {
    let productList = [];
    document.querySelectorAll('#productList tr').forEach(row => {
        let product = {
            name: row.cells[0].textContent,
            expiry: row.cells[1].textContent,
            quantity: row.cells[2].textContent
        };
        productList.push(product);
    });
    localStorage.setItem('products', JSON.stringify(productList));
}

function addProduct(product) {
    const productList = document.getElementById('productList');
    const row = document.createElement('tr');
    const currentDate = new Date();
    const expiryDate = new Date(product.expiry);
    const diffTime = Math.abs(expiryDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.expiry}</td>
        <td>${product.quantity}</td>
        <td><button onclick="deleteProduct(this)">Remover</button></td>
    `;
    
    if (diffDays <= 30) {
        row.classList.add('expiring');
        document.getElementById('alert').textContent = 'Atenção: Produtos próximos da validade!';
    }
    
    productList.appendChild(row);
}

function deleteProduct(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    saveProducts();
}

// Carregar produtos do localStorage ao carregar a página
window.onload = loadProducts;
