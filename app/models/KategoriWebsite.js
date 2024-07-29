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

  KategoriWebsite.associate = (models) => {
    KategoriWebsite.hasMany(models.paket, {
      foreignKey: "kategori_Website_Id",
      as: "pakets",
    });
  };

  return KategoriWebsite;
};
