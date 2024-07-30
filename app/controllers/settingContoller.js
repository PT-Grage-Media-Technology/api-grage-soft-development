const db = require("../models");

const Setting = db.setting;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const multer = require('multer');

const fs = require('fs');
const path = require('path');
// const Setting = require('../models/Setting'); // Sesuaikan dengan path model Anda

// Create and Save a new Tentang
exports.create = async (req, res) => {
  try {
    const file = req.file;

    // Process uploaded files:
      // Simpan atau proses gambar dan dapatkan URL atau path-nya
      const imageName = `${file.filename}`;
      // local
     const imageUrl = `${req.protocol}://${req.get('host')}/setting/${file.filename}`;
      // production
      //  const imageUrl = `https://api.ngurusizin.online/tentang/${file.filename}`;
    

    // Ambil URL gambar pertama jika tersedia

    // Buat objek Tentang dengan URL gambar yang telah diproses

    const setting = {
      setting_warna: req.body.setting_warna,  
      wa: req.body.wa,                       
      telp: req.body.telp,                    
      email: req.body.email,                 
      profil_perusahaan: req.body.profil_perusahaan,  
      alamat: req.body.alamat,               
      foto: imageName,                        
      gambar_setting: imageUrl                
    };
    

    // Simpan Tentang ke database menggunakan metode yang sesuai
    // Tangani kesalahan dan skenario keberhasilan sesuai kebutuhan

    // Contoh penggunaan Sequelize (ganti dengan ORM Anda):
    const newSetting = await Setting.create(setting);
    res.status(201).send(newSetting); // Atau respons yang diinginkan
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const settingSerializer = new JSONAPISerializer('setting', {
  attributes: ['setting_warna', 'wa', 'telp', 'email', 'profil_perusahaan', 'alamat', 'foto', 'gambar_setting'],
  keyForAttribute: 'camelCase',
});

  

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
      offset: offset
    });

    // Menghitung total jumlah tentang
    const totalCount = await Setting.count();

    // Menghitung total jumlah halaman berdasarkan ukuran halaman
    const totalPages = Math.ceil(totalCount / pageSize);

    // Menggunakan serializer untuk mengubah data menjadi JSON
    const setting = settingSerializer.serialize(settings);

    // Kirim response dengan data JSON dan informasi pagination
    res.send({
      data: setting,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCount: totalCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving settings.' });
  }
};

// Find a single admin with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Setting.findByPk(id)
    .then(data => {
      if (data) {
        const serializedData = settingSerializer.serialize(data);
        res.send(serializedData);
      } else {
        res.status(404).send({
          message: `Cannot find tentang with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: "Error retrieving tentang with id=" + id
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

    const file = req.file;
    let imageName = setting.foto;
    let imageUrl = setting.gambar_setting;

    if (file) {
      // Hapus foto lama
      const oldImagePath = `public/assets/images/setting/${setting.foto}`;
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus foto lama:", err);
        }
      });

      // Set foto baru
      imageName = `${file.filename}`;
      imageUrl = `${req.protocol}://${req.get("host")}/setting/${
        file.filename
      }`;
    }

    const updatedSetting = {
      ...req.body,
      foto: imageName,
      gambar_setting: imageUrl,
    };

    await Setting.update(updatedSetting, { where: { id: id } });
    res.send({ message: "Setting berhasil diperbarui." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a Tentang with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  // Cari Setting berdasarkan ID
  Setting.findOne({ where: { id: id } })
      .then(setting => {
          if (!setting) {
              return res.status(404).send({
                  message: `Tidak dapat menemukan Setting dengan id=${id}.`
              });
          }

          // Menghapus file terkait dari direktori
          const filePath = path.join(__dirname, '../../public/assets/images/setting', setting.foto);

          fs.unlink(filePath, err => {
              if (err) {
                  console.error("Tidak dapat menghapus file:", err);
                  return res.status(500).send({
                      message: "Tidak dapat menghapus file."
                  });
              }

              // Hapus Setting dari database
              Setting.destroy({
                  where: { id: id }
              })
              .then(num => {
                  if (num === 1) {
                      res.send({
                          message: "Setting berhasil dihapus!"
                      });
                  } else {
                      res.send({
                          message: `Tidak dapat menghapus Setting dengan id=${id}. Mungkin Setting tidak ditemukan!`
                      });
                  }
              })
              .catch(err => {
                  res.status(500).send({
                      message: "Tidak dapat menghapus Setting dengan id=" + id
                  });
              });
          });
      })
      .catch(err => {
          res.status(500).send({
              message: "Error mengambil Setting dengan id=" + id
          });
      });
};

// Delete all Tentangs from the database.
exports.deleteAll = (req, res) => {
    Setting.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Settings berhasil dihapus!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Terjadi kesalahan saat menghapus semua Settings."
        });
      });
  };

// Find all filter Tentangs (phone)
// exports.findAllPublished = (req, res) => {
//     Tentang.findAll({ where: { phone: true } })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving Tentangs."
//         });
//       });
//   };