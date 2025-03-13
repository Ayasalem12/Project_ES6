// Select necessary DOM elements
let listProductHTML = document.querySelector('.list-Product');
let listCartHTML = document.querySelector('.cart-list');
let iconCart = document.querySelector('.nav-shop');
let iconCartSpan = document.querySelector('.nav-shop span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let linkCart = document.getElementById('cartshow');
let products = [];
let cart = [];

// Toggle cart visibility
iconCart.addEventListener('click', () => body.classList.toggle('showCart'));
linkCart.addEventListener('click', () => body.classList.toggle('showCart'));
closeCart.addEventListener('click', () => body.classList.toggle('showCart'));

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
let product_id = params.get('id'); // Get the "id" from URL

// Function to add product data to HTML
const addDataToHTML = (product_id) => {
    if (!product_id || products.length === 0) return;

    // Find the product by ID
    let product = products.find(item => item.id == product_id);
    if (!product) {
        listProductHTML.innerHTML = '<h2>Product not found</h2>';
        return;
    }

    let newProduct = document.createElement('div');
    newProduct.dataset.id = product.id;
    newProduct.classList.add('item');
    newProduct.innerHTML = `
        <img src="${product.image}" alt="">
        <h2>${product.name}</h2>
        <div class="price">$${product.price}</div>
        <button class="addCart">Add To Cart</button>
    `;
    listProductHTML.appendChild(newProduct);
};

// Add event listener to handle "Add To Cart" button clicks
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Function to add products to the cart
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);

    if (positionThisProductInCart < 0) {
        cart.push({ product_id: product_id, quantity: 1 });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }

    addCartToHTML();
    addCartToMemory();
};

// Save cart data to localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Display cart items in HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];

            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newItem);
        });
    }

    iconCartSpan.innerText = totalQuantity;
};

// Event listener for updating cart quantities
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.closest('.item').dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

// Function to update cart item quantity
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

    if (positionItemInCart >= 0) {
        let item = cart[positionItemInCart];

        if (type === 'plus') {
            item.quantity += 1;
        } else {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.splice(positionItemInCart, 1);
            }
        }
    }

    addCartToHTML();
    addCartToMemory();
};

// Initialize application
const initApp = () => {
    // Fetch product data
    fetch('../data/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML(product_id);

            // Load cart data from localStorage
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

// Start the application
initApp();
