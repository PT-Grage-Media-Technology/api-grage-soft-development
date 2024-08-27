const db = require("../models");
const ContohDesain = db.contohDesain;
const fs = require("fs");
const apiConfig = require("../configs/apiConfig");

exports.create = async (req, res) => {
  // return res.status(500).send({ message: req.body.is_gambar });
  try {
    const gambar_link_contoh_desain = req.file;
    let contoh_desain;

    if (req.file) {
      // Jika ada file yang dikirim, gunakan file
      const imageUrl = `${apiConfig.BASE_URL}/contohDesain/${
        gambar_link_contoh_desain.filename
      }`;

      contoh_desain = imageUrl;
    } else if (req.body && req.body.is_gambar == 0) {
      // Jika ada teks yang dikirim, gunakan teks
      contoh_desain = req.body.link_contoh_desain;
    } else {
      // Jika tidak ada file atau teks, kembalikan error
      return res
        .status(400)
        .send({ message: "Anda Tidak Ngirim File Atau Teks" });
    }

    const contohDesain = await ContohDesain.create({
      link_contoh_desain: contoh_desain,
      is_gambar: req.body.is_gambar,
      deskripsi: req.body.deskripsi,
    });

    res.status(201).send(contohDesain);
  } catch (error) {
    res.status(500).send({ message: "terjadi kesalahan", error });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const gambar_link_contoh_desain = req.file;
  let contoh_desain;

  try {
    const contohdesain = await ContohDesain.findByPk(id);

    // return res.status(500).send({ message: req.body.is_gambar });

    if (!contohdesain) {
      return res
        .status(404)
        .send({ message: `Desain dengan id=${id} tidak ditemukan.` });
    }

    // Cek jika ada file yang dikirim
    if (req.file) {
      // Hapus foto lama jika ada
      if (contohdesain.link_contoh_desain) {
        const oldImagePath = `public/assets/images/contohDesain/${contohdesain.link_contoh_desain}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Set URL gambar baru
      const imageUrl = `${apiConfig.BASE_URL}/contohDesain/${
        gambar_link_contoh_desain.filename
      }`;
      contoh_desain = imageUrl;
    }
    // Cek jika `is_gambar` bernilai 0 dan ada link teks yang dikirim
    else if (req.body.is_gambar === "0" && req.body.link_contoh_desain) {
      contoh_desain = req.body.link_contoh_desain;
    }
    // Jika tidak ada file atau teks yang dikirim
    else {
      return res
        .status(400)
        .send({ message: "Anda Tidak Ngirim File Atau Teks" });
    }

    // Update the record
    const [updated] = await ContohDesain.update(
      {
        link_contoh_desain: contoh_desain,
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
      error: error.message,
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

  ContohDesain.findByPk(id)
    .then((data) => {
      if (!data) {
        return res
          .status(500)
          .send({ message: `Contoh desain dengan id=${id} tidak ditemukan.` });
      }

      const logoFilename = data.link_contoh_desain.replace(apiConfig.BASE_URL, "");
      const imagePath = `public/assets/images/contohDesain/${logoFilename}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Gagal menghapus foto:", err);
        }
      });

      ContohDesain.destroy({ where: { id: id } })
        .then(() => {
          res.send({ message: "Contoh desain berhasil dihapus." });
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
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
