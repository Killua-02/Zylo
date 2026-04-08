export const cart=[];

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
}