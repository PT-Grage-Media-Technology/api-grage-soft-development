const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const Bank = sequelize.define("bank", {
    nama_rek: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    no_rek: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image_bank: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url_image_bank: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    atas_nama: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Bank;
};