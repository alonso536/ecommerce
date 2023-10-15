import { Router } from "express";
import { noAuth } from "../middlewares/no-auth.js";
import passport from "passport";

import * as controller from "../controllers/views.js";
import { isUser } from "../middlewares/isUser.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/register", [
    noAuth
], controller.register);

router.get(["/", "/login"], [
    noAuth
], controller.login);

router.get("/chat", [
    passport.authenticate("jwt", { session: false }),
    isUser
], controller.chat);

router.get("/products", [
    passport.authenticate("jwt", { session: false })
], controller.products);

router.get("/profile", [
    passport.authenticate("jwt", { session: false })
], controller.profile);

router.get("/add", [
    passport.authenticate("jwt", { session: false }),
    isAdmin
], controller.addProduct);

router.get("/edit", [
    passport.authenticate("jwt", { session: false }),
    isAdmin
], controller.editProduct);

router.get("/cart", [
    passport.authenticate("jwt", { session: false }),
    isUser
], controller.cart);

router.get("/ticket", [
    passport.authenticate("jwt", { session: false }),
    isUser
], controller.ticket);

export default router;
