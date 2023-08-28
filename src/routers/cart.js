import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";

// Descomentar para usar fileSystem
// import CartManager from "../dao/fileSystem/services/cartManager.js";

// Descomentar para usar base de datos
import CartManager from "../dao/db/services/cartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        await cartManager.addCart();

        return res.status(201).json({
            msg: "Carrito creado con exito",
        });
    } catch (err) {
        msg: err.toString();
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        let cart = await cartManager.getCartById(cid);

        return res.status(200).json({
            cart,
        });
    } catch (error) {
        return res.status(404).json({
            msg: error.toString(),
        });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await cartManager.addProductToCart(cid, pid);

        return res.status(201).json({
            msg: "Producto agregado al carrito",
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await cartManager.removeProductToCart(cid, pid);

        return res.status(201).json({
            msg: "Producto eliminado del carrito",
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
});

router.put(
    "/:cid",
    [
        check("products", "Los productos son obligatorios").notEmpty(),
        validateFields,
    ],
    async (req, res) => {
        const { cid } = req.params;
        const { products = [] } = req.body;

        try {
            await cartManager.updateCart(cid, products);

            return res.status(201).json({
                msg: "Carrito actualizado con exito",
            });
        } catch (error) {
            return res.status(400).json({
                msg: error.toString(),
            });
        }
    }
);

router.put(
    "/:cid/product/:pid",
    [
        check("quantity", "La cantidad es obligatoria").notEmpty(),
        check("quantity", "La cantidad debe ser un número").isNumeric(),
        validateFields,
    ],
    async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            await cartManager.updateProductToCart(cid, pid, quantity);

            return res.status(201).json({
                msg: "Cantidad del producto actualizada con exito",
            });
        } catch (error) {
            return res.status(400).json({
                msg: error.toString(),
            });
        }
    }
);

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        await cartManager.clearCart(cid);

        return res.status(201).json({
            msg: "Carrito limpiado con exito",
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
});

export default router;
