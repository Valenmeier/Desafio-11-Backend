import { Router } from "express";
import { CartController } from "./cartController.js";
const router = Router();
let controller = new CartController();
//* Listar todos los carritos
router.get("/", async (req, res) => {
  const carts = await controller.getAll();
  if (carts.status == 200) {
    return res.status(200).send(carts.payload);
  }
  return res.status(400).send(carts.payload.result);
});

//* Crear nuevos carritos
router.post("/", async (req, res) => {
  const result = await controller.createCart();
  res.status(200).send({
    result: "success",
    payload: result,
  });
});

//*Buscar carrito por id y mostrarlo
router.get("/:cid", async (req, res) => {
  const result = await controller.seeOneCart(req);
  if (result.status == 200) {
    return res.status(200).send(result.payload.response);
  }
  return res.status(400).send(result.payload.result);
});

//* Actualizar carrito
router.post("/:cid/products/:pid", async (req, res) => {
  const result = await controller.addProductToCart(req);
  if (result.status == 200) {
    return res.status(200).send(result.payload.response);
  }
  return res.status(400).send(result.payload.result);
});

//*Eliminar carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const result = await controller.deleteProduct(req);
  if (result.status == 200) {
    return res.status(200).send(result.payload.response);
  }
  return res.status(400).send(result.payload.result);
});

//* Actualizar el carrito con un arreglo
router.put("/:cid", async (req, res) => {
  const result = await controller.updateWithArray(req);
  if (result.status == 200) {
    return res.status(200).send(result.payload.result);
  }
  return res.status(400).send(result.payload.result);
});

//* Actualizar cantidades del producto
router.put("/:cid/products/:pid", async (req, res) => {
  const result = await controller.updateQuantity(req);
  if (result.status == 200) {
    return res.status(200).send(result.payload.result);
  }
  return res.status(400).send(result.payload.result);
});

//* Eliminar todos los productos de un carrito
router.delete("/:cid", async (req, res) => {
  const result = await controller.deleteAllProducts(req);
  if (result.status == 200) {
    return res.status(200).send(result.payload.result);
  }
  return res.status(400).send(result.payload.result);
});

export default router;
