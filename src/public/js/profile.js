const idUser = document.querySelector("#idUser");
const errorText = document.querySelector("#error-text");
const form = document.querySelector("#formProfile");

form.addEventListener("submit", e => {
    e.preventDefault();

    errorText.innerText = "";

    const formData = new FormData();
    const file = document.querySelector("#file");

    if(!file.files[0]) {
        errorText.innerText = "La imagen es obligatoria"
        return;
    }

    formData.append("file", file.files[0]);

    fetch(`/api/users/${idUser.value}/profile`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if(result.error) {
            errorText.innerText = result.error;
        } else {
            location.reload();
        }
    })
    .catch(err => {
        errorText.innerText = err;
    });        
});