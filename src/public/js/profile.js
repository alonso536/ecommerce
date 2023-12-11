const idUser = document.querySelector("#idUser");
const errorText = document.querySelector("#error-text");
const form = document.querySelector("#formProfile");
const deleteUsersButton = document.querySelector("#deleteUsersButton");

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

    fetch(`/api/uploads/users/${idUser.value}`, {
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

deleteUsersButton.addEventListener("click", () => {
    fetch(`/api/users`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(result => {
        location.reload();
    })
    .catch(err => {
        //sconsole.log(err);
    });
});