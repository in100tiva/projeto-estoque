document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let name = document.getElementById('productName').value;
    let brand = document.getElementById('productBrand').value;
    let expiry = document.getElementById('productExpiry').value;
    let quantity = document.getElementById('productQuantity').value;
    let product = { name, brand, expiry, quantity };
    if (document.getElementById('productForm').dataset.isEdit) {
        updateProduct(product, document.getElementById('productForm').dataset.index);
        document.getElementById('productForm').removeAttribute('data-is-edit');
        document.getElementById('productForm').removeAttribute('data-index');
    } else {
        addProduct(product);
        saveProducts();
    }
    document.getElementById('productForm').reset();
});

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(product => addProduct(product));
}

function addProduct(product, index=-1) {
    const productList = document.getElementById('productList');
    const row = document.createElement('tr');
    row.innerHTML = generateRowHTML(product, index);
    productList.appendChild(row);
    updateRowEvents(row);
    checkExpiry(row, product.expiry);
}

function updateProduct(product, index) {
    const row = document.getElementById('productList').rows[index];
    row.innerHTML = generateRowHTML(product, index);
    updateRowEvents(row);
    checkExpiry(row, product.expiry);
}

function generateRowHTML(product, index) {
    let formattedDate = formatDate(product.expiry);
    return `
        <td contenteditable="true">${product.name}</td>
        <td contenteditable="true">${product.brand}</td>
        <td contenteditable="true">${formattedDate}</td>
        <td contenteditable="true">${product.quantity}</td>
        <td><button onclick="deleteProduct(this)">Remover</button></td>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00Z');  // Ensure the date is treated as UTC
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
}

function deleteProduct(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    saveProducts();
}

function updateRowEvents(row) {
    ['blur', 'input'].forEach(event => {
        for (let i = 0; i < 4; i++) {
            row.cells[i].addEventListener(event, function() {
                document.getElementById('saveChanges').style.display = 'block';
            });
        }
    });
}

function checkExpiry(row, expiry) {
    const expiryDate = new Date(expiry + 'T00:00:00Z');  // Ensure the date is treated as UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);  // Reset time part
    const timeDiff = expiryDate - today;
    const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysUntilExpiry <= 15) {
        row.classList.add('danger');
        row.classList.remove('warning');
    } else if (daysUntilExpiry <= 30) {
        row.classList.add('warning');
        row.classList.remove('danger');
    } else {
        row.classList.remove('warning');
        row.classList.remove('danger');
    }
}

function saveProducts() {
    let productList = [];
    document.querySelectorAll('#productList tr').forEach(row => {
        let product = {
            name: row.cells[0].textContent,
            brand: row.cells[1].textContent,
            expiry: formatDateForInput(row.cells[2].textContent),
            quantity: row.cells[3].textContent
        };
        productList.push(product);
    });
    localStorage.setItem('products', JSON.stringify(productList));
    document.getElementById('saveChanges').style.display = 'none';
}

function formatDateForInput(formattedDate) {
    const parts = formattedDate.split('/');
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;  // Convert back to YYYY-MM-DD format
}

window.onload = loadProducts;
