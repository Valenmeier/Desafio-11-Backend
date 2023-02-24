import { Router } from "express";

import passport from "passport";


import dotenv from "dotenv";
dotenv.config();

const router = Router();

//Todo --> Login

router.get(`/login`, (req, res) => {
  res.render(`sessions/login`, {
    style: "sessions.css",
  });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/session/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400);
    }
    req.session.user = req.user;
    res
      .cookie(process.env.COOKIE_NAME_JWT, req.user.token)
      .redirect("/products");
  }
);

router.get("/faillogin", (req, res) => {
  res.status(401).render("sessions/login", {
    error: "Usuario y/o contraseña incorrecta",
    style: "sessions.css",
  });
});

//Todo --> Register

router.get(`/register`, (req, res) => {
  res.render(`sessions/register`, {
    style: "register.css",
  });
});

router.post(
  "/createUser",
  passport.authenticate("register", {
    failureRedirect: "/session/failregister",
  }),
  async (req, res) => {
    res.redirect("/session/login");
  }
);

router.get("/failregister", (req, res) => {
  res.status(400).render("sessions/register", {
    error: "Email ya registrado, coloca otro email",
    style: "register.css",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {}
);

router.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/session/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.cookie(process.env.COOKIE_NAME_JWT, req.user.token).redirect("/");
  }
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["email"] }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/session/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.cookie(process.env.COOKIE_NAME_JWT, req.user.token).redirect("/");
  }
);

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("error", { mensaje: `${err}` });
    } else {
      res.clearCookie(process.env.COOKIE_NAME_JWT);
      res.redirect("/session/login");
    }
  });
});

export default router;
