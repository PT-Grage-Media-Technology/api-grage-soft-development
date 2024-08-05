module.exports = (app) => {
  const syaratKetentuan = require("../controllers/syaratKetentuanController");

  const router = require("express").Router();

  router.post("/", syaratKetentuan.create);
  router.get("/", syaratKetentuan.findAll);
  router.get("/:id", syaratKetentuan.findOne);
  router.patch("/:id", syaratKetentuan.update);
  router.delete("/:id", syaratKetentuan.delete);
  router.delete("/", syaratKetentuan.deleteAll);

  app.use("/api/syaratketentuan", router);
};
