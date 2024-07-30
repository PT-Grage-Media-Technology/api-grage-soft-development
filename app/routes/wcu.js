module.exports = (app) => {
  const wcu = require("../controllers/wcuController");
  const router = require("express").Router();

  router.get("/", wcu.findAll);
  router.get("/:id", wcu.findOne);
  router.post("/", wcu.create);
  router.patch("/:id", wcu.update);
  router.delete("/:id", wcu.delete);
  router.delete("/", wcu.deleteAll);

  app.use("/api/wcu", router);
};
