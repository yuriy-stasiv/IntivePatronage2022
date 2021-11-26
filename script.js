
const url = 'https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json';

const productList = document.querySelector('.js-product-list__items');
const cartProducts = document.querySelector('.js-cart-list__products');
const hungryInfo = document.querySelector('.js-card-list__empty');
const checkout = document.querySelector('.js-card-list__checkout');
const total = document.querySelector(".js-card-list__total");

let products;
let cart = [];

fetch(url)
    .then(responce => responce.json())
    .then(data => products = data)
    .then(() => renderPizza())

function renderPizza() {

    products.forEach((productItem) => {
        productList.innerHTML += `
            <div class="product-item">
                <div class="product-item__content">

                    <div class="product-item__image">
                        <img src="${productItem.image}" alt="${productItem.title}">
                    </div>

                    <div class="product-item__info">

                        <div class="product-item__title">
                            <h3>${productItem.title}</h3>
                        </div>
                        <div class="product-item__description">
                            ${productItem.ingredients.join(', ')}
                        </div>
                        
                    </div>

                    <div class="product-item__checkout">

                        <div class="product-item__price-bar">
                            <div>${productItem.price.toFixed(2)} zł</div>
                        </div>

                        <div class="product-item__cart-bar">
                            <button class="product-item__button button button__main" onclick="addToCart(${productItem.id})">Zamów</button>
                        </div>

                    </div>

                </div>
            </div>
        `;
    });
}


function addToCart(id) {
    if (cart.some(item => item.id === id)) {
        quantityListener('increase', id)
    } else {
        const item = products.find(product => product.id === id)

        cart.push({
            ...item,
            itemsQuantity: 1,
        })
    }

    updateCart();
}

function removeItemFromCart(item) {
    cart = cart.filter(product => product !== item)
}

function updateCart() {
    renderCartProducts();
    renderTotal();
}

function renderCartProducts() {

    cartProducts.innerHTML = "";
    cart.forEach((item) => {
        if (item.itemsQuantity >= 1) {
            cartProducts.innerHTML += `
            <div class="cart-item">
                <div class="cart-item__content">

                    <div class="cart-item__info">

                        <div class="cart-item__info--left">

                            <div class="cart-item__units">
                                ${item.itemsQuantity}&nbsp;x&nbsp;
                            </div>

                            <div class="cart-item__title" >
                                <h4>${item.title}</h4>
                            </div>

                        </div>
                        
                        <div class="cart-item__info--right">

                            <div class="cart-item__delete">
                                <button class="cart-item__button button button__delete" onclick="quantityListener('decrease', ${item.id} )">Usuń</button>
                            </div>

                            <div class="cart-item__unit-price">
                                 ${item.price.toFixed(2)}&nbsp;zł
                            </div>

                        </div>
                        
                    </div>

                </div>
            </div>
            `
        } else {
            removeItemFromCart(item)
        }
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

function quantityListener(action, id) {
    cart = cart.map((item) => {

        let itemsQuantity = item.itemsQuantity;

        if (item.id === id) {
            switch (action) {
                case "decrease":
                    itemsQuantity--;
                    break;
                case "increase":
                    itemsQuantity++;
                    break;
                default:
                    alert('coś poszło nie tak')
            }
        }

        return {
            ...item,
            itemsQuantity,
        };

    });

    updateCart();
}

// if shoppingCart is empty - display hungry information
function shoppingCartListener(items) {
    if (items > 0) {
        hungryInfo.style.display = "none";
        checkout.style.display = "block";
    } else {
        hungryInfo.style.display = "block"
        checkout.style.display = "none";
    }
}

document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector(".spinner").style.visibility = "visible";
    } else {
        document.querySelector(".spinner").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};

