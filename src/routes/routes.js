import { Router } from "express";
import cartsRouter from "../components/carts/routes.js";
import chatRouter from "../components/chats/routes.js";
import productsRouter from "../components/products/routes.js";
import homeHandlebar from "../client/viewRoutes.js";
import userRouter from "../components/users/routes.js"

const router = Router();

router.use("/", homeHandlebar);
router.use("/session",userRouter)
router.use("/api/carts", cartsRouter);
router.use("/api/chat", chatRouter);
router.use("/api/products", productsRouter);

export default router;
