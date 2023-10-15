import TicketDto from "../dto/ticket.js";
import Ticket from "../models/ticket.js";
import { v4 as uuid } from "uuid";

class TicketManager {
    async getAll(idPurchaser) {
        const tickets = await Ticket.find({ purchaser: idPurchaser }).populate([{
            path: "products.product",
            select: ["title", "description", "price", "stock", "category"],
        }, {
            path: "purchaser",
            select: ["firstname", "lastname", "email", "age"]
        }]);
        return tickets
            .map(({ _id, code, createdAt, amount, purchaser, products }) => new TicketDto(_id, code, createdAt, amount, purchaser, products))
    }
    
    async addTicket(idPurchaser, totalAmount, products) {
        try {
            const productsDB = products.map(({ product, quantity }) => {
                return {
                    product: product._id,
                    quantity
                };
            });
            
            const data = {
                code: uuid(),
                amount: totalAmount,
                purchaser: idPurchaser,
                products: productsDB
            }

            const { _id, code, createdAt, amount, purchaser } = await Ticket.create(data);
            return new TicketDto(_id, code, createdAt, amount, purchaser);
        } catch (err) {
            throw new Error("Error al insertar el ticket");
        }
    }

    async getTicketById(idTicket) {
        const ticket = await Ticket.findById(idTicket).populate([{
            path: "products.product",
            select: ["title", "description", "price", "stock", "category"],
        }, {
            path: "purchaser",
            select: ["firstname", "lastname", "email", "age"]
        }]).lean();

        if(!ticket) {
            throw new Error(`No existe un ticket con el id ${idTicket}`);
        }

        return new TicketDto(ticket.id, ticket.code, ticket.createdAt, ticket.amount, ticket.purchaser, ticket.products);
    }
}

export default TicketManager;