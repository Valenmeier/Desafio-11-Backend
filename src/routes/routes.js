import { Router } from "express";
import cartsRouter from "../components/carts/routes.js";
import chatRouter from "../components/chats/routes.js";
import productsRouter from "../components/products/routes.js";
// import homeHandlebar from "../routes/viewRoutes.js";

const router = Router();

// router.use("/", homeHandlebar);
router.use("/api/carts", cartsRouter);
router.use("/chat", chatRouter);
router.use("/api/products", productsRouter);

export default router;
