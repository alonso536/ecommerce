const actions = [...document.querySelectorAll(".actions")];

const getModal = (idUser) => {
    return `
    <button type="button" class="btn btn-danger bg-gradient btn-sm bg-gradient" data-bs-toggle="modal" data-bs-target="#exampleModal${idUser}">
      Eliminar
    </button>
    
    <div class="modal fade" id="exampleModal${idUser}" tabindex="-1" aria-labelledby="exampleModalLabel${idUser}" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel${idUser}">Eliminar usuario</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Está seguro que desea eliminar este usuario? Esta acción es destructiva y no se puede revertir.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary bg-gradient" data-bs-dismiss="modal">Cancelar</button>
            <button data-id=${idUser} type="button" class="btn btn-danger bg-gradient deleteUser">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
    `;
}

const showOptions = () => {
    actions.forEach(action => {
        action.innerHTML += getModal(action.dataset.id);
    });
}

showOptions();


const buttonsPremium = [...document.querySelectorAll(".add-premium")];
const divError = document.querySelector("#error-text");
const buttonsDeleteUser = [...document.querySelectorAll(".deleteUser")];

buttonsPremium.forEach(button => {
    button.addEventListener("click", () => {
        makePremium(button.dataset.id);
    });
});

buttonsDeleteUser.forEach(button => {
    button.addEventListener("click", () => {
        deleteUser(button.dataset.id);
    })
});

const makePremium = (userId) => {
    divError.innerText = "";

    fetch(`/api/users/premium/${userId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(result => {
        if(result.error) {
            divError.innerText = "Este usuario tiene documentos que llenar";
        } else {
            location.reload();
        }
    })
    .catch(err => {
        divError.innerText = "Este usuario tiene documentos que llenar";
    });
}

const deleteUser = (idUser) => {

    fetch(`/api/users/${idUser}`, {
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
        //console.log(err);
    });
}