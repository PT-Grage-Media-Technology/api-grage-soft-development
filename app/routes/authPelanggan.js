module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const auth = require("../controllers/authPelangganController");

  router.post("/login", auth.login);
  router.post("/logout", auth.logout);
  router.get("/cekToken", auth.cekToken);

  app.use("/api/authpelanggan", router);
};
