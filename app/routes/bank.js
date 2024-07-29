module.exports = (app) => {
  const bank = require("../controllers/bankController");
  const router = require("express").Router();
  const Bank = require("../middleware/bank");

  router.post("/", Bank.single("image_bank"), bank.create);
  router.get("/", bank.findAll);
  router.get("/:id", bank.findOne);
  router.patch("/:id", Bank.single("image_bank"), bank.update);
  router.delete("/:id", bank.delete);
  router.delete("/", bank.deleteAll);

  app.use("/api/bank", router);
};
