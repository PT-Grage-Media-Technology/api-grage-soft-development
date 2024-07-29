module.exports = (app) => {
  const router = require("express").Router();
  const klien = require("../controllers/klienController");
  const klienMiddleware = require("../middleware/klien");

  router.post("/", klienMiddleware.single("logo_klien"), klien.create);
  router.get("/", klien.findAll);

  app.use("/api/klien", router);
};