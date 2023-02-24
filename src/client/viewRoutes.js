import express from "express";
import mongoose from "mongoose";
const router = express.Router();
import productosEnEmpresa from "../dao/filesystem/manangers/productMananger.js";

// import { actualizarPagina } from "../public/js/funcionActualizaLinks.js";
import { verificarAdmin } from "../scripts/verificarAdmin.js";

import { passportCall } from "../middlewares/authMiddlewares.js";

const productMananger = productosEnEmpresa;

router.get(`/`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  res.render(`home`, {
    admin,
    activateSession,
    style: "inicio.css",
  });
});

router.get(`/products`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  let params = req.query;
  let products;
  if (params.limit || params.page || params.sort || params.query) {
    let url = "http://localhost:8080/api/products?";
    for (let param in params) {
      let completParam = `${param}=${params[param]}&`;
      url += completParam;
    }

    products = await fetch(url.slice(0, -1))
      .then((res) => res.json())
      .then((res) => res);
  } else {
    products = await fetch(`http://localhost:8080/api/products`)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }

  if (products.status == 400) {
    return res.render("products/products", {
      admin,
      activateSession,
      mensaje: products.response,
      style: "listasDeProductos.css",
    });
  }
  let prevLink = `${products.prevLink}`,
    nextLink = `${products.nextLink}`,
    firstLink = `${products.firstLink}`,
    ultimateLink = `${products.ultimateLink}`;

  return res.render("products/products", {
    admin,
    activateSession,
    data: products.payload,
    prevLink: prevLink.slice(4),
    nextLink: nextLink.slice(4),
    page: products.page,
    firstLink: firstLink.slice(4),
    ultimateLink: ultimateLink.slice(4),
    style: "listasDeProductos.css",
  });
});

router.get(`/realtimeproducts`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  res.render(`products/realtimeProducts`, {
    admin,
    activateSession,
    style: "listasDeProductos.css",
  });
});

router.get(`/products/:pid`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  let id = req.params.pid;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = "Id no válido";
    return res.render(`products/detalles`, {
      admin,
      activateSession,
      error,
      style: "detalles.css",
    });
  }
  let producto = await fetch(`http://localhost:8080/api/products/${id}`)
    .then((res) => res.json())
    .then((res) => res);

  if (!producto) {
    let error = "Producto no encontrado";
    return res.render(`products/detalles`, {
      admin,
      activateSession,
      error,
      style: "detalles.css",
    });
  }
  let { _id, title, description, price, thumbnail, stock } = await producto[0];

  res.render(`products/detalles`, {
    admin,
    activateSession,
    _id,
    title,
    description,
    price,
    thumbnail,
    stock,
    style: "detalles.css",
  });
});
router.get(`/chat`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  res.render(`chat`, {
    admin,
    activateSession,
    style: "chat.css",
  });
});

router.get(`/cart/:cid`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  let id = req.params.cid;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = "Id del carrito no válido";
    return res.render(`products/detalles`, {
      admin,
      activateSession,
      error,
      style: "detalles.css",
    });
  }

  let carrito = await fetch(`http://localhost:8080/api/carts/${id}`)
    .then((res) => res.json())
    .then((res) => res);

  if (!carrito) {
    let error = "Carrito no encontrado";
    return res.render(`products/detalles`, {
      admin,
      activateSession,
      error,
      style: "detalles.css",
    });
  }
  let traerProductos = [];
  let error;

  if (!carrito[0].products) {
    for (let producto of carrito.products) {
      let buscarProducto = await fetch(
        `http://localhost:8080/api/products/${id}`
      )
        .then((res) => res.json())
        .then((res) => res);

      let nuevoObjeto = {
        ...buscarProducto,
        quantity: producto.quantity,
        totalPrice: buscarProducto.price * producto.quantity,
      };
      traerProductos.push(nuevoObjeto);
    }
  } else {
    error = "El carrito se encuentra vacio";
  }

  res.render(`products/carrito`, {
    admin,
    activateSession,
    traerProductos,
    error,
    style: "carrito.css",
  });
});

router.get("/admin", passportCall("jwt"), (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;

  if ((activateSession, admin)) {
    return res.render(`admin/admin`, {
      admin,
      activateSession,
      mensaje: `Felicidades eres admin`,
      style: "admin.css",
    });
  }
  return res.render(`admin/admin`, {
    admin,
    activateSession,
    style: "admin.css",
  });
});
export default router;
