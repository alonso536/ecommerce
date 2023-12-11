import UploadManager from "../dao/db/services/uploadManager.js";
import Product from "../dao/db/models/product.js";
import User from "../dao/db/models/user.js";

const uploadManager = new UploadManager();

export const store = async (req, res) => {
    const { collection, id } = req.params;
    const { file } = req.files;
    let model;

    if(collection == "products" && req.user.role != "ROLE_ADMIN") {
        return res.status(403).send("Forbidden");
    }

    try {
        switch(collection) {
            case "users":
                model = await User.findById(id);
                break;
            case "products":
                model = await Product.findById(id);
                break;
            default:
                return res.status(400).json({
                    error: "La colección no es válida"
                });
        }

        if(!model) {
            return res.status(404).json({
                msg: `No existe un documento con el id ${id}`
            });
        }

        model = await uploadManager.upload(collection, model, file);

        return res.status(201).json({
            model,
            msg: "Imagen subida con exito"
        })

    } catch(error) {
        return res.status(400).json({
            error: error.toString()
        });
    }
}