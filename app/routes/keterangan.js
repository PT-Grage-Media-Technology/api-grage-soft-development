module.exports = (app) => {
    const keterangan = require("../controllers/keteranganController");
    const router = require("express").Router();

    router.get("/", keterangan.findAll);
    router.post("/", keterangan.create);
    router.get("/:id", keterangan.findOne);
    router.patch("/:id", keterangan.update);
    router.delete("/:id", keterangan.delete);
    router.delete("/", keterangan.deleteAll);

    app.use("/api/keterangan", router);
}