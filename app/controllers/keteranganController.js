const db = require("../models");
const Keterangan = db.keterangan;
const JSONAPISerializer = require("jsonapi-serializer").Serializer;
const serializer = new JSONAPISerializer("keterangan", {
  attributes: ["isi"],
});

exports.create = async (req, res) => {
  try {
    const keterangan = {
      isi: req.body.isi,
    };
    const data = await Keterangan.create(keterangan);
    res.status(201).send(serializer.serialize(data));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update = (req, res) => {
  const id = req.params.id;
  const keterangan = {
    isi: req.body.isi,
  };
  Keterangan.update(keterangan, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Keterangan berhasil diperbarui." });
      } else {
        res.status(404).send({
          message: `Tidak dapat memperbarui Keterangan dengan id=${id}. Mungkin Keterangan tidak ditemukan atau req.body kosong!`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.findAll = async (req, res) => {
  try {
    const keterangan = await Keterangan.findAll();
    res.status(200).send(serializer.serialize(keterangan));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Keterangan.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).send(serializer.serialize(data));
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan Keterangan dengan id=${id}.`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await Keterangan.destroy({
      where: { id: id },
    });
    if (num == 1) {
      res.send({ message: "Keterangan berhasil dihapus." });
    } else {
      res.status(404).send({
        message: `Tidak dapat menghapus Keterangan dengan id=${id}. Mungkin Keterangan tidak ditemukan!`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const num = await Keterangan.destroy({
      where: {},
      truncate: false,
    });
    res.send({ message: `${num} Keterangan berhasil dihapus.` });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
