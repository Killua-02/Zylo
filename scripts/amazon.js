import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";

updateQuantity();

// Generate HTML for the products grid on the Amazon page
let productHTML = "";
products.forEach((product) => {
  productHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatMoney(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart-button
        " data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
});
// Insert the generated HTML into the products grid element on the page
document.querySelector(".js-products-grid").innerHTML = productHTML;

// Update the cart quantity in the cart icon in the header
function updateQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

let timeoutId;
// Show "Added to Cart" message when a product is added to the cart
function addedToCartMessage(productId) {
  const addedToCartElement = document.querySelector(
    `.js-added-to-cart-${productId}`,
  );
  // Make the "Added to Cart" message visible
  addedToCartElement.style.opacity = "1";

  clearTimeout(timeoutId);
  // After 2 seconds, hide the "Added to Cart" message
  timeoutId = setTimeout(() => {
    addedToCartElement.style.opacity = "0";
  }, 2000);
}

// Add event listeners to all "Add to Cart" buttons
document.querySelectorAll(".js-add-to-cart-button").forEach((button) => {
  const { productId } = button.dataset;
  // When an "Add to Cart" button is clicked, add the corresponding product to the cart, update the cart quantity in the header, and show the "Added to Cart" message
  button.addEventListener("click", () => {
    addToCart(productId);
    updateQuantity();
    addedToCartMessage(productId);
  });
});
