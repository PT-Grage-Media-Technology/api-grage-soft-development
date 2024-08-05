const db = require("../models");
const ContohDesain = db.contohDesain;

exports.create = async (req, res) => {
  try {
    const contohDesain = await ContohDesain.create({
      link_contoh_desain: req.body.link_contoh_desain,
      is_gambar: req.body.is_gambar,
      deskripsi: req.body.deskripsi,
    });
    res.status(201).send(contohDesain);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await ContohDesain.update(
      {
        link_contoh_desain: req.body.link_contoh_desain,
        is_gambar: req.body.is_gambar,
        deskripsi: req.body.deskripsi,
      },
      {
        where: { id: id },
      }
    );

    if (updated) {
      const updatedContohDesain = await ContohDesain.findByPk(id);
      res.status(200).send(updatedContohDesain);
    } else {
      res.status(404).send({
        message: `Tidak dapat memperbarui ContohDesain dengan id=${id}. Mungkin ContohDesain tidak ditemukan atau req.body kosong!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Terjadi kesalahan saat memperbarui ContohDesain dengan id=${id}`,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const contohDesains = await ContohDesain.findAll();
    res.status(200).send(contohDesains);
  } catch (error) {
    res.status(500).send({
      message: "Terjadi kesalahan saat mengambil semua ContohDesain.",
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const contohDesain = await ContohDesain.findByPk(id);

    if (contohDesain) {
      res.status(200).send(contohDesain);
    } else {
      res.status(404).send({
        message: `Tidak dapat menemukan ContohDesain dengan id=${id}.`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Terjadi kesalahan saat mengambil ContohDesain dengan id=${id}`,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await ContohDesain.destroy({
      where: { id: id },
    });

    if (deleted) {
      res.status(200).send({
        message: `ContohDesain dengan id=${id} berhasil dihapus.`,
      });
    } else {
      res.status(404).send({
        message: `Tidak dapat menghapus ContohDesain dengan id=${id}. Mungkin ContohDesain tidak ditemukan!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Terjadi kesalahan saat menghapus ContohDesain dengan id=${id}`,
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deleted = await ContohDesain.destroy({
      where: {},
      truncate: false,
    });

    res.status(200).send({
      message: `${deleted} ContohDesain berhasil dihapus.`,
    });
  } catch (error) {
    res.status(500).send({
      message: "Terjadi kesalahan saat menghapus semua ContohDesain.",
    });
  }
};
