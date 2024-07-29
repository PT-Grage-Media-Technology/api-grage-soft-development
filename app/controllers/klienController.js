const db = require("../models");
const Klien = db.klien;
const Kategori_klien = db.kategori_klien;
const Paket = db.paket;
const Op = db.Sequelize.Op;
const JSONAPISerializer = require("jsonapi-serializer").Serializer;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.create = [
  //   upload.single("foto"), // Middleware untuk mengunggah file dengan field name 'foto'
  async (req, res) => {
    try {
      // Ambil data dari request body
      const { kategoriId, paketId, is_headline } = req.body;
      const kategoriKlien = await Kategori_klien.findByPk(kategoriId);
      const paket = await Paket.findByPk(paketId);

      const foto = req.file;

      if (!foto) {
        return res.status(400).send({
          message: "Foto tidak ditemukan.",
        });
      }

      const imageName = `${foto.filename}`;
      const imageUrl = `${req.protocol}://${req.get("host")}/klien/${
        foto.filename
      }`;

      // Cari kategori dan paket berdasarkan ID
      if (!kategoriKlien || !paket) {
        return res.status(404).send({
          message: "Kategori atau Paket tidak ditemukan.",
        });
      }

      // Buat objek klien baru
      const klien = {
        kategoriId: kategoriKlien.id,
        paketId: paket.id,
        foto: imageName,
        url: imageUrl,
        is_headline,
      };

      // Simpan klien ke database
      const data = await Klien.create(klien);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat membuat Klien.",
      });
    }
  },
];

const serializer = new JSONAPISerializer("klien", {
  attributes: ["kategoriId", "paketId", "foto", "url", "is_headline"],
  kategori_klien: {
    ref: "id",
    attributes: ["nama_kategori_klien"],
  },
  paket: {
    ref: "id",
    attributes: [
      "harga",
      "jumlah_pilihan_desain",
      "status_website",
      "kategori_website_id",
    ],
  },
});

exports.findAll = async (req, res) => {
  try {
    const klien = await Klien.findAll({
      include: [
        { model: Kategori_klien, as: 'kategori_klien' },
        { model: Paket, as: 'paket' }
      ]
    });
    const serializedData = serializer.serialize(klien);

    res.status(200).send({
      data: serializedData,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving klien",
    });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Klien.findByPk(id, {
    include: [
      { model: Kategori_klien, as: 'kategori_klien' },
      { model: Paket, as: 'paket' }
    ]
  })
    .then((klien) => {
      if (klien) {
        const serializedData = serializer.serialize(klien);
        res.status(200).send({
          data: serializedData,
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

    // Process uploaded files:
    const imageName = `${file.filename}`;
    const imageUrl = `${req.protocol}://${req.get("host")}/klien/${
      file.filename
    }`;

    // Cari kategori dan paket berdasarkan ID
    if (!kategoriKlien || !paket) {
      return res.status(404).send({
        message: "Kategori atau Paket tidak ditemukan.",
      });
    }

    // Buat objek klien yang diperbarui
    const updatedKlien = {
      kategoriId: kategoriKlien.id,
      paketId: paket.id,
      foto: imageName,
      url: imageUrl,
      is_headline: req.body.is_headline,
    };

    // Perbarui klien di database
    const num = await Klien.update(updatedKlien, {
      where: { id: id },
    });

    if (num == 1) {
      res.send({
        message: "Klien berhasil diperbarui.",
      });
    } else {
      res.status(404).send({
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
    const num = await Klien.destroy({
      where: { id: id },
    });

    if (num == 1) {
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
    const num = await Klien.destroy({
      where: {},
      truncate: false,
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