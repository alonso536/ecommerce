import { Schema, SchemaTypes, model } from "mongoose";

const TicketSchema = Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        purchaser: {
            type: SchemaTypes.ObjectId,
            ref: "User"
        },
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
        timestamps: true,
    }
);

const Ticket = model("Ticket", TicketSchema);

export default Ticket;
