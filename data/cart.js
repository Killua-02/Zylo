export let cart = JSON.parse(localStorage.getItem("cart")) || [
  {
    productId: "id1",
    quantity: 2,
    deliveryOptionId: "1",
  },
  {
    productId: "id2",
    quantity: 1,
    deliveryOptionId: "2",
  },
];

// Function to save the cart to local storage
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// function to add an item to the cart
export function addToCart(productId) {
  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`,
  );
  const quantity = Number(quantitySelector.value);
  if (cart.some((item) => item.productId === productId)) {
    const cartItem = cart.find((item) => item.productId === productId);
    cartItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: "1",
    });
  }
  saveToLocalStorage();
}

export function updateDeliveryOption(productId,deliveryOptionId){
  const matchingItem = cart.find((item) => item.productId === productId);
  if(matchingItem){
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToLocalStorage();
  }
}

// function to update the quantity of an item after deleting it from the cart
export function removeFromCart(productId) {
  const newCart = cart.filter((cartItem) => {
    return cartItem.productId !== productId;
  });
  cart.length = 0;
  cart.push(...newCart);
  saveToLocalStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  return cartQuantity;
}

export function updateCartQuantity(productId, newQuantity) {
  // Implementation for updating cart quantity
  const cartItem = cart.find((item) => item.productId === productId);
  if (cartItem) {
    cartItem.quantity = newQuantity;
    saveToLocalStorage();
  }
}

