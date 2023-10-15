import Message from "../models/message.js";

class MessageManager {
    async addMessage(message) {
        try {
            await Message.create(message);
            return message;
        } catch(err) {
            throw new Error("Error al insertar el mensaje");
        }
    }
    async getMessages() {
        return await Message.find().sort({ updatedAt: -1 }).limit(10).populate({
            path: "user",
            select: ["_id", "firstname", "lastname"]
        });
    }
}

export default MessageManager;