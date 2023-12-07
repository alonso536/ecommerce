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

export const uploadAvatar = async (req, res) => {
    const file = req.file;
    const { id } = req.params;

    try {
        await userManager.uploadAvatar(file, id);

        return res.status(200).json({
            msg: "Subida de imagenes exitosa",
        });
    } catch (error) {
        return res.status(400).json({
            error: error.toString(),
        });
    }
}

export const avatar = async (req, res) => {
    const { id } = req.params;

    try {
        let img = await userManager.showAvatar(id);
        return res.sendFile(img);
    } catch (error) {
        return res.status(404).json({
            msg: error.toString(),
        });
    }
}

export const documents = async (req, res) => {
    const files = req.files;
    const { id } = req.params;

    if(!files.identify || !files.domicile || !files.account_status) {
        userManager.deleteDocuments(files);
        return res.status(400).json({
            error: "Los archivos son obligatorios y solo se permiten archivos pdf"
        });
    }

    if(id != req.user.id) {
        userManager.deleteDocuments(files);
        return res.status(403).json({
            error: "Forbidden"
        });
    }

    try {
        await userManager.uploadDocuments(files, id);

        return res.status(200).json({
            msg: "Archivos subidos con exito"
        });
    } catch(error) {
        return res.status(400).json({
            error: error.toString()
        });
    }
}