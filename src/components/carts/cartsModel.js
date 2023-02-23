import mongoose from "mongoose";
import { cartsSchema } from "./cartSchema.js";
const cartsCollection = "carts";

let model = mongoose.model(cartsCollection, cartsSchema);

export class CartsModel {
  constructor() {
    this.db = model;
  }
  getAll = async () => {
    return await this.db
      .find()
      .then((carrito) => {
        if (carrito.length == 0) throw new Error("required");
        return {
          status: 200,
          payload: {
            result: "success",
            carts: carrito,
          },
        };
      })
      .catch((err) => {
        return {
          status: 400,
          payload: {
            result: `No hay ningún carrito`,
          },
        };
      });
  };
  createCart = async () => {
    const nuevoCarrito = {
      products: [],
    };
    let result = await this.db.create(nuevoCarrito);
    return result;
  };
  getOneCart = async (id) => {
    let carrito = await this.db.find({ _id: id });
    if (carrito.length > 0) {
      return {
        status: 200,
        payload: {
          result: "success",
          response: carrito,
        },
      };
    } else {
      return {
        status: 400,
        payload: {
          result: `Carrito no encontrado`,
        },
      };
    }
  };
  isValidCart = async (id) => {
    let carrito = await this.db.find({ _id: id });
    if (carrito.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  addProduct = async (productoId, carritoId) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { $inc: { "products.$.quantity": +1 } }
      );
      return {
        status: 200,
        payload: {
          result: "success",
          response: { status: "Actualizado Correctamente" },
        },
      };
    }
    await this.db.updateOne(
      { _id: carritoId },
      { $push: { products: { _id: productoId }, quantity: 1 } }
    );
    return {
      status: 200,
      payload: {
        result: "success",
        response: { status: "Actualizado Correctamente" },
      },
    };
  };

  deleteProduct = async (productoId, carritoId) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { $pull: { products: { _id: productoId } } }
      );
      return {
        status: 200,
        payload: {
          result: "success",
          response: { status: "Eliminado correctamente" },
        },
      };
    }
    return {
      status: 200,
      payload: {
        result: "success",
        response: { status: "Eliminado correctamente" },
      },
    };
  };
  updateWithArray = async (carritoId, products) => {
    let carrito = await this.db.updateOne({ _id: carritoId }, { products });
    return {
      status: 200,
      payload: {
        result: `productos agregados correctamente`,
        payload: carrito,
      },
    };
  };
  updateQuantity = async (carritoId, productoId, cantidadNueva) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { "products.$.quantity": cantidadNueva }
      );
      return {
        status: 200,
        payload: {
          result: `cantidades cambiadas correctamente`,
        },
      };
    }
    await this.db.updateOne(
      { _id: carritoId },
      { $push: { products: { _id: productoId }, quantity: cantidadNueva } }
    );
    return {
      status: 200,
      payload: {
        result: `cantidades cambiadas correctamente`,
      },
    };
  };
  deleteAllProducts = async (carritoId) => {
    let carrito = await this.db.updateOne(
      { _id: carritoId },
      { $set: { products: [] } }
    );
    return {
      status: 200,
      payload: {
        result: `Productos eliminados correctamente`,
      },
    };
  };
}
