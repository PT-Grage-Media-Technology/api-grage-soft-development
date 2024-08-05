// models/index.js

const dbConfig = require("../configs/database.js");

const Sequelize = require("sequelize");
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
db.klien = require("./klien.js")(sequelize, Sequelize);
db.paket = require("./paket.js")(sequelize, Sequelize);
db.kategoriwebsite = require("./kategoriwebsite.js")(sequelize, Sequelize);
db.kategori_klien = require("./KategoriKlien.js")(sequelize, Sequelize);
db.keterangan = require("./Keterangan.js")(sequelize, Sequelize);
db.wcu = require("./Wcu.js")(sequelize, Sequelize);
db.bank = require("./Bank.js")(sequelize, Sequelize);
db.benefitPaket = require("./benefitPaket.js")(sequelize, Sequelize);
db.contohDesain = require("./contohDesain.js")(sequelize, Sequelize);
db.syaratKetentuan = require("./SyaratKetentuan.js")(sequelize, Sequelize);

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
