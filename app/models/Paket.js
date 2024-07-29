const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const Paket = sequelize.define("paket", {
    harga: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jumlah_pilihan_desain: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status_website: {
      type: Sequelize.ENUM,
      values: ["Siap Di Pakai", "Tersedia", "Tidak Tersedia"],
      allowNull: false,
    },
    kategori_Website_Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  Paket.associate = (models) => {
    Paket.belongsTo(models.KategoriWebsite, {
      foreignKey: "kategori_Website_Id",
      as: "kategoriWebsite",
    });
  };

  return Paket;
};
