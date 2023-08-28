import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        thumbnails: [
            {
                type: String,
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    }
);

ProductSchema.plugin(mongoosePaginate);

ProductSchema.methods.toJSON = function () {
    const { __v, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
};

const Product = model("Product", ProductSchema);

export default Product;
