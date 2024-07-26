module.exports = (app) => {
  const kategoriKlien = require("../controllers/kategoriKlienController");
  const express = require("express");
  const router = express.Router();

  router.post("/", kategoriKlien.create);
  router.get("/", kategoriKlien.findAll);
  router.get("/:id", kategoriKlien.findOne);
  router.patch("/:id", kategoriKlien.update);
  router.delete("/:id", kategoriKlien.delete);
  router.delete("/", kategoriKlien.deleteAll);

  app.use("/api/kategoriKlien", router);
};
