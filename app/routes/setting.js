module.exports = (app) => {
  const router = require("express").Router();
  const setting = require("../controllers/settingContoller");
  const upl_setting = require("../middleware/setting");

  // Definisikan fields untuk upload
  const uploadFields = [
    { name: "foto", maxCount: 1 },
    { name: "foto_cap", maxCount: 1 },
    { name: "foto_ttd", maxCount: 1 },
  ];

  // Menggunakan .fields untuk mengizinkan multiple files dengan nama field yang berbeda
  router.post("/", upl_setting.fields(uploadFields), setting.create);

  router.get("/", setting.findAll);

  router.get("/:id", setting.findOne);

  router.patch("/:id", upl_setting.fields(uploadFields), setting.update);

  router.delete("/:id", setting.delete);

  router.delete("/", setting.deleteAll);

  app.use("/api/setting", router);
};
