import { Router } from "express";
import ProductManager from "../dao/db/services/productManager.js";
import CartManager from "../dao/db/services/cartManager.js";
import { noAuth } from "../middlewares/no-auth.js";
import passport from "passport";

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
    passport.authenticate("jwt", { session: false })
], (req, res) => {
    res.render("chat", {
        title: "Sala de chat",
    });
});

router.get("/products", [
    passport.authenticate("jwt", { session: false })
], async (req, res) => {
    const { limit = 6, page = 1, sort = null, query = null } = req.query;
    const products = await productManager.getProducts(limit, page, sort, query);

    const user = req.user;

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
    passport.authenticate("jwt", { session: false })
], async (req, res) => {
    const user = req.user;

    res.render("profile", {
        title: "Perfil",
        user,
    });
});

router.get("/cart", [
    passport.authenticate("jwt", { session: false })
], async (req, res) => {
    try {
        const user = req.user;

        const cart = await cartManager.getCartById(user.cart);
        res.render("carts", {
            title: "Productos en el carrito",
            user,
            cart,
        });
    } catch (error) {
        res.render("error", {
            title: error.toString(),
        });
    }
});

export default router;
