import Product from "../dao/db/models/product.js";

export const validateStock = async (req, res, next) => {
    const { pid } = req.params;
    const { quantity } = req.body;

    const product = await Product.findOne({ _id: pid });

    if(!product) {
        return res.status(400).json({
            msg: `No existe un producto con id ${pid}`
        });
    }

    if(product.stock < quantity) {
        return res.status(400).json({
            error: 'No hay suficientes existencias'
        });
    }

    next();
}