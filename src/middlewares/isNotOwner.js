import Product from "../dao/db/models/product.js";

export const isNotOwner = (req, res, next) => {
    const { pid } = req.params;
    const { id } = req.user;

    const product = Product.findById(pid);

    if(!product) {
        return res.status(404).json({
            msg: `No existe un producto con el id ${pid}`
        });
    }
    
    if(product.owner == id) {
        return res.status(403).json({
            msg: "Forbidden"
        });
    }

    next();
}