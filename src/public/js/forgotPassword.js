const form = document.querySelector("form");
const success = document.querySelector("#success");
const error = document.querySelector("#error");

form.addEventListener("submit", e => {
    e.preventDefault();
    success.innerText = "";
    error.innerText = "";

    const email = document.querySelector("#email").value;

    fetch("/api/sessions/forgot-password", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email
        })
    })
    .then(response => response.json())
    .then(result => {
        if(result.msg) {
            error.innerText = result.msg;
        } else if(result.errors) {
            error.innerText = result.errors[0].msg;
        } else {
            success.innerText = `Hemos enviado un correo a ${email} para recuperar su contraseña`;
        }
    })
    .catch(err => {
        error.innerText = "No se pudo encontrar el usuario";
    });
});