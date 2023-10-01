import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { isCategoryValid } from "../helpers/validations.js";
import { uploads } from "../middlewares/multer.js";
import * as controller from "../controllers/product.js";

const router = Router();

router.get("/", controller.index);

router.post("/", [
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

router.get("/:pid", controller.show);

router.put("/:pid", [
    check("title", "El título es obligatorio").notEmpty().optional(),
    check("description", "La descripción es obligatoria").notEmpty().optional(),
    check("code", "El código es obligatorio").notEmpty().optional(),
    check("price", "El precio es obligatorio").notEmpty().optional(),
    check("price", "El precio debe ser un número").isNumeric().optional(),
    check("stock", "El stock es obligatorio").notEmpty().optional(),
    check("stock", "El stock debe ser un número").isNumeric().optional(),
    check("category", "La categoría es obligatoria").notEmpty().optional(),
    check("category").custom(isCategoryValid).optional(),
    validateFields,
], controller.update);

router.delete("/:pid", controller.destroy);

router.post("/img/:pid", uploads.array("file"), controller.uploadImg);

router.get("/img/:pid", controller.showImg);

export default router;
