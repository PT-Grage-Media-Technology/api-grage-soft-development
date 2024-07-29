const sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const KategoriWebsite = sequelize.define("kategori_website", {
    nama_kategori: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    deskripsi_kategori: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return KategoriWebsite;
};
