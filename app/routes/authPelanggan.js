module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const auth = require("../controllers/authPelangganController");
  const verifyToken = require("../middleware/authPelanggan");

  router.post("/login", auth.login);
  router.post("/logout", auth.logout);
  router.get("/cekToken", auth.cekToken);
  router.get("/me", verifyToken, auth.me);

  app.use("/api/authpelanggan", router);
};
