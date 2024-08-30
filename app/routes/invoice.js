module.exports = (app) => {
  const router = require("express").Router();
  const invoice = require("../controllers/invoiceController");

  router.get("/", invoice.findAll);
  router.post("/", invoice.create);
  router.patch("/:id", invoice.update);
  router.get("/:id", invoice.findOne);
  router.delete("/:id", invoice.delete);
  router.delete("/", invoice.deleteAll);

  router.get("/user/:userId", invoice.getInvoicesByUserId);

  app.use("/api/invoice", router);
};
