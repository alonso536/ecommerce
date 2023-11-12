// Descomentar para usar fileSystem
// import ProductManager from "../dao/fileSystem/services/productManager.js";

// Descomentar para usar base de datos
import ProductManager from "../dao/db/services/productManager.js";

const productManager = new ProductManager();

export const index = async (req, res) => {
    const { limit = 10, page = 1, sort = null, query = null } = req.query;
    const products = await productManager.getProducts(limit, page, sort, query);

    return res.status(200).json({
        products,
    });
}

export const store = async (req, res) => {
    const { title, description, code, price, stock, category } = req.body;

    let isSameCode = await productManager.isSameCode(code);

    if (isSameCode) {
        return res.status(400).json({
            error: `Ya existe un producto con el código ${code}`,
        });        
    }

    const product = { title, description, code, price, stock, category, owner: req.user.id };
    productManager.addProduct(product);

    return res.status(201).json({
        product,
    });
}

export const show = async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await productManager.getProductById(pid);

        return res.status(200).json({
            product,
        });
    } catch (error) {
        return res.status(404).json({
            msg: error.toString(),
        });
    }
}

export const update = async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category } = req.body;

    try {
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
        };
        const productId = await productManager.updateProduct(
            pid,
            newProduct
        );

        return res.status(200).json({
            msg: `El id actualizado es: ${productId}`,
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
}

export const destroy = async (req, res) => {
    const { pid } = req.params;

    try {
        const productId = await productManager.deleteProduct(pid);

        return res.status(200).json({
            msg: `El id eliminado es: ${productId}`,
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
}

export const uploadImg = async (req, res) => {
    const files = req.files;
    const { pid } = req.params;

    try {
        await productManager.uploadImg(files, pid);

        return res.status(200).json({
            msg: "Subida de imagenes exitosa",
        });
    } catch (error) {
        return res.status(400).json({
            error: error.toString(),
        });
    }
}

export const showImg = async (req, res) => {
    const { pid } = req.params;

    try {
        let img = await productManager.showImg(pid);
        return res.sendFile(img);
    } catch (error) {
        return res.status(404).json({
            msg: error.toString(),
        });
    }
}