import { Server } from "socket.io";
import dotenv from "dotenv";
import { ProductsController } from "../components/products/productsController.js";
import { MessagesController } from "../components/chats/messageController.js";

dotenv.config();
const port = process.env.PORT || 8080;

export let socketServer = (app) => {
  const httpServer = app.listen(port, () => {
    console.log(`servidor escuchando en el puerto 8080`);
  });
  const io = new Server(httpServer);
  io.on(`connection`, async (socket) => {
    socket.emit(`datos`, await ProductsController.getAllProducts());
    socket.emit("messages", await MessagesController.getMessages());
    socket.on("newMessage", async (data) => {
      await MessagesController.createMessage(data);
      io.emit("messages", await messagesModel.find());
    });
  });
};
