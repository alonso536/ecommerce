import { Router } from "express";
import { check } from "express-validator";
import passport from "passport";

import { validateFields } from "../middlewares/validateFields.js";
import { isCategoryValid } from "../helpers/validations.js";
import { uploads } from "../middlewares/multer.js";
import * as controller from "../controllers/product.js";
import { permitRoles } from "../middlewares/permitRoles.js";
import { isOwner } from "../middlewares/isOwner.js";

const router = Router();

router.get("/", [
    passport.authenticate("jwt", { session: false }),
    validateFields
], controller.index);

router.post("/", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_ADMIN", "ROLE_PREMIUM"]),
    check("title", "El título es obligatorio").notEmpty(),
    check("description", "La descripción es obligatoria").notEmpty(),
    check("code", "El código es obligatorio").notEmpty(),
    check("price", "El precio es obligatorio").notEmpty(),
    check("price", "El precio debe ser un número").isNumeric(),
    check("stock", "El stock es obligatorio").notEmpty(),
    check("stock", "El stock debe ser un número").isNumeric(),
    check("category", "La categoría es obligatoria").notEmpty(),
    check("category").custom(isCategoryValid),
    validateFields,
], controller.store);

router.get("/:pid", [
    passport.authenticate("jwt", { session: false }),
    check("pid", "Debe ser un id de mongo").isMongoId(),
    validateFields
], controller.show);

router.put("/:pid", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_ADMIN", "ROLE_PREMIUM"]),
    check("title", "El título es obligatorio").notEmpty().optional(),
    check("description", "La descripción es obligatoria").notEmpty().optional(),
    check("code", "El código es obligatorio").notEmpty().optional(),
    check("price", "El precio es obligatorio").notEmpty().optional(),
    check("price", "El precio debe ser un número").isNumeric().optional(),
    check("stock", "El stock es obligatorio").notEmpty().optional(),
    check("stock", "El stock debe ser un número").isNumeric().optional(),
    check("category", "La categoría es obligatoria").notEmpty().optional(),
    check("category").custom(isCategoryValid).optional(),
    isOwner,
    validateFields,
], controller.update);

router.delete("/:pid", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_ADMIN", "ROLE_PREMIUM"]),
    isOwner,
    validateFields,
], controller.destroy);

router.post("/:pid/img", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_ADMIN", "ROLE_PREMIUM"]),
    isOwner,
    uploads.array("file"),
    validateFields,
], controller.uploadImg);

router.get("/:pid/img", [
    passport.authenticate("jwt", { session: false }),
    validateFields,
], controller.showImg);

export default router;
