import { Router } from "express";
import { check } from "express-validator";
import passport from "passport";

import { validateFields } from "../middlewares/validateFields.js";
import * as controller from "../controllers/cart.js";
import { isUser } from "../middlewares/isUser.js";
import { validateStock } from "../middlewares/validateStock.js";

const router = Router();

router.get("/", controller.index);

router.post("/", controller.store);

router.get("/:cid", [
    passport.authenticate("jwt", { session: false }),
    isUser,
    validateFields
], controller.show);

router.post("/:cid/product/:pid", [
    passport.authenticate("jwt", { session: false }),
    isUser,
    validateFields
], controller.add);

router.delete("/:cid/product/:pid", [
    passport.authenticate("jwt", { session: false }),
    isUser,
    validateFields
], controller.remove);

router.put("/:cid", [
    passport.authenticate("jwt", { session: false }),
    isUser,
    check("products", "Los productos son obligatorios").notEmpty(),
    validateFields,
], controller.update);

router.put("/:cid/product/:pid", [
    passport.authenticate("jwt", { session: false }),
    isUser,
    validateStock,
    check("quantity", "La cantidad es obligatoria").notEmpty(),
    check("quantity", "La cantidad debe ser un número").isNumeric(),
    validateFields,
], controller.edit);

router.delete("/:cid", [
    passport.authenticate("jwt", { session: false }),
    isUser,
    validateFields
], controller.destroy);

router.post("/:cid/purchase", [
    passport.authenticate("jwt", { session: false }),
    isUser,
    validateFields
], controller.purchase);

export default router;
