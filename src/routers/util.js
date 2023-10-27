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

router.get("/loggerTest", async (req, res) => {
    let environment = (process.env.NODE_ENV == "prod") ? "producción" : "desarrollo";

    req.logger.debug(`Probando logger en debug en entorno de ${environment}`);
    req.logger.http(`Probando logger en http en entorno de ${environment}`);
    req.logger.info(`Probando logger en info en entorno de ${environment}`);
    req.logger.warning(`Probando logger en warning en entorno de ${environment}`);
    req.logger.error(`Probando logger en error en entorno de ${environment}`);
    req.logger.fatal(`Probando logger en fatal en entorno de ${environment}`);


    return res.json({
        msg: "Probando logs..."
    });
});

export default router;