const form = document.querySelector("form");
const error = document.querySelector("#error");

form.addEventListener("submit", e => {
    e.preventDefault();
    error.innerText = "";

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    fetch("/api/sessions/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    .then(response => response.json())
    .then(result => {
        if(result.msg) {
            error.innerText = result.msg;
        } else {
            window.location = "/products";
        }
    })
    .catch(err => {
        error.innerText = "Datos incorrectos";
    });
});