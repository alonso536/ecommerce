import { Router } from "express";
import { noAuth } from "../middlewares/no-auth.js";
import passport from "passport";

import * as controller from "../controllers/views.js";
import { passwordRecovery } from "../middlewares/password-recovery.js";
import { permitRoles } from "../middlewares/permitRoles.js";

const router = Router();

router.get("/register", [
    noAuth
], controller.register);

router.get(["/", "/login"], [
    noAuth
], controller.login);

router.get("/forgot-password", [
    noAuth
], controller.forgotPassword);

router.get("/password-recovery", [
    noAuth,
    passwordRecovery
], controller.passwordRecovery)

router.get("/chat", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
], controller.chat);

router.get("/products", [
    passport.authenticate("jwt", { session: false })
], controller.products);

router.get("/profile", [
    passport.authenticate("jwt", { session: false })
], controller.profile);

router.get("/upload-documents", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER"])
], controller.uploadDocuments)

router.get("/add", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_ADMIN", "ROLE_PREMIUM"]),
], controller.addProduct);

router.get("/edit", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_ADMIN", "ROLE_PREMIUM"]),
], controller.editProduct);

router.get("/cart", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
], controller.cart);

router.get("/ticket", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
], controller.ticket);

export default router;
