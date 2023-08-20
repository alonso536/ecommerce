import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { isCategoryValid } from "../helpers/validations.js";
import { uploads } from "../middlewares/multer.js";

// Descomentar para usar fileSystem
// import ProductManager from "../dao/fileSystem/services/productManager.js";

// Descomentar para usar base de datos
import ProductManager from "../dao/db/services/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    let products;
    if(limit) {
        products = await productManager.getProducts(limit);
    } else {
        products = await productManager.getProducts();
    }
    return res.status(200).json({
        products
    });
});

router.post("/", [
    check("title", "El título es obligatorio").notEmpty(),
    check("description", "La descripción es obligatoria").notEmpty(),
    check("code", "El código es obligatorio").notEmpty(),
    check("price", "El precio es obligatorio").notEmpty(),
    check("price", "El precio debe ser un número").isNumeric(),
    check("stock", "El stock es obligatorio").notEmpty(),
    check("stock", "El stock debe ser un número").isNumeric(),
    check("category", "La categoría es obligatoria").notEmpty(),
    check("category").custom(isCategoryValid),
    validateFields
], async (req, res) => {
    const { title, description, code, price, stock, category } = req.body;

    let isSameCode = await productManager.isSameCode(code);

    if(isSameCode) {
        return res.status(400).json({
            error: `Ya existe un producto con el código ${code}`
        });
    }

    const product = { title, description, code, price, stock, category };
    productManager.addProduct(product);

    return res.status(201).json({
        product
    });  
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    
    try {
        const product = await productManager.getProductById(pid);

        return res.status(200).json({
            product
        });
    } catch(error) {
        return res.status(404).json({
            msg: error.toString()
        });
    }
});

router.put("/:pid", [
    check("title", "El título es obligatorio").notEmpty().optional(),
    check("description", "La descripción es obligatoria").notEmpty().optional(),
    check("code", "El código es obligatorio").notEmpty().optional(),
    check("price", "El precio es obligatorio").notEmpty().optional(),
    check("price", "El precio debe ser un número").isNumeric().optional(),
    check("stock", "El stock es obligatorio").notEmpty().optional(),
    check("stock", "El stock debe ser un número").isNumeric().optional(),
    check("category", "La categoría es obligatoria").notEmpty().optional(),
    check("category").custom(isCategoryValid).optional(),
    validateFields
], async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category } = req.body;

    try {
        const newProduct = { title, description, code, price, stock, category };
        const productId = await productManager.updateProduct(pid, newProduct);

        return res.status(200).json({
            msg: `El id actualizado es: ${productId}`
        });
    } catch(error) {
        return res.status(400).json({
            msg: error.toString()
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    
    try {
        const productId = await productManager.deleteProduct(pid);

        return res.status(200).json({
            msg: `El id eliminado es: ${productId}`
        });
    } catch(error) {
        return res.status(400).json({
            msg: error.toString()
        });
    }
});

router.post("/img/:pid", uploads.array("file"), async (req, res) => {
    const files = req.files;
    const { pid } = req.params;

    try {
        await productManager.uploadImg(files, pid);

        return res.status(200).json({
            msg: "Subida de imagenes exitosa"
        });
    } catch(error) {
        return res.status(400).json({
            msg: error.toString()
        });
    }
});

router.get("/img/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        let img = await productManager.showImg(pid);
        return res.sendFile(img);
    } catch(error) {
        return res.status(404).json({
            msg: error.toString()
        });
    }
});

export default router;