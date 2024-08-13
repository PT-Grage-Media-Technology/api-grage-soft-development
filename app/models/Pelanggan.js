const Sequelize = require("../configs/database");

module.exports = (sequlize, Sequelize) => {
  const Pelanggan = sequlize.define("pelanggan", {
    nama: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alamat: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    telp: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  Pelanggan.associate = (models) => {
    Pelanggan.hasMany(models.invoice, {
      foreignKey: "pelanggan_id",
      as: "invoices",
    });
  };

  return Pelanggan;
};
