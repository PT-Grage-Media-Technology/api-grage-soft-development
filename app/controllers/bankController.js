const db = require("../models");
const Bank = db.bank;
const serializer = new JSONAPISerializer("bank", {
  attributes: [
    "nama_bank",
    "no_rekening",
    "image_bank",
    "url_image_bank",
    "atas_nama",
  ],
});

exports.create = [
  async (req, res) => {
    try {
      const image_bank = req.file;
      if (image_bank) {
        return res
          .status(400)
          .send({ message: "Image Bank tidak boleh kosong" });
      }
      const imageName = `${image_bank.filename}`;
      const imageUrl = `${req.protocol}://${req.get("host")}/bank/${
        image_bank.filename
      }`;

      const bank = {
        nama_bank: req.body.nama_bank,
        no_rekening: req.body.no_rekening,
        atas_nama: req.body.atas_nama,
        image_bank: imageName,
        url_image_bank: imageUrl,
      };

      await Bank.create(bank);
      res.status(201).send(serializer.serialize(bank));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
];

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const bank = await Bank.findByPk(id);
    if (!bank) {
      return res
        .status(404)
        .send({ message: `Bank dengan id=${id} tidak ditemukan.` });
    }

    const image_bank = req.file;
    let imageName = bank.image_bank;
    let imageUrl = bank.url_image_bank;

    if (image_bank) {
      // Hapus foto lama
      const oldImagePath = `public/assets/images/bank/${bank.image_bank}`;
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus foto lama:", err);
        }
      });

      // Set foto baru
      imageName = `${image_bank.filename}`;
      imageUrl = `${req.protocol}://${req.get("host")}/bank/${
        image_bank.filename
      }`;
    }

    const updatedBank = {
      nama_bank: req.body.nama_bank,
      no_rekening: req.body.no_rekening,
      atas_nama: req.body.atas_nama,
      image_bank: imageName,
      url_image_bank: imageUrl,
    };

    await Bank.update(updatedBank, { where: { id: id } });
    res.send({ message: "Bank berhasil diperbarui." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findAll = (req, res) => {
  Bank.findAll()
    .then((data) => {
      res.status(200).send(serializer.serialize(data));
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Bank.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).send(serializer.serialize(data));
      } else {
        res
          .status(404)
          .send({ message: `Bank dengan id=${id} tidak ditemukan.` });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Bank.findByPk(id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ message: `Bank dengan id=${id} tidak ditemukan.` });
      }

      const imagePath = `public/assets/images/bank/${data.image_bank}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus foto:", err);
        }
      });

      Bank.destroy({ where: { id: id } })
        .then(() => {
          res.send({ message: "Bank berhasil dihapus." });
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.deleteAll = (req, res) => {
  Bank.findAll()
    .then((data) => {
      data.forEach((bank) => {
        const imagePath = `public/assets/images/bank/${bank.image_bank}`;
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Gagal menghapus foto:", err);
          }
        });
      });

      Bank.destroy({ where: {}, truncate: false })
        .then((num) => {
          res.send({ message: `${num} Bank berhasil dihapus.` });
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};
