const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const BenefitPaket = sequelize.define("benefit_paket", {
    nama_benefit: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    paket_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  BenefitPaket.associate = (models) => {
    if (models.paket) {
      BenefitPaket.belongsTo(models.paket, {
        foreignKey: "paket_id",
        as: "paket",
      });
    } else {
      console.error("Model Paket tidak ditemukan");
    }
  };

  return BenefitPaket;
};
