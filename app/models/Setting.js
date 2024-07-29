module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define("setting", {
      setting_warna: {
        type: Sequelize.STRING
      },
      wa: {
        type: Sequelize.STRING
      },
      telp: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      profil_perusahaan: {
        type: Sequelize.TEXT
      },
      alamat: {
        type: Sequelize.TEXT
      },
      foto: {
        type: Sequelize.STRING
      },
      gambar_setting: {
        type: Sequelize.STRING
      },
    });
  
    return Setting;
  };