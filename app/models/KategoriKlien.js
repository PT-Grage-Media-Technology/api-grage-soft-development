const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const KategoriKlien = sequelize.define("kategori_klien", {
    nama_kategori_klien: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return KategoriKlien;
};
