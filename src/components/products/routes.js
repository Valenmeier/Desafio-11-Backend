import { Router } from "express";
import { ProductsController } from "./productsController.js";

import mongoose from "mongoose";
// import productosEnEmpresa from "../dao/filesystem/manangers/productMananger.js";
// const productMananger = productosEnEmpresa;
const router = Router();

let Controller = new ProductsController();

//* Obtener Productos

router.get("/", async (req, res) => {
  let productos = await Controller.getAllProducts(req);
  if (productos.status == 200) {
    return res.status(200).send(productos.response);
  } else {
    return res.status(400).send(productos.response);
  }
});

//* Subir producto
router.post("/", async (req, res) => {
  let result = await Controller.addProduct(req);
  if (result.status == 200) {
    return res.status(200).send(result);
  } else {
    return res.status(400).send(result.response);
  }
});

//* Traer Productos con un id
router.get("/:pid", async (req, res) => {
  let result = await Controller.getProductWhitId(req);
  if (result.status == 200) {
    return res.status(200).send(result.response);
  } else {
    return res.status(400).send(result.response);
  }
});

//*Actualizar productos
router.put("/:pid", async (req, res) => {
  let result = await Controller.updateProducts(req);
  if (result.status == 200) {
    return res.status(200).send(result.response);
  } else {
    return res.status(400).send(result.response);
  }
});

//* Eliminar productos
router.delete("/:pid", async (req, res) => {
  let result = await Controller.deleteProducts(req);
  if (result.status == 200) {
    return res.status(200).send(result.response);
  } else {
    return res.status(400).send(result.response);
  }
});

export default router;
