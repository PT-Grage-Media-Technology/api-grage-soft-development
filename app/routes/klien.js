module.exports = (app) => {
  const router = require("express").Router();
  const klien = require("../controllers/klienController");
  const klienMiddleware = require("../middleware/klien");

  router.post("/", klienMiddleware.single("logo_klien"), klien.create);
  router.get("/", klien.findAll);
  router.get("/:id", klien.findOne);
  router.put("/:id", klienMiddleware.single("logo_klien"), klien.update);
  router.delete("/:id", klien.delete);
  router.delete("/", klien.deleteAll);

  app.use("/api/klien", router);
};
