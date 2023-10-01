import { Router } from "express";
import { noAuth } from "../middlewares/no-auth.js";
import passport from "passport";

import * as controller from "../controllers/views.js";

const router = Router();

router.get("/register", [
    noAuth
], controller.register);

router.get(["/", "/login"], [
    noAuth
], controller.login);

router.get("/chat", [
    passport.authenticate("jwt", { session: false })
], controller.chat);

router.get("/products", [
    passport.authenticate("jwt", { session: false })
], controller.products);

router.get("/profile", [
    passport.authenticate("jwt", { session: false })
], controller.profile);

router.get("/cart", [
    passport.authenticate("jwt", { session: false })
], controller.cart);

export default router;
