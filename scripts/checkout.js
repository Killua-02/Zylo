import { cart, removeFromCart, calculateCartQuantity, updateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";

let productSummaryHTML = "";
updateQuantity();

// Loop through the items in the cart and create HTML for each item
cart.forEach((cartItem) => {
  // Find the matching product in the products array
  const matchingProduct = products.find(
    (product) => product.id === cartItem.productId,
  );

  productSummaryHTML += ` 
    <div class="cart-item-container js-cart-item-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Wednesday, June 15
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatMoney(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class='quantity-input'>
            <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">save</span>
            <span class="delete-quantity-link link-primary js-delete-quantity" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>

          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
});
// Insert the product summary HTML into the page
document.querySelector(".js-order-summary").innerHTML = productSummaryHTML;

// Add event listeners to delete buttons
document.querySelectorAll(".js-delete-quantity").forEach((deleteButton) => {
  deleteButton.addEventListener("click", () => {
    const { productId } = deleteButton.dataset;
    removeFromCart(productId);

    const container = document.querySelector(`.js-cart-item-${productId}`);
    container.remove();
    updateQuantity();
  });
});

function updateQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector(".js-checkout-header-quantity").innerHTML =
    cartQuantity;
}

document.querySelectorAll(".js-update-quantity").forEach((updateButton) => {
  updateButton.addEventListener("click", () => {
    const {productId}=updateButton.dataset;
    const container=document.querySelector(`.js-cart-item-${productId}`);
    container.classList.add('is-editing-quantity');

    container.querySelector('.js-update-quantity').classList.add('hidden');

    container.querySelector('.quantity-label').classList.add('hidden');
  });
});

document.querySelectorAll('.save-quantity-link').forEach((saveButton) => {
  saveButton.addEventListener('click', () => {
    const { productId } = saveButton.dataset;
    const container=document.querySelector(`.js-cart-item-${productId}`);
    const newQuantity = Number(container.querySelector('.quantity-input').value);

    if(isNaN(newQuantity) || newQuantity <= 0 || newQuantity > 1000) {
      alert('Please enter a valid quantity between 1 and 1000.');
      return;
    }

    container.classList.remove('is-editing-quantity');
    container.querySelector('.js-update-quantity').classList.remove('hidden');
    container.querySelector('.quantity-label').classList.remove('hidden');


    updateCartQuantity(productId, newQuantity);
    container.querySelector('.quantity-label').innerHTML = newQuantity;
    updateQuantity();
  });
});

document.querySelectorAll('.quantity-input').forEach((input) => {
  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const saveButton = input.closest('.cart-item-container').querySelector('.save-quantity-link');
      saveButton.click();
    }
  });
});

