import { Router } from "express";
import { generateMockProduct } from "../helpers/mockProducts.js";

const router = Router();

router.get("/mockingproducts", async (req, res) => {
    const products = [];
    for(let i = 0; i < 100; i++) {
        products.push(generateMockProduct());
    }

    return res.status(200).json({
        products
    });
});

export default router;