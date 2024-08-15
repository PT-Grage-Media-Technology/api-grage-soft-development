const db = require("../models");
const KategoriKlien = db.kategori_klien;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require("jsonapi-serializer").Serializer;

exports.create = async (req, res) => {
  try {
    const newKategoriKlien = {
      nama_kategori_klien: req.body.nama_kategori_klien,
    };
    const kategoriKlien = await KategoriKlien.create(newKategoriKlien);
    res.status(201).send(kategoriKlien);
  } catch (error) {
    console.error("Error creating kategori klien:", error); // Tambahkan logging error
    res.status(500).send({
      message: "Error creating kategori klien",
      error: error.message, // Kirim pesan error yang lebih rinci
    });
  }
};



exports.findAll = async (req, res) => {
  try {
    const kategoriKlien = await KategoriKlien.findAll();

    res.status(200).send({
      data: kategoriKlien,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving kategori klien",
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  KategoriKlien.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          data,
        });
      } else {
        res.status(404).send({
          message: "Kategori klien not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving kategori klien with id=" + id,
      });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  let updatedKategoriKlien = {
    nama_kategori_klien: req.body.nama_kategori_klien,
  };
  try {
    const num = await KategoriKlien.update(updatedKategoriKlien, {
      where: { id: id },
    });
    if (num == 1) {
      return res.send({
        message: "Kategori klien was updated successfully.",
      });
    } else {
      res.status(404).send({
        message: "Kategori klien not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error updating kategori klien with id=" + id,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await KategoriKlien.destroy({
      where: { id: id },
    });
    if (num == 1) {
      res.send({
        message: "Kategori klien was deleted successfully.",
      });
    } else {
      res.status(404).send({
        message: "Kategori klien not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error deleting kategori klien with id=" + id,
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const nums = await KategoriKlien.destroy({
      where: {},
      truncate: false,
    });
    res.send({
      message: `${nums} Kategori klien were deleted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all kategori klien.",
    });
  }
};
