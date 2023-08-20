import MessageManager from "../dao/db/services/messageManager.js";

const messageManager = new MessageManager();

export const socketController = async (socket, io) => { 
    const messages = await messageManager.getMessages();
    socket.emit("last-messages", messages.reverse());

    socket.on("send-message", async payload => {
        const message = await messageManager.addMessage(payload);
        const messages = await messageManager.getMessages();
        io.emit("last-messages", messages.reverse());
    });
}