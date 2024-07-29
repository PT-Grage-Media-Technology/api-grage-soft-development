const db = require("../models");
const Wcu = db.wcu;
const JSONAPISerializer = require("jsonapi-serializer").Serializer;
const serializer = new JSONAPISerializer("wcu", {
    attributes: ["isi"],
  });
    
exports.create = async (req, res) => {
  try {
    const wcu = {
      isi: req.body.isi,
    };
    const data = await Wcu.create(wcu);
    res.status(201).send(serializer.serialize(data));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update = (req, res) => {
  const id = req.params.id;
  const wcu = {
    isi: req.body.isi,
  };
  Wcu.update(wcu, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Wcu berhasil diperbarui." });
      } else {
        res.status(404).send({
          message: `Tidak dapat memperbarui Wcu dengan id=${id}. Mungkin Wcu tidak ditemukan atau req.body kosong!`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.findAll = async (req, res) => {
  try {
    const wcu = await Wcu.findAll();
    res.status(200).send(serializer.serialize(wcu));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Wcu.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).send(serializer.serialize(data));
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan Wcu dengan id=${id}.`,
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
    const num = await Wcu.destroy({
      where: { id: id },
    });
    if (num == 1) {
      res.send({ message: "Wcu berhasil dihapus." });
    } else {
      res.status(404).send({
        message: `Tidak dapat menghapus Wcu dengan id=${id}. Mungkin Wcu tidak ditemukan!`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const num = await Wcu.destroy({
      where: {},
      truncate: false,
    });
    res.send({ message: `${num} Wcu berhasil dihapus.` });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};