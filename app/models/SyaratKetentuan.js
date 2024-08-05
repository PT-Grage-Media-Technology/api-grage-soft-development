const { Sequelize } = require(".");
const sequelize = require("../configs/database");

module.exports = (sequelize, Sequelize) => {
    const SyaratKetentuan = sequelize.define("syarat_ketentuan", {
        nama_syarat_ketentuan: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    return SyaratKetentuan;
}