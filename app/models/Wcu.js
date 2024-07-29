const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const Wcu = sequelize.define("wcu", {
    isi: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Wcu;
};
