import { Router } from "express";
import { check } from "express-validator";
import passport from "passport";

import { validateFields } from "../middlewares/validateFields.js";
import * as controller from "../controllers/cart.js";
import { validateStock } from "../middlewares/validateStock.js";
import { permitRoles } from "../middlewares/permitRoles.js";
import { isNotOwner } from "../middlewares/isNotOwner.js";

const router = Router();

router.get("/", controller.index);

router.post("/", controller.store);

router.get("/:cid", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    validateFields
], controller.show);

router.post("/:cid/product/:pid", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    isNotOwner,
    validateFields
], controller.add);

router.delete("/:cid/product/:pid", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    isNotOwner,
    validateFields
], controller.remove);

router.put("/:cid", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    check("products", "Los productos son obligatorios").notEmpty(),
    validateFields,
], controller.update);

router.put("/:cid/product/:pid", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    isNotOwner,
    validateStock,
    check("quantity", "La cantidad es obligatoria").notEmpty(),
    check("quantity", "La cantidad debe ser un número").isNumeric(),
    validateFields,
], controller.edit);

router.delete("/:cid", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    validateFields
], controller.destroy);

router.post("/:cid/purchase", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    validateFields
], controller.purchase);

export default router;
