const express = require("express");
const cors = require("cors");

const app = express();
app.use("/setting", express.static("public/assets/images/setting")); //masukkan public direktori
app.use("/testimoni", express.static("public/assets/images/testimoni")); //masukkan public direktori
app.use("/bank", express.static("public/assets/images/bank")); //masukkan public direktori
app.use("/klien", express.static("public/assets/images/klien")); //masukkan public direktori
app.use("/contohdesain", express.static("public/assets/images/contohDesain"));
app.use(cors());

const db = require("./app/models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const corsOptions = {
  origin: ["https://ngurusizin.online", "http://localhost:3000"],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Gmt Soft Development application." });
});

require("./app/routes/setting")(app);
require("./app/routes/testimoni")(app);
require("./app/routes/administrators")(app);
require("./app/routes/auth")(app);
require("./app/routes/kategoriKlien")(app);
require("./app/routes/klien")(app);
require("./app/routes/kategoriWebsite")(app);
require("./app/routes/paket")(app);
require("./app/routes/bank")(app);
require("./app/routes/keterangan")(app);
require("./app/routes/wcu")(app);
require("./app/routes/benefitPaket")(app);
require("./app/routes/contohDesain")(app);
require("./app/routes/syaratketentuan")(app);
require("./app/routes/backupdb")(app);
require("./app/routes/cartPaket")(app);
require("./app/routes/invoice")(app);
require("./app/routes/pelanggan")(app);
require("./app/routes/authPelanggan")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
