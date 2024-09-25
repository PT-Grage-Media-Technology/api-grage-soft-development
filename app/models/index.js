// models/index.js

const dbConfig = require("../configs/database.js");

const Sequelize = require("sequelize");
const invoice = require("./invoice.js");
const paket = require("./Paket.js");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import model yang dibutuhkan
db.setting = require("./Setting.js")(sequelize, Sequelize);
db.layanan = require("./Layanan.js")(sequelize, Sequelize);
db.transaksi = require("./Transaksi.js")(sequelize, Sequelize);
db.testimoni = require("./Testimoni.js")(sequelize, Sequelize);
db.administrators = require("./Administrators.js")(sequelize, Sequelize);
db.order = require("./Order.js")(sequelize, Sequelize);
db.klien = require("./Klien.js")(sequelize, Sequelize);
db.paket = require("./Paket.js")(sequelize, Sequelize);
db.kategoriwebsite = require("./KategoriWebsite.js")(sequelize, Sequelize);
db.kategori_klien = require("./KategoriKlien.js")(sequelize, Sequelize);
db.keterangan = require("./Keterangan.js")(sequelize, Sequelize);
db.wcu = require("./Wcu.js")(sequelize, Sequelize);
db.bank = require("./Bank.js")(sequelize, Sequelize);
db.benefitPaket = require("./benefitPaket.js")(sequelize, Sequelize);
db.contohDesain = require("./contohDesain.js")(sequelize, Sequelize);
db.syaratKetentuan = require("./SyaratKetentuan.js")(sequelize, Sequelize);
db.pelanggan = require("./Pelanggan.js")(sequelize, Sequelize);
db.invoice = require("./invoice.js")(sequelize, Sequelize);
//db.backup = require("./backup.js")(sequelize, Sequelize);
db.cart_paket = require("./cartPaket.js")(sequelize, Sequelize);

// Invoice Model
// db.invoice.hasMany(db.cart_paket, {
//   foreignKey: "id_invoice",
//   as: "cart_pakets",
// });
// db.cart_paket.belongsTo(db.invoice, {
//   foreignKey: "id_invoice",
//   as: "invoices",
// });

// Paket Model
db.paket.hasMany(db.cart_paket, { foreignKey: "id_paket", as: "cart_pakets" });
db.cart_paket.belongsTo(db.paket, { foreignKey: "id_paket", as: "pakets" });

// Pelanggan Model
db.pelanggan.hasMany(db.invoice, {
  foreignKey: "pelanggan_id",
  as: "Invoices",
});
db.invoice.belongsTo(db.pelanggan, {
  foreignKey: "pelanggan_id",
  as: "pelanggas",
});

// Paket Model
// db.paket.belongsTo(db.kategoriwebsite, {
//   foreignKey: "kategori_website_Id",
//   as: "kategoriWebsite",
// });

// KategoriWebsite Model
// db.kategoriwebsite.hasMany(db.paket, {
//   foreignKey: "kategori_website_Id",
//   as: "Pakets",
// });

// //Klien
// db.klien.belongsTo(db.paket, {
//   foreignKey: "paket_Id",
//   as: "pakets",
// });

// relasi table order ke layanan
db.order.belongsTo(db.layanan, { foreignKey: "layananId" });

// Call associate methods
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sinkronkan model dengan database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

module.exports = db;
