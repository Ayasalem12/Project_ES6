/**============ Header & Footer ========= */
// const loadComponent = async(id,file) => {
//     let element = document.getElementById(id);
//     if(element){
//         let response = await fetch(file);
//         let data = await response.text();
//         element.innerHTML = data;
//     }
// }
// window.addEventListener("DOMContentLoaded",() =>{
//     loadComponent("header","../Pages/header.html");
//     loadComponent("footer","../Pages/footer.html");
// })


/**============= Cart Page & Product ====================== */
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.cart-list');
let iconCart = document.querySelector('.nav-shop');
let iconCartSpan = document.querySelector('.nav-shop span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let linkCart = document.getElementById('cartshow');
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

let cartOverlay = document.createElement('div');
cartOverlay.classList.add('cart-overlay');
document.body.appendChild(cartOverlay);

iconCart.addEventListener('click', () => body.classList.toggle('showCart'));
linkCart.addEventListener('click', () => body.classList.toggle('showCart'));
closeCart.addEventListener('click', () => body.classList.remove('showCart'));
cartOverlay.addEventListener('click', () => body.classList.remove('showCart'));

const fetchData = async () => {
    try {
        let response = await fetch('../data/products.json');
        products = await response.json();
        addDataToHTML(products);
        addCartToHTML();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};


const addDataToHTML = (products) => {
    listProductHTML.innerHTML = '';   

    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <a href="../Pages/product-details.html?id=${product.id}" class="more-details">
                    <button class="details-btn">More Details</button>
                </a>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });

        attachAddToCartEvents();
    } else {
        listProductHTML.innerHTML = "<p>No products found in this category.</p>";
    }
};


const attachAddToCartEvents = () => {
    document.querySelectorAll('.addCart').forEach(button => {
        button.addEventListener('click', (event) => {
            let productId = event.target.closest('.item').dataset.id;
            addToCart(productId);
        });
    });
};

const applyFilter = (selectedCategory) => {
    let filteredProducts = selectedCategory === "all" ? products : products.filter(product => product.category === selectedCategory);
    addDataToHTML(filteredProducts);
};
 
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        applyFilter(event.target.value);
    });
});

const addToCart = (product_id) => {
    let existingItem = cart.find(item => item.product_id == product_id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product_id: product_id, quantity: 1 });
    }

    addCartToHTML();
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = ''; 
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            let product = products.find(p => p.id == item.product_id);
            if (!product) return;   

            totalQuantity += item.quantity;
            totalPrice += product.price * item.quantity;

            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            newItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
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
    document.querySelector('.total-section').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
};

listCartHTML.addEventListener('click', (event) => {
    let target = event.target;
    if (target.classList.contains('minus') || target.classList.contains('plus')) {
        let product_id = target.closest('.item').dataset.id;
        let isAdding = target.classList.contains('plus');
        changeQuantityCart(product_id, isAdding);
    }
});

const changeQuantityCart = (product_id, isAdding) => {
    let item = cart.find(item => item.product_id == product_id);
    if (!item) return;

    if (isAdding) {
        item.quantity += 1;
    } else {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.product_id != product_id);
        }
    }

    addCartToHTML();
    localStorage.setItem('cart', JSON.stringify(cart));
};

fetchData();

/**======================== Scroll Up ================================ */
let mybutton = document.getElementById("myBtn");

window.onscroll = function() {
    mybutton.style.display = (document.documentElement.scrollTop > 20) ? "block" : "none";
};

function topFunction() {
    document.documentElement.scrollTop = 0;
}

/**======================== Delivered Msg =============================== */
const showAlert = () => {
    alert("🎉 Thanks, Customer! Your order is on its way! 🚚");
};

document.querySelector('.return-home-btn').addEventListener('click', ()=>showAlert);

/**======================== Slider ================================ */
document.addEventListener("DOMContentLoaded", function () {
    var sliderImages = document.querySelectorAll(".slides_image");
    var dots = document.querySelectorAll(".dot");
    var currentIndex = 0;
    var interval;

    if (sliderImages.length === 0 || dots.length === 0) {
        console.error("Error: No slides or dots found.");
        return; // منع تنفيذ الكود في حالة عدم وجود العناصر
    }

    function showSlide(index) {
        sliderImages.forEach((img, i) => {
            img.style.display = i === index ? "block" : "none";
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % sliderImages.length;
        showSlide(currentIndex);
    }

    function currentSlide(index) {
        clearInterval(interval);
        showSlide(index);
    }

    function startSlider() {
        showSlide(currentIndex);
        interval = setInterval(nextSlide, 2000);
    }

    startSlider();

    // Attach event listeners to dots
    dots.forEach((dot, i) => {
        dot.addEventListener("click", function () {
            currentSlide(i);
        });
    });
});
