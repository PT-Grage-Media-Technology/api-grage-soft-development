const db = require("../models");
const Setting = db.setting;
const fs = require("fs");
const path = require("path");
const apiConfig = require("../configs/apiConfig");

exports.create = async (req, res) => {
  try {
    const { foto, foto_cap, foto_ttd } = req.files;

    const setting = {
      setting_warna: req.body.setting_warna,
      wa: req.body.wa,
      telp: req.body.telp,
      email: req.body.email,
      profil_perusahaan: req.body.profil_perusahaan,
      alamat: req.body.alamat,
      url_gmaps: req.body.url_gmaps,
      bidang_perusahaan: req.body.bidang_perusahaan,
      foto: foto ? foto[0].filename : null,
      gambar_setting: foto
        ? `${apiConfig.BASE_URL}/setting/${foto[0].filename}`
        : null,
      foto_cap: foto_cap ? foto_cap[0].filename : null,
      url_foto_cap: foto_cap
        ? `${apiConfig.BASE_URL}/setting/${foto_cap[0].filename}`
        : null,
      foto_ttd: foto_ttd ? foto_ttd[0].filename : null,
      url_foto_ttd: foto_ttd
        ? `${apiConfig.BASE_URL}/setting/${foto_ttd[0].filename}`
        : null,
    };

    const newSetting = await Setting.create(setting);
    res.status(201).send(newSetting);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all Settings from the database.
exports.findAll = async (req, res) => {
  try {
    // Mendapatkan nilai halaman dan ukuran halaman dari query string (default ke halaman 1 dan ukuran 10 jika tidak disediakan)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Menghitung offset berdasarkan halaman dan ukuran halaman
    const offset = (page - 1) * pageSize;

    // Mengambil data tentang dengan pagination menggunakan Sequelize
    const settings = await Setting.findAll({
      limit: pageSize,
      offset: offset,
    });

    // Menghitung total jumlah tentang
    const totalCount = await Setting.count();

    // Menghitung total jumlah halaman berdasarkan ukuran halaman
    const totalPages = Math.ceil(totalCount / pageSize);

    // Menggunakan serializer untuk mengubah data menjadi JSON
    const setting = settings;

    // Kirim response dengan data JSON dan informasi pagination
    res.send({
      data: setting,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving settings." });
  }
};

// Find a single admin with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Setting.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find tentang with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Error retrieving tentang with id=" + id,
      });
    });
};

// Update a Tentang by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const setting = await Setting.findByPk(id);

    if (!setting) {
      return res
        .status(404)
        .send({ message: `Setting dengan id=${id} tidak ditemukan.` });
    }

    const { foto, foto_cap, foto_ttd } = req.files;

    // Fungsi untuk menghapus file lama
    const deleteOldFile = (oldFilename) => {
      if (oldFilename) {
        const oldFilePath = path.join(
          __dirname,
          `../../public/assets/images/setting/${oldFilename}`
        );
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error("Gagal menghapus file lama:", err);
        });
      }
    };

    // Update foto
    if (foto) {
      deleteOldFile(setting.foto);
      setting.foto = foto[0].filename;
      setting.gambar_setting = `${apiConfig.BASE_URL}/setting/${foto[0].filename}`;
    }

    // Update foto_cap
    if (foto_cap) {
      deleteOldFile(setting.foto_cap);
      setting.foto_cap = foto_cap[0].filename;
      setting.url_foto_cap = `${apiConfig.BASE_URL}/setting/${foto_cap[0].filename}`;
    }

    // Update foto_ttd
    if (foto_ttd) {
      deleteOldFile(setting.foto_ttd);
      setting.foto_ttd = foto_ttd[0].filename;
      setting.url_foto_ttd = `${apiConfig.BASE_URL}/setting/${foto_ttd[0].filename}`;
    }

    // Update field lainnya
    setting.setting_warna = req.body.setting_warna || setting.setting_warna;
    setting.wa = req.body.wa || setting.wa;
    setting.telp = req.body.telp || setting.telp;
    setting.email = req.body.email || setting.email;
    setting.profil_perusahaan =
      req.body.profil_perusahaan || setting.profil_perusahaan;
    setting.alamat = req.body.alamat || setting.alamat;
    setting.url_gmaps = req.body.url_gmaps || setting.url_gmaps;
    setting.bidang_perusahaan =
      req.body.bidang_perusahaan || setting.bidang_perusahaan;

    await setting.save();
    res.send({ message: "Setting berhasil diperbarui.", data: setting });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a Tentang with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  // Cari Setting berdasarkan ID
  Setting.findOne({ where: { id: id } })
    .then((setting) => {
      if (!setting) {
        return res.status(404).send({
          message: `Tidak dapat menemukan Setting dengan id=${id}.`,
        });
      }

      // Menghapus file terkait dari direktori
      const filePath = path.join(
        __dirname,
        "../../public/assets/images/setting",
        setting.foto
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Tidak dapat menghapus file:", err);
          return res.status(500).send({
            message: "Tidak dapat menghapus file.",
          });
        }

        // Hapus Setting dari database
        Setting.destroy({
          where: { id: id },
        })
          .then((num) => {
            if (num === 1) {
              res.send({
                message: "Setting berhasil dihapus!",
              });
            } else {
              res.send({
                message: `Tidak dapat menghapus Setting dengan id=${id}. Mungkin Setting tidak ditemukan!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Tidak dapat menghapus Setting dengan id=" + id,
            });
          });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error mengambil Setting dengan id=" + id,
      });
    });
};

// Delete all Tentangs from the database.
exports.deleteAll = (req, res) => {
  Setting.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Settings berhasil dihapus!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Terjadi kesalahan saat menghapus semua Settings.",
      });
    });
};
