export let cart= JSON.parse(localStorage.getItem('cart')) ||
  [ {
    productId: "id1",
    quantity: 2,
  },
  {
    productId: "id2",
    quantity: 1,
  },];

function saveToLocalStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}

export function addToCart(productId){
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
    const quantity = Number(quantitySelector.value);
    if (cart.some((item) => item.productId === productId)) {
      const cartItem = cart.find((item) => item.productId === productId);
      cartItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity
      });
    }
    saveToLocalStorage();
}

export function removeFromCart(productId){
  const newCart = cart.filter((cartItem)=>{
    return cartItem.productId !== productId;
  });
  cart.length = 0;
  cart.push(...newCart);
  saveToLocalStorage();
}