const db = require("../models");

const Testimoni = db.testimoni;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require("jsonapi-serializer").Serializer;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const apiConfig = require("../configs/apiConfig");

// Create and Save a new testimoni
exports.create = async (req, res) => {
  try {
    const gambar_testimoni = req.file;

    // Process uploaded files
    const imageName = `${gambar_testimoni.filename}`;

    // Production URL
    const imageUrl = `${apiConfig.BASE_URL}/testimoni/${gambar_testimoni.filename}`;

    // Create testimoni object with new attributes
    const testimoni = {
      jenis_testimoni: req.body.jenis_testimoni,
      gambar_testimoni: imageName,
      judul_testimoni: req.body.judul_testimoni,
      deskripsi_testimoni: req.body.deskripsi_testimoni,
      is_publish: req.body.is_publish,
      url_gambar: imageUrl,
    };

    // Save testimoni to the database
    const newTestimoni = await Testimoni.create(testimoni);
    res.status(201).send(newTestimoni);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all testimonis from the database.
exports.findAll = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  Testimoni.findAll({
    limit: pageSize,
    offset: offset,
  })
    .then((testimonis) => {
      Testimoni.count()
        .then((totalCount) => {
          const totalPages = Math.ceil(totalCount / pageSize);
          res.send({
            data: testimonis,
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send({ message: "Error counting testimonis." });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error retrieving testimonis." });
    });
};

// Find a single testimoni with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Testimoni.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find testimoni with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Error retrieving testimoni with id=" + id,
      });
    });
};

// Update a testimoni by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  const file = req.file;

  try {
    let testimoniData = req.body;

    const testimoni = await Testimoni.findByPk(id);
    if (!testimoni) {
      return res
        .status(404)
        .send({ message: `Testimoni dengan id=${id} tidak ditemukan` });
    }

    // Jika ada file baru, hapus file lama
    if (file) {
      const imageName = file.filename;
      const imageUrl = `${apiConfig.BASE_URL}/testimoni/${imageName}`;

      testimoniData = {
        ...testimoniData,
        gambar_testimoni: imageName,
        url_gambar: imageUrl,
      };

      // Hapus file lama dari server
      const oldImagePath = `public/assets/images/testimoni/${testimoni.gambar_testimoni}`;
      fs.unlink(oldImagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          // ENOENT berarti file tidak ditemukan
          console.error("Gagal menghapus gambar lama:", err);
        }
      });
    }

    await testimoni.update(testimoniData);
    res.send({
      message: "Testimoni berhasil diubah.",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a testimoni with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Testimoni.findByPk(id)
    .then((testimoni) => {
      if (!testimoni) {
        return res.status(404).send({
          message: `Testimoni with id=${id} not found!`,
        });
      }

      // Hapus file gambar dari server
      const oldImagePath = `public/assets/images/testimoni/${testimoni.gambar_testimoni}`;
      fs.unlink(oldImagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          // ENOENT berarti file tidak ditemukan
          console.error("Failed to delete image at path:", imagePath, err);
        }
      });

      return Testimoni.destroy({
        where: { id: id },
      });
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Testimoni was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete testimoni with id=${id}. Maybe testimoni was not found!`,
        });
      }
    })
    .catch((err) => {
      console.error("Error deleting testimoni:", err); // Log error details
      res.status(500).send({
        message: "Could not delete testimoni with id=" + id,
      });
    });
};

// Delete all testimonis from the database.
exports.deleteAll = (req, res) => {
  Testimoni.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} testimonis were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all testimonis.",
      });
    });
};

// Find all filter testimonis (phone)
// exports.findAllPublished = (req, res) => {
//     testimoni.findAll({ where: { phone: true } })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving testimonis."
//         });
//       });
//   };
