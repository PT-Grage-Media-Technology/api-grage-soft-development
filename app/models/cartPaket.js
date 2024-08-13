const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const cart_paket = sequelize.define("cart_paket", {
    id_invoice: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_paket: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    diskon: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    harga: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  cart_paket.associate = (models) => {
    cart_paket.belongsTo(models.invoice, {
      foreignKey: "id_invoice",
      as: "invoice",
    });

    cart_paket.belongsTo(models.paket, {
      foreignKey: "id_paket",
      as: "paket",
    });
  };

  return cart_paket;
};
