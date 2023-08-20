import { Schema, model } from "mongoose";

const CartSchema = Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
}, 
{
    timestamps: true
}
);

CartSchema.methods.toJSON = function() {
    const {__v, _id, ...cart} = this.toObject();
    cart.uid = _id;
    return cart;
}

const Cart = model("Cart", CartSchema);

export default Cart;