const form = document.querySelector("form");
const errorTexts = [...document.querySelectorAll(".error-text")];
const idProduct = document.querySelector("#idProduct").value;

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

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    if(idProduct != "") {
        fetch(`/api/products/${idProduct}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        .then(response => response.json())
        .then(result => {
            if(result.errors) {
                showErrors(e, result.errors);
            }
            else {
                window.location = "/products";
            }
        })
        .catch(err => {
            
        });
    } else {
        fetch("/api/products", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        .then(response => response.json())
        .then(result => {
            if(result.errors) {
                showErrors(e, result.errors);
            }
            else {
                window.location = "/products";
            }
        })
        .catch(err => {
            
        });
    }
});