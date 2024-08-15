const db = require("../models");
const Paket = db.paket;
const KategoriWebsite = db.kategoriwebsite;

// Create and Save a new Paket
exports.create = async (req, res) => {
  const paket = {
    nama_paket: req.body.nama_paket,
    harga: req.body.harga,
    jumlah_pilihan_desain: req.body.jumlah_pilihan_desain,
    status_website: req.body.status_website,
    kategori_Website_Id: req.body.kategori_website_id,
  };

  const kategoriWebsite = await KategoriWebsite.findByPk(
    req.body.kategori_website_id
  );
  if (!kategoriWebsite) {
    return res.status(400).send({
      message: "Kategori Website tidak ditemukan.",
    });
  }

  Paket.create(paket)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat membuat Paket.",
      });
    });
};

// Retrieve all Pakets from the database
exports.findAll = (req, res) => {
  Paket.findAll({
    include: [
      {
        model: KategoriWebsite,
        as: "kategoriWebsite",
        attributes: ["id", "nama_kategori", "deskripsi_kategori"],
      },
    ],
  })
    .then((data) => {
      res.status(200).send({
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat mengambil Paket.",
      });
    });
};

// Find a single Paket with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // Paket.findByPk(id)
  Paket.findOne({
    where: { id: id },
    include: [
      {
        model: KategoriWebsite,
        as: "kategoriWebsite",
        attributes: ["id", "nama_kategori", "deskripsi_kategori"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan Paket dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Terjadi kesalahan saat mengambil Paket dengan id=" + id,
      });
    });
};

// Update a Paket by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  const kategoriWebsite = await KategoriWebsite.findByPk(
    req.body.kategori_website_id
  );
  if (!kategoriWebsite) {
    return res.status(400).send({
      message: "Kategori Website tidak ditemukan.",
    });
  }

  const paket = {
    nama_paket: req.body.nama_paket,
    harga: req.body.harga,
    jumlah_pilihan_desain: req.body.jumlah_pilihan_desain,
    status_website: req.body.status_website,
    kategori_Website_Id: req.body.kategori_website_id,
  };

  Paket.update(paket, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return Paket.findByPk(id, {
          include: [
            {
              model: KategoriWebsite,
              as: "kategoriWebsite",
              attributes: ["id", "nama_kategori", "deskripsi_kategori"],
            },
          ],
        });
      } else {
        res.status(404).send({
          message: `Tidak dapat memperbarui Paket dengan id=${id}. Mungkin Paket tidak ditemukan atau req.body kosong!`,
        });
      }
    })
    .then((data) => {
      if (data) {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat memperbarui Paket.",
      });
    });
};

// Delete a Paket with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Paket.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Paket berhasil dihapus.",
        });
      } else {
        res.status(404).send({
          message: `Tidak dapat menghapus Paket dengan id=${id}. Mungkin Paket tidak ditemukan!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat menghapus Paket.",
      });
    });
};

// Delete all Pakets from the database
exports.deleteAll = (req, res) => {
  Paket.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Paket berhasil dihapus.`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat menghapus semua Paket.",
      });
    });
};
