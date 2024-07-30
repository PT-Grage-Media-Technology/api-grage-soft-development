
  
  module.exports = (app) => {
    const router = require("express").Router();
    const setting = require("../controllers/settingContoller");;
    const upl_setting = require("../middleware/setting")
  
    router.post("/", upl_setting.single("foto"),setting.create);
    router.get("/", setting.findAll);
    router.get("/:id", upl_setting.single("foto"), setting.findOne);
    router.patch("/:id", upl_setting.single("foto"), setting.update);
    router.delete("/:id", setting.delete);
    router.delete("/", setting.deleteAll);
  
    app.use("/api/setting", router);
  };