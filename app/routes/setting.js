
  
  module.exports = (app) => {
    const router = require("express").Router();
    const setting = require("../controllers/settingContoller");;
  
    router.post("/", setting.create);
    router.get("/", setting.findAll);
    router.get("/:id", setting.findOne);
    router.put("/:id", setting.update);
    router.delete("/:id", setting.delete);
    router.delete("/", setting.deleteAll);
  
    app.use("/api/setting", router);
  };