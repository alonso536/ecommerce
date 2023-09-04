import { Router } from "express";
import ProductManager from "../dao/db/services/productManager.js";
import CartManager from "../dao/db/services/cartManager.js";
import { auth } from "../middlewares/auth-session.js";
import { validateFields } from "../middlewares/validateFields.js";
import { noAuth } from "../middlewares/no-auth.js";

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get(["/", "/login"], [
    noAuth
], (req, res) => {
    res.render("login", {
        title: "Iniciar sesión",
    });
});

router.get("/register", [
    noAuth
], (req, res) => {
    res.render("register", {
        title: "Registro de usuarios"
    })
})

router.get("/chat", [
    auth
], (req, res) => {
    res.render("chat", {
        title: "Sala de chat",
    });
});

router.get("/products", [
    auth
], async (req, res) => {
    const { limit = 6, page = 1, sort = null, query = null } = req.query;
    const products = await productManager.getProducts(limit, page, sort, query);
    const { user } = req.session;

    if (page > products.totalPages) {
        res.render("error", {
            title: "No existen productos en esta página",
            user
        });
    } else {
        res.render("products", {
            title: "Lista de productos",
            products,
            user
        });
    }
});

router.get("/profile", [
    auth
], (req, res) => {
    const { user } = req.session;

    res.render("profile", {
        title: "Perfil",
        user,
    });
});

router.get("/carts/:cid", [
    auth
], async (req, res) => {
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
