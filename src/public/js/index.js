const form = document.querySelector("form");
const error = document.querySelector("#error");

form.addEventListener("submit", e => {
    e.preventDefault();
    error.innerText = "";

    const user = document.querySelector("#user").value;

    if(user.trim() == "") {
        error.innerText = "Debes ingresar un nombre de usuario";
    } else {
        sessionStorage.setItem("user", user.trim());
        window.location = "chat";
    }
});