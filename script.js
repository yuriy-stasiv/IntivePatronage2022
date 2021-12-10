
const url = 'https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json';

const productList = document.querySelector('.product-list__items');
const cartProducts = document.querySelector('.cart-list__products');
const hungryInfo = document.querySelector('.cart-list__empty');
const checkout = document.querySelector('.cart-list__checkout');
const total = document.querySelector('.cart-list__total');
const main = document.querySelector('main');
const spinner = document.querySelector('.spinner');


const products = [];
const cart = [];

fetch(url)
    .then(response => response.json())
    .then(data => data.forEach(item => products.push(item)))
    .then(() => renderPizza())


function renderPizza() {

    products.forEach((productItem) => {

        const { id, title, image, ingredients, price } = productItem

        productList.innerHTML += `
            <div class="product-item">
                <div class="product-item__content">

                    <div class="product-item__image">
                        <img src="${image}" alt="${title}">
                    </div>

                    <div class="product-item__info">

                        <div class="product-item__title">
                            <h3>${title}</h3>
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

        // handler for buttons to add products to cart
        document.querySelectorAll('.product-item__button').forEach(item => {
            item.addEventListener('click', () => {
                const productId = parseInt(item.dataset.productId)
                addToCart(productId)
            })

        })

    });

}

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

function updateCart() {
    renderCartProducts();
    renderTotal();
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
    shoppingCartListener(totalItems);
}


// if shoppingCart is empty - display hungry information
function shoppingCartListener(items) {
    if (items > 0) {
        hungryInfo.classList.add('hide')
        checkout.classList.remove('hide')

    } else {
        hungryInfo.classList.remove('hide')
        checkout.classList.add('hide')
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