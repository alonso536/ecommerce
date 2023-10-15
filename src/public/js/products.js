const getModal = (idProduct) => {
    return `
    <button type="button" class="btn btn-danger bg-gradient" data-bs-toggle="modal" data-bs-target="#exampleModal${idProduct}">
      Eliminar
    </button>
    
    <div class="modal fade" id="exampleModal${idProduct}" tabindex="-1" aria-labelledby="exampleModalLabel${idProduct}" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel${idProduct}">Eliminar producto</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Está seguro que desea eliminar este producto? Esta acción es irreversible.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary bg-gradient" data-bs-dismiss="modal">Cancelar</button>
            <button data-id=${idProduct} type="button" class="btn btn-danger bg-gradient deleteProduct">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
    `;
}

const getImageModal = (idProduct) => {
    return `
        <button type="button" class="btn bg-gradient btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop${idProduct}">
            Agregar imagen
        </button>

        <div class="modal fade" id="staticBackdrop${idProduct}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel${idProduct}" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel${idProduct}">Agregar imagen</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form data-id=${idProduct} class="formsImage" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label for="file">Imagen</label>
                        <input type="file" id="file${idProduct}" class="form-control" name="file" />
                        <small class="text-danger" id="error-text${idProduct}"></small>
                    </div>
                    <button
                    type="submit"
                    class="btn btn-primary bg-gradient bg-opacity-50 my-3">Agregar imagen</button>
                </form>
            </div>
            </div>
        </div>
        </div>
    `;
}

const clearError = (idProduct) => {
    const divError = document.getElementById(`error-text${idProduct}`);
    divError.innerText = '';
}

const showError = (msg, idProduct) => {
    const divError = document.getElementById(`error-text${idProduct}`);
    divError.innerText = msg;
}

const cartId = document.querySelector("#cartId").value;
const role = document.querySelector("#role").value;

const cards = [...document.querySelectorAll(".card-body")];

const showOptions = role => {
    cards.forEach(card => {
        if(role == "ROLE_ADMIN") {
            card.innerHTML += `
                <a href="edit?id=${card.dataset.id}" class="btn btn-success bg-gradient editProduct">Editar</a>
                ${getModal(card.dataset.id)}
                ${getImageModal(card.dataset.id)}
            `;
        } else {
            card.innerHTML += `
                <button data-id="${card.dataset.id}" class="btn btn-primary bg-gradient addToCart">Agregar al carro</button>
            `;
        }
    });
}

showOptions(role);

const buttonsAddCart = [...document.querySelectorAll(".addToCart")];
const buttonsDeleteProduct = [...document.querySelectorAll(".deleteProduct")];
const forms = [...document.querySelectorAll(".formsImage")];

buttonsAddCart.forEach(button => {
    button.addEventListener("click", () => {
        addToCart(button.dataset.id);
    })
});

buttonsDeleteProduct.forEach(button => {
    button.addEventListener("click", () => {
        deleteProduct(button.dataset.id);
    })
});

forms.forEach(form => {
    form.addEventListener("submit", e => {
        e.preventDefault();

        clearError(form.dataset.id);

        const formData = new FormData();
        const file = document.getElementById(`file${form.dataset.id}`);

        if(!file.files[0]) {
            showError("La imagen es obligatoria", form.dataset.id);
            return;
        }

        formData.append("file", file.files[0]);

        fetch(`/api/products/img/${form.dataset.id}`, {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if(result.error) {
                showError(result.msg, form.dataset.id)
            } else {
                location.reload();
            }
        })
        .catch(err => {
            showError(err.msg, form.dataset.id);
        });        
    });
});

const addToCart = (productId) => {

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(result => {
        window.location = "/cart"
    })
    .catch(err => {
        console.log(err);
    });
}

const deleteProduct = (productId) => {

    fetch(`/api/products/${productId}`, {
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
        console.log(err);
    });
}