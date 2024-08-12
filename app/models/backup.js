const Sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
  const backup = sequelize.define("backup", {
    backupDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    backupFile: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return backup;
};
