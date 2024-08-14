module.exports = (app) => {
  const router = require("express").Router();
  const setting = require("../controllers/settingContoller");
  const upl_setting = require("../middleware/setting");

  // Gunakan `.array` untuk mengizinkan multiple files
  router.post("/", upl_setting.array("foto", 3), setting.create); // "foto" adalah nama field dan "3" adalah jumlah file maksimum
  router.get("/", setting.findAll);
  router.get("/:id", upl_setting.array("foto", 3), setting.findOne);
  router.patch("/:id", upl_setting.array("foto", 3), setting.update);
  router.delete("/:id", setting.delete);
  router.delete("/", setting.deleteAll);

  app.use("/api/setting", router);
};
