import TicketManager from "../dao/db/services/ticketManager.js";

const ticketManager = new TicketManager();

export const index = async (req, res) => {
    const { id } = req.user;
    try {
        const tickets = await ticketManager.getAll(id);

        return res.status(201).json({
            tickets
        });

    } catch(error) {
        return res.status(400).json({
            error: error.toString()
        });
    }
}