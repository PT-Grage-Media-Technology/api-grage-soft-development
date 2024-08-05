const { sequelize } = require(".");
const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const ContohDesain = sequelize.define("contoh_desain", {
    link_contoh_desain: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_gambar: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deskripsi: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  return ContohDesain;
};
