import UserManager from "../dao/db/services/userManager.js";
import ProductManager from "../dao/db/services/productManager.js";

const userManager = new UserManager();
const productManager = new ProductManager();

export const update = async (req, res) => {
    // TODO: Habilitar la ruta para actualizar los datos del usuario

    return res.status(200).json({
        msg: "ok"
    })
}

export const premium = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userManager.setUserPremium(id);

        return res.status(200).json({
            msg: "Role del usuario actualizado exitosamente",
            user
        });
    } catch(error) {
        return res.status(400).json({
            error: error.toString()
        })
    }
}

export const destroy  = async (req, res) => {
    const { id } = req.params(id);

    try {
        const user = await userManager.findById(id);

        if(!user) {
            return res.status(404).json({
                error: `No existe un usuario con id ${id}`
            });
        }

        if(user.role == "ROLE_PREMIUM") {
            await productManager.deleteProductsByOwner(id);
        }

        await userManager.deleteUser(id);

        return res.status(200).json({
            msg: "Usuario eliminado exitosamente"
        });
    } catch(error) {
        return res.status(400).json({
            error: error.toString()
        })
    }
}