import { Router } from "express";

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
            msg: "Carrito creado con exito"
        });
    } catch(err) {
        msg: err.toString();
    }
    
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        let cart = await cartManager.getCartById(cid);

        return res.status(200).json({
            cart
        });

    } catch(error) {
        return res.status(404).json({
            msg: error.toString()
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
    } catch(error) {
        return res.status(400).json({
            msg: error.toString()
        });
    }
});

export default router;