const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define("invoice", {
    refrensi: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tanggal: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    tgl_jatuh_tempo: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    pelanggan_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    subtotal: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    total_diskon: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    total: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });


  Invoice.associate = (models) => {
    Invoice.belongsTo(models.pelanggan, {
      foreignKey: "pelanggan_id",
      as: "pelanggan",
    });
  };


  Invoice.associate = (models) => {
    Invoice.hasMany(models.cart_paket, {
      foreignKey: "id_invoice",
      as: "cartPaket",
    });
  };

  return Invoice;
};
