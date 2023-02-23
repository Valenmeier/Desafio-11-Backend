import { Router } from "express";
import { passportCall } from "../../middlewares/authMiddlewares.js";
import { MessagesController } from "./messageController.js";

const router = Router();

router.get(`/`, passportCall("jwt"), async (req, res) => {
  const loadMessages = MessagesController.getMessages();
  return loadMessages;
});

router.post(`/`, passportCall("jwt"), async (req, res) => {
  let mensaje = MessagesController.createMessages(req.body);
  return mensaje.payload;
});

export default router;
