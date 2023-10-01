import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import * as controller from "../controllers/cart.js";

const router = Router();

router.get("/", controller.index);

router.post("/", controller.store);

router.get("/:cid", controller.show);

router.post("/:cid/product/:pid", controller.add);

router.delete("/:cid/product/:pid", controller.remove);

router.put("/:cid", [
    check("products", "Los productos son obligatorios").notEmpty(),
    validateFields,
], controller.update);

router.put("/:cid/product/:pid", [
    check("quantity", "La cantidad es obligatoria").notEmpty(),
    check("quantity", "La cantidad debe ser un número").isNumeric(),
    validateFields,
], controller.edit);

router.delete("/:cid", controller.destroy);

export default router;
