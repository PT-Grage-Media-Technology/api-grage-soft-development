module.exports = (app) => {
  const backup = require("../controllers/backupdbController");
  const router = require("express").Router();

  router.get("/", backup.backup);

  app.use("/api/backupdb", router);
};
