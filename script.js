'use strict';

const url = 'https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json';

const main = document.querySelector('main');

const productListItems = document.querySelector('.product-list__items');
const filterProducts = document.querySelector('.product-list__filter--input');
const sortProducts = document.querySelector('#product-list__sort--select');

const cartList = document.querySelector('.cart-list')
const shoppingCartGoBack = document.querySelector('.cart-list__go-back')
const clearCart = document.querySelector('.cart-list__remove-items')
const cartProducts = document.querySelector('.cart-list__products');
const hungryInfo = document.querySelector('.cart-list__empty');
const checkout = document.querySelector('.cart-list__checkout');
const total = document.querySelector('.cart-list__total');

const shoppingCartGoTo = document.querySelector('.shopping-cart')
const shoppingCartButtonTotal = document.querySelector('.shopping-cart__price');

const spinner = document.querySelector('.spinner');


const products = [];
const cart = JSON.parse(localStorage.getItem('cartStorage')) || [];
updateCart();

fetch(url)
    .then(response => response.json())
    .then(data => Array.prototype.push.apply(products, data))
    .then(() => renderPizza(products))


function renderPizza(products) {

    sortPizza(products);
    let result = '';

    if (products.length) {
        products.forEach(({ id, title, image, ingredients, price }) => {

            result += `
                <div class="product-item">
                    <div class="product-item__content">
    
                        <div class="product-item__image">
                            <img src="${image}" alt="${title}">
                        </div>
    
                        <div class="product-item__info">
    
                            <div class="product-item__title">
                                <h3 class="product-item__title-text">${title}</h3>
                            </div>
                            <div class="product-item__description">
                                ${ingredients.join(', ')}
                            </div>
                            
                        </div>
    
                        <div class="product-item__checkout">
    
                            <div class="product-item__price-bar">
                                <div>${price.toFixed(2)} zł</div>
                            </div>
    
                            <div class="product-item__cart-bar">
                                <button class="product-item__button button button__main" data-product-id="${id}">Zamów</button>
                            </div>
    
                        </div>
    
                    </div>
                </div>
            `;

            productListItems.innerHTML = result;

            // handler for buttons to add products to cart
            document.querySelectorAll('.product-item__button').forEach(item => {
                item.addEventListener('click', () => {
                    const productId = parseInt(item.dataset.productId)
                    addToCart(productId)
                })

            })

        });
        
    } else {
        result += `
            <div class="product-list__not-found">
                brak wyników wyszukiwania dla: ${filterProducts.value}
            </div>
        `;
        productListItems.innerHTML = result;
    }

}

function sortPizza(products) {
    const sortOption = sortProducts.value;
    switch (sortOption) {
        case 'nameAscending':
            products.sort((a, b) => sortAtoZ(a, b));
            break;
        case 'nameDescending':
            products.sort((a, b) => sortZtoA(a, b));
            break;
        case 'priceAscending':
            products.sort((a, b) => priceAscending(a, b));
            break;
        case 'priceDescending':
            products.sort((a, b) => priceDescending(a, b));
            break;
        default:
            products.sort((a, b) => sortAtoZ(a, b));
            break;
    }
    return products;
}


// filter products by providing ingredients to search bar
filterProducts.addEventListener('input', () => filterPizza())
// sort products by selecting sorting option and considering products filtration 
sortProducts.addEventListener('change', () => filterPizza())


function filterPizza() {
    const filterIngredients = filterProducts.value.toUpperCase().replace(/\s/g, '').split(',')
    const filteredProducts = products.filter(product =>
        filterIngredients.every(searchProduct => product.ingredients.some(ingredient => ingredient.toUpperCase().includes(searchProduct)))
    )
    renderPizza(filteredProducts)
}

// sort functions
function sortAtoZ(a, b) {
    return a.title.localeCompare(b.title)
}

function sortZtoA(a, b) {
    return b.title.localeCompare(a.title)
}

