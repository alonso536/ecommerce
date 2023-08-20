const user = sessionStorage.getItem("user");

if(!user) {
    window.location = "login";
}

const form = document.querySelector("form");
const messages = document.querySelector("#messages");

const showMessages = payload => {
    let html = "";

    payload.forEach(({ user, body }) => {
        html += `<p><b>${user} dice: </b>${body}</p>`;
    });

    messages.innerHTML = html;
}

const socket = io();

socket.on("connect", () => {
    console.log("Conectado");
});

socket.on("disconnect", () => {
    console.log("Desconectado");
});

socket.on("last-messages", showMessages);

form.addEventListener("submit", e => {
    e.preventDefault();
    const body = document.querySelector("#body").value;
    if(body.trim().length === 0) return;

    socket.emit("send-message", { user, body });
    form.reset();
});

