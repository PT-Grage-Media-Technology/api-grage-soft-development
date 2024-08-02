module.exports = (app) => {
  const benefitPaket = require("../controllers/benefitPaketController");
  const router = require("express").Router();

  router.post("/", benefitPaket.create);
  router.get("/", benefitPaket.findAll);
  router.get("/:id", benefitPaket.findOne);
  router.put("/:id", benefitPaket.update);
  router.delete("/:id", benefitPaket.delete);
  router.delete("/", benefitPaket.deleteAll);

  app.use("/api/benefitpaket", router);
};