function priceAscending(a, b) {
    return (a.price > b.price) ? 1 : (a.price === b.price) ? (a.title.localeCompare(b.title)) : -1
}

function priceDescending(a, b) {
    return (a.price < b.price) ? 1 : (a.price === b.price) ? (b.title.localeCompare(a.title)) : -1
}

// add selected product to cart, if present increase quantity of selected product +1
function addToCart(id) {
    const productInCart = cart.find(item => item.id === id)

    if (productInCart) {
        productInCart.itemsQuantity++
    } else {
        const item = products.find(product => product.id === id)
        cart.push({
            ...item,
            itemsQuantity: 1,
        })
    }

    updateCart();
}

// decrease quantity of selected product -1, if quantity===1 -remove one item from cart
function removeItemFromCart(id) {
    const productInCart = cart.find(item => item.id === id)
    const index = cart.findIndex(item => item.id === id)

    if (productInCart.itemsQuantity > 1) {
        productInCart.itemsQuantity--
    } else {
        cart.splice(index, 1)
    }

    updateCart();
}

// clear cart and remove all items
clearCart.addEventListener('click', () => {
    cart.length = 0;
    updateCart()
})

function updateCart() {
    renderCartProducts();
    renderTotal();

    localStorage.setItem('cartStorage', JSON.stringify(cart))
}

function renderCartProducts() {

    cartProducts.innerHTML = "";
    cart.forEach((item) => {
        const { id, title, price, itemsQuantity } = item;

        if (item.itemsQuantity >= 1) {
            cartProducts.innerHTML += `
            <div class="cart-item">
                <div class="cart-item__content">

                    <div class="cart-item__info">

                        <div class="cart-item__info--left">

                            <div class="cart-item__units">
                                ${itemsQuantity}&nbsp;x&nbsp;
                            </div>

                            <div class="cart-item__title" >
                                <h4>${title}</h4>
                            </div>

                        </div>

                        <div class="cart-item__info--right">

                            <div class="cart-item__delete">
                                <button class="cart-item__button button button__delete" data-cart-id="${id}">Usuń</button>
                            </div>

                            <div class="cart-item__unit-price">
                                 ${price.toFixed(2)}&nbsp;zł
                            </div>

                        </div>

                    </div>

                </div>
            </div>
            `
        }

        // handler for buttons to delete products from cart
        document.querySelectorAll('.cart-item__button').forEach(item => {
            item.addEventListener('click', () => {
                const cartId = parseInt(item.dataset.cartId)
                removeItemFromCart(cartId)
            })
        })
    })
}

function renderTotal() {
    let totalPrice = 0,
        totalItems = 0;

    cart.forEach((item) => {
        totalPrice += item.price * item.itemsQuantity;
        totalItems += item.itemsQuantity;
    });

    total.innerHTML = `${totalPrice.toFixed(2)} zł`;
    shoppingCartButtonTotal.innerHTML = `${totalPrice.toFixed(2)} zł`
    shoppingCartListener(totalItems);
}


// onclick go to shopping cart 
shoppingCartGoTo.addEventListener('click', () => {
    cartList.classList.add('active')
    document.body.classList.add('scroll-lock')
})

// onclick return to products list from shopping cart
shoppingCartGoBack.addEventListener('click', () => {
    cartList.classList.remove('active')
    document.body.classList.remove('scroll-lock')
})

// if shoppingCart is empty - display hungry information
function shoppingCartListener(items) {
    if (items > 0) {
        hungryInfo.classList.add('hide')
        checkout.classList.remove('hide')
        clearCart.classList.remove('hide')
    } else {
        hungryInfo.classList.remove('hide')
        checkout.classList.add('hide')
        clearCart.classList.add('hide')
    }
}

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "interactive") {
        main.classList.add('hidden')
        spinner.classList.remove('hidden', 'hide')
        spinner.classList.add('flex')

    } else if (event.target.readyState === 'complete') {
        spinner.classList.remove('flex')
        spinner.classList.add('hidden', 'hide')
        main.classList.remove('hidden')
    }
})