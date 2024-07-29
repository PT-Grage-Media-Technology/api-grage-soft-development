const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const Keterangan = sequelize.define("keterangan", {
    isi: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Keterangan;
};
