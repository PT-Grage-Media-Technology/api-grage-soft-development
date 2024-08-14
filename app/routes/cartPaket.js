module.exports = (app) => {
  const router = require("express").Router();
  const cartPaket = require("../controllers/cartPaketController");

  router.get("/", cartPaket.findAll);
  router.post("/", cartPaket.create);
  router.patch("/:id", cartPaket.update);
  router.get("/:id", cartPaket.findOne);
  router.delete("/:id", cartPaket.delete);
  router.delete("/", cartPaket.deleteAll);

  app.use("/api/cartpaket", router);
};
