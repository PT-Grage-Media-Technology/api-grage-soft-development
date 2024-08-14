module.exports = (app) => {
  const router = require("express").Router();
  const pelanggan = require("../controllers/pelangganController");

  router.post("/", pelanggan.create);
  router.get("/", pelanggan.findAll);
  router.get("/:id", pelanggan.findOne);
  router.patch("/:id", pelanggan.update);
  router.delete("/:id", pelanggan.delete);
  router.delete("/", pelanggan.deleteAll);

  app.use("/api/pelanggan", router);
};
