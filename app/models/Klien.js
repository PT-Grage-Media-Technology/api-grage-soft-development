const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const Klien = sequelize.define("klien", {
    paket_Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    kategori_klien_Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    url_klien: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    logo_klien: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_headline: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  Klien.associate = (models) => {
    Klien.belongsTo(models.Paket, {
      foreignKey: "paket_Id",
      as: "paket",
    });
    Klien.belongsTo(models.KategoriKlien, {
      foreignKey: "kategori_klien_Id",
      as: "KategoriKlien",
    });
  };

  return Klien;
};
