const getProductID = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Get the "id" from URL
};

let listProduct = document.querySelector('.list-Product');

// Fetch and display the product details
const displayProductDetails = async () => {
    const productId = getProductID();
    if (!productId) return;
    
    try {
        let response = await fetch('../data/products.json');
        let products = await response.json();
        
        // Find the product by ID
        let product = products.find(item => item.id == productId);
        
        // If product not found
        if (!product) {
            let newProduct = document.querySelector('.div-main');
            newProduct.innerHTML = '<h2>Product not found</h2>';
            listProduct.appendChild(newProduct);
            return;
        }

        // If product found, create element and append
        let newProduct = document.querySelector('.div-main');
        newProduct.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width:400px;">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <p>Product Material</p>
            <button class="btn-cart-product">Add To Cart</button>
        `;

        listProduct.appendChild(newProduct);

    } catch (error) {
        console.error("Error fetching product details:", error);
    }
};

// Call function
displayProductDetails();
