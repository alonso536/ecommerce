const buttons = [...document.querySelectorAll(".addToCart")];
const cartId = document.querySelector("#cartId").value;

buttons.forEach(button => {
    button.addEventListener("click", () => {
        addToCart(button.dataset.id);
    })
});

const addToCart = (productId) => {

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(result => {
        window.location = "/cart"
    })
    .catch(err => {
        console.log(err);
    });
}