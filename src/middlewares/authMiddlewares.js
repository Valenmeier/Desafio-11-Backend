import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, { expiresIn: "24h" });
};

export const authToken = (req, res, next) => {
  const authToken = req.cookies.coderCookieToken;

  if (!authToken)
    return res.status(401).render("/error", { mensaje: "No auth" });

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res.status(403).render("error", { mensaje: "No authorized" });
    req.user = credentials.user;
    next();
  });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(401).render("error", {
          mensaje: info.messages ? info.messages : info.toString(),
        });

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const extractCookie = (req) =>
  req && req.cookies ? req.cookies[process.env.COOKIE_NAME_JWT] : null;
