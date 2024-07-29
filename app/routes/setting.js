module.exports = (app) => {
  const setting = require("../controllers/settingContoller");
  const express = require("express");
  const router = express.Router();
  const upl_setting = require("../middleware/setting");

  // Create a new Tutorial
  router.post("/", upl_setting.single("gambar"), setting.create);

  // Retrieve all Tutorials
  router.get("/", setting.findAll);

  // Retrieve all published setting
  // router.get("/published", setting.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", setting.findOne);

  // Update a Tutorial with id
  router.put("/:id", upl_setting.single("gambar"), setting.update);

  // Delete a Tutorial with id
  router.delete("/:id", setting.delete);

  // Delete all setting
  router.delete("/", setting.deleteAll);

  app.use("/api/setting", router);
};
