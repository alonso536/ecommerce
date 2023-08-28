import { Router } from "express";
import ProductManager from "../dao/db/services/productManager.js";
import CartManager from "../dao/db/services/cartManager.js";

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Iniciar sesión",
    });
});

router.get("/chat", (req, res) => {
    res.render("chat", {
        title: "Sala de chat",
    });
});

router.get("/products", async (req, res) => {
    const { limit = 6, page = 1, sort = null, query = null } = req.query;
    const products = await productManager.getProducts(limit, page, sort, query);

    if (page > products.totalPages) {
        res.render("error", {
            title: "No existen productos en esta página",
        });
    } else {
        res.render("products", {
            title: "Lista de productos",
            products,
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(cid);

        res.render("carts", {
            title: "Productos en el carrito",
            cart,
        });
    } catch (error) {
        res.render("error", {
            title: error.toString(),
        });
    }
});

export default router;
