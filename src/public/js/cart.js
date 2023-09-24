const updateButtons = [...document.querySelectorAll(".updateProduct")];
const deleteButtons = [...document.querySelectorAll(".removeProduct")];
const clearCartButton = document.querySelector("#clearCart");

updateButtons.forEach(button => {
    button.addEventListener("click", () => {
        updateProduct(clearCartButton.dataset.id, button.dataset.id);
    })
});

deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
        deleteProduct(clearCartButton.dataset.id, button.dataset.id);
    })
});

clearCartButton.addEventListener("click", () => {
    clearCart(clearCartButton.dataset.id);
});

const updateProduct = (cartId, productId) => {
    const quantity = document.getElementById(productId).value;

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quantity
        })
    }) 
    .then(response => response.json())
    .then(result => {
        window.location.reload();
    })
    .catch(err => {
        console.log(err);
    });
}

const deleteProduct = (cartId, productId) => {
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    }) 
    .then(response => response.json())
    .then(result => {
        window.location.reload();
    })
    .catch(err => {
        console.log(err);
    });
}

const clearCart = (cartId) => {
    fetch(`/api/carts/${cartId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    }) 
    .then(response => response.json())
    .then(result => {
        window.location.reload();
    })
    .catch(err => {
        console.log(err);
    });
}