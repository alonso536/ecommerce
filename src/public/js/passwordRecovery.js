const form = document.querySelector("form");
const success = document.querySelector("#success");
const error = document.querySelector("#error");
const errorTexts = [...document.querySelectorAll(".error-text")];

const showErrors = ({ srcElement }, errors) => {
    errors.forEach(({ path, msg }) => {
        for(let i = 0; i < srcElement.length - 1; i++) {
            if(path == srcElement[i].name) {
                errorTexts[i].innerText = msg;
                break;
            }
        };
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();
    success.innerText = "";
    error.innerText = "";

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const password2 = document.querySelector("#password2").value;

    fetch(`/api/sessions/password-recovery/${email}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password,
            password2
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if(result.errors) {
            showErrors(e, result.errors);
        }
        else if(result.error) {
            error.innerText = "La contraseña sebe ser distinta de la anterior";
        }
        else {
            success.innerHTML = `La contraseña ha sido actualizada exitosamente. <a href="http://localhost:8080/login">Iniciar sesión</a>`;
        }
    })
    .catch(err => {
        error.innerText = err;
    });
});