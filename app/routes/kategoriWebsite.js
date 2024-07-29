module.exports = (app) => {
  const kategoriWebsite = require("../controllers/kategoriWebsite");
  const router = require("express").Router();

  router.post("/", kategoriWebsite.create);
  router.get("/", kategoriWebsite.findAll);
  router.get("/:id", kategoriWebsite.findOne);
  router.patch("/:id", kategoriWebsite.update);
  router.delete("/:id", kategoriWebsite.delete);
  app.use("/api/kategoriWebsite", router);
};
