module.exports = (sequelize, Sequelize) => {
  const Testimoni = sequelize.define("testimoni", {
    jenis_testimoni: {
      type: Sequelize.ENUM('wa', 'email'), // Enum untuk tipe testimoni
    },
    gambar_testimoni: {
      type: Sequelize.STRING, // URL atau path gambar
    },
    judul_testimoni: {
      type: Sequelize.STRING, // Judul testimoni
    },
    deskripsi_testimoni: {
      type: Sequelize.STRING, // Deskripsi testimoni
    },
  });

  return Testimoni;
};
