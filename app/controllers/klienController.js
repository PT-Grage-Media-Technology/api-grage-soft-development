const db = require("../models");
const Klien = db.klien;
const Kategori_klien = db.kategori_klien;
const Paket = db.paket;
const fs = require("fs");
const path = require("path");
const apiConfig = require("../configs/apiConfig");

exports.create = [
  async (req, res) => {
    try {
      const {
        kategori_klien_Id,
        paket_Id,
        nama_klien,
        is_headline,
        url_klien,
      } = req.body;
      const kategoriKlien = await Kategori_klien.findByPk(kategori_klien_Id);
      const paket = await Paket.findByPk(paket_Id);

      const foto = req.file;

      if (!foto) {
        return res.status(400).send({
          message: "Foto tidak ditemukan.",
        });
      }

      const imageName = `${foto.filename}`;
      const imageUrl = `${apiConfig.BASE_URL}/klien/${
        foto.filename
      }`;

      if (!kategoriKlien) {
        return res.status(500).send({
          message: "Kategori tidak ditemukan.",
        });
      }

      if (!paket) {
        return res.status(500).send({
          message: "Paket tidak ditemukan.",
        });
      }

      const klien = {
        kategori_klien_Id: kategoriKlien.id,
        paket_Id: paket.id,
        nama_klien: nama_klien,
        logo_klien: imageUrl,
        url_klien,
        is_headline,
      };

      const data = await Klien.create(klien);
      res.status(201).send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat membuat Klien.",
      });
    }
  },
];

exports.findAll = async (req, res) => {
  try {
    const klien = await Klien.findAll({
      include: [
        { model: Kategori_klien, as: "kategori_klien" },
        { model: Paket, as: "paket" },
      ],
    });

    // const serializedData = serializer.serialize(klien);

    res.status(200).send({
      data: klien,
    });
  } catch (error) {
    res.status(500).send({
      message: "Terjadi kesalahan saat mengambil data klien.",
    });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Klien.findByPk(id, {
    include: [
      { model: Kategori_klien, as: "kategori_klien" },
      { model: Paket, as: "paket" },
    ],
  })
    .then((klien) => {
      if (klien) {
        res.status(200).send({
          data: klien,
        });
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan Klien dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Terjadi kesalahan saat mengambil Klien dengan id=" + id,
      });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const file = req.file;
    const kategoriKlien = await Kategori_klien.findByPk(req.body.kategoriId);
    const paket = await Paket.findByPk(req.body.paketId);
    const klien = await Klien.findByPk(id);

    let imageUrl;

    if (file) {
      const logoFilename = klien.logo_klien.replace(apiConfig.BASE_URL, "");

      const imagePath = path.join(
        __dirname,
        "../../public/assets/images/klien",
        logoFilename
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file gambar:", err);
        }
      });

      imageUrl = `${apiConfig.BASE_URL}/klien/${file.filename}`;
    } else {
      imageUrl = klien.logo_klien;
    }

    if (!kategoriKlien) {
      return res.status(500).send({
        message: "Kategori tidak ditemukan.",
      });
    }

    if (!paket) {
      return res.status(500).send({
        message: "Paket tidak ditemukan.",
      });
    }

    const updatedKlien = {
      kategori_klien_Id: kategoriKlien.id,
      paket_Id: paket.id,
      nama_klien: req.body.nama_klien,
      logo_klien: imageUrl,
      url_klien: req.body.url_klien,
      is_headline: req.body.is_headline,
    };

    const num = await Klien.update(updatedKlien, {
      where: { id: id },
    });

    if (num == 1) {
      res.status(200).send({
        message: "Klien berhasil diperbarui.",
      });
    } else {
      res.status(500).send({
        message: `Tidak dapat memperbarui Klien dengan id=${id}. Mungkin Klien tidak ditemukan atau req.body kosong!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat memperbarui Klien.",
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const klien = await Klien.findByPk(id);
    if (!klien) {
      return res.status(404).send({
        message: `Tidak dapat menghapus Klien dengan id=${id}. Mungkin Klien tidak ditemukan!`,
      });
    }

    const num = await Klien.destroy({
      where: { id: id },
    });

    if (num == 1) {
      const baseUrl = "http://localhost:5000/klien/";
      const logoFilename = klien.logo_klien.replace(baseUrl, "");

      const imagePath = path.join(
        __dirname,
        "../../public/assets/images/klien",
        logoFilename
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file gambar:", err);
        }
      });

      res.send({
        message: "Klien berhasil dihapus.",
      });
    } else {
      res.status(404).send({
        message: `Tidak dapat menghapus Klien dengan id=${id}. Mungkin Klien tidak ditemukan!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat menghapus Klien.",
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const kliens = await Klien.findAll();
    const num = await Klien.destroy({
      where: {},
      truncate: false,
    });

    kliens.forEach((klien) => {
      const imagePath = path.join(
        __dirname,
        "../../public/assets/images/klien",
        klien.logo_klien
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file gambar:", err);
        }
      });
    });

    res.send({
      message: `${num} Klien berhasil dihapus.`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat menghapus semua Klien.",
    });
  }
};
