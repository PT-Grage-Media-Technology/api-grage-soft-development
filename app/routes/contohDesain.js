module.exports = (app) => {
    const contohDesain = require("../controllers/contohDesainController");
    const router = require("express").Router();

    router.post("/", contohDesain.create);
    router.get("/", contohDesain.findAll);
    router.get("/:id", contohDesain.findOne);
    router.patch("/:id", contohDesain.update);
    router.delete("/:id", contohDesain.delete);
    router.delete("/", contohDesain.deleteAll);

    app.use("/api/contohDesain", router);
}