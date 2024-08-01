module.exports = (app) => {
  const paket = require("../controllers/paketController");
  const router = require("express").Router();

  router.post("/", paket.create);
  router.get("/", paket.findAll);
  router.get("/:id", paket.findOne);
  router.put("/:id", paket.update);
  router.delete("/:id", paket.delete);
  app.use("/api/paket", router);
};
