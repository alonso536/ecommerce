const idUser = document.querySelector("#idUser");
const errors = [...document.querySelectorAll(".error-text")];
const form = document.querySelector("#formDocuments");
const divSuccess = document.querySelector(".div-success");
const divError = document.querySelector(".div-error");

form.addEventListener("submit", e => {
    e.preventDefault();

    divSuccess.innerHTML = "";
    divError.innerHTML = "";

    errors.forEach(error => {
        error.innerHTML = "";
    });

    const formData = new FormData();
    let invalidForm = false;

    const identify = document.querySelector("#identify");
    if(!identify.files[0]) {
        errors[0].innerHTML = "La identificación es obligatoria"
        invalidForm = true;
    }

    const domicile = document.querySelector("#domicile");
    if(!domicile.files[0]) {
        errors[1].innerHTML = "El comprobante de domicilio es obligatorio"
        invalidForm = true;
    }

    const account_status = document.querySelector("#account_status");
    if(!account_status.files[0]) {
        errors[2].innerHTML = "El estado de cuenta es obligatorio"
        invalidForm = true;
    }

    if(invalidForm) return;

    formData.append("identify", identify.files[0]);
    formData.append("domicile", domicile.files[0]);
    formData.append("account_status", account_status.files[0]);

    fetch(`/api/users/${idUser.value}/documents`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if(result.error) {
            divError.innerHTML = result.error;
        } else {
            divSuccess.innerHTML = "Se ha enviado su solicitud. Tendrá una respuesta dentro de 24 horas."
        }
    })
    .catch(err => {
        divError.innerHTML = "Los documentos deben estar en formato pdf";
    });        
});