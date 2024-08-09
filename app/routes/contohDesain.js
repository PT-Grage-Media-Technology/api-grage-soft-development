module.exports = (app) => {
  const contohDesain = require("../controllers/contohDesainController");
  const router = require("express").Router();
  const upl_contohDesain = require("../middleware/contohDesain");

  router.post(
    "/",
    upl_contohDesain.single("gambar_link_contoh_desain"),
    contohDesain.create
  );
  router.get("/", contohDesain.findAll);
  router.get("/:id", contohDesain.findOne);
  router.patch("/:id", upl_contohDesain.single("gambar_link_contoh_desain"), contohDesain.update);
  router.delete("/:id", contohDesain.delete);
  router.delete("/", contohDesain.deleteAll);

  app.use("/api/contohDesain", router);
};
