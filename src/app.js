//* Dependencias
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
//* Rutas
import _dirname, { MongoInstance } from "./utils.js";
import ruters from "./routes/routes.js";
//* Models
import passport from "passport";
import initializePassport from "./config/passportConfig.js";
import MongoConnection from "./mongoSingleton.js";
import { socketServer } from "./config/socket.js";

// import productosEnEmpresa from "./dao/filesystem/manangers/productMananger.js";
// const productMananger = productosEnEmpresa;
// let data = await productMananger.getProducts();

dotenv.config();
const app = express();

initializePassport();

MongoConnection.getInstance();

app.use(session(MongoInstance));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("valen"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(_dirname + `/public`));

socketServer(app);

app.engine(`handlebars`, handlebars.engine());
app.set(`views`, "src/views");
app.set(`partials`, "src/partials");
app.set(`view engine`, `handlebars`);

app.use("/", ruters);
