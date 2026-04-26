import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateCartQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatMoney } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let orderSummaryHTML = "";

  // Loop through the items in the cart and create HTML for each item
  cart.forEach((cartItem) => {
    // Find the matching product in the products array
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    orderSummaryHTML += ` 
      <div class="cart-item-container js-cart-item-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
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
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>`;
  });
  // Insert the product summary HTML into the page
  document.querySelector(".js-order-summary").innerHTML = orderSummaryHTML;
  updateQuantity();

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryoption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryoption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryoption.priceCents === 0
          ? "Free"
          : `$${formatMoney(deliveryoption.priceCents)} - `;

      const isChecked = deliveryoption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id='${matchingProduct.id}'
          data-delivery-option-id='${deliveryoption.id}'>
          <input type="radio" 
            ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
    });
    return html;
  }

  // Add event listeners to delete buttons
  document.querySelectorAll(".js-delete-quantity").forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const { productId } = deleteButton.dataset;
      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-${productId}`);
      container.remove();
      updateQuantity();
      renderPaymentSummary();
    });
  });

  function updateQuantity() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector(".js-checkout-header-quantity").innerHTML =
      cartQuantity;
  }

  document.querySelectorAll(".js-update-quantity").forEach((updateButton) => {
    updateButton.addEventListener("click", () => {
      const { productId } = updateButton.dataset;
      const container = document.querySelector(`.js-cart-item-${productId}`);
      container.classList.add("is-editing-quantity");

      container.querySelector(".js-update-quantity").classList.add("hidden");

      container.querySelector(".quantity-label").classList.add("hidden");
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((saveButton) => {
    saveButton.addEventListener("click", () => {
      const { productId } = saveButton.dataset;
      const container = document.querySelector(`.js-cart-item-${productId}`);
      const newQuantity = Number(
        container.querySelector(".quantity-input").value,
      );

      if (isNaN(newQuantity) || newQuantity <= 0 || newQuantity > 1000) {
        alert("Please enter a valid quantity between 1 and 1000.");
        return;
      }

      container.classList.remove("is-editing-quantity");
      container.querySelector(".js-update-quantity").classList.remove("hidden");
      container.querySelector(".quantity-label").classList.remove("hidden");

      updateCartQuantity(productId, newQuantity);
      container.querySelector(".quantity-label").innerHTML = newQuantity;
      updateQuantity();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const saveButton = input
          .closest(".cart-item-container")
          .querySelector(".save-quantity-link");
        saveButton.click();
      }
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
