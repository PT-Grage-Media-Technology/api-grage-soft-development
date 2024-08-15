const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const Paket = sequelize.define("paket", {
    nama_paket: {
      type: Sequelize.STRING,
      allowNull: false,
    },
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
    // Asosiasi dengan kategoriwebsite
    Paket.belongsTo(models.kategoriwebsite, {
      foreignKey: "kategori_Website_Id",
      as: "kategoriWebsite", // Alias ini harus unik
    });
 
    // Asosiasi dengan cart_paket
    Paket.hasMany(models.cart_paket, {
      foreignKey: "id_paket",
      as: "cartPaket",
    });
  };

  return Paket;
};
