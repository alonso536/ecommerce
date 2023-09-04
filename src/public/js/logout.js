const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
    fetch("/api/sessions/logout", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(result => {
        if(result.status == "success") {
            window.location = "/";
        }
    });
});