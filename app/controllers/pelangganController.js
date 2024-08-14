const db = require("../models");
const Pelanggan = db.pelanggan;
const bcrypt = require("bcryptjs"); // Import bcrypt untuk hashing password

exports.create = async (req, res) => {
  try {
    // Validasi request
    if (!req.body.nama || !req.body.password) {
      return res.status(400).send({ message: "Nama dan password diperlukan!" });
    }

    // Hash password dengan bcrypt
    const saltRounds = 10; // Atur jumlah salt rounds sesuai kebutuhan
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Buat objek pelanggan dengan password yang sudah di-hash
    const pelanggan = {
      nama: req.body.nama,
      email: req.body.email || "", // Assign string kosong jika email tidak disediakan
      telp: req.body.telp || "", // Assign string kosong jika telp tidak disediakan
      alamat: req.body.alamat || "", // Assign string kosong jika alamat tidak disediakan
      password: hashedPassword,
    };

    // Simpan pelanggan ke database
    const newPelanggan = await Pelanggan.create(pelanggan);
    res.status(201).send(newPelanggan);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: error.message || "Error creating pelanggan." });
  }
};

// Retrieve all Pelanggan from the database
exports.findAll = async (req, res) => {
  try {
    const pelanggans = await Pelanggan.findAll();
    res.send(pelanggans);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Find a single Pelanggan with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Pelanggan.findByPk(id)
    .then((pelanggan) => {
      if (pelanggan) {
        res.send(pelanggan);
      } else {
        res
          .status(404)
          .send({ message: `Cannot find Pelanggan with id=${id}.` });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

// Update a Pelanggan by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    // Cek jika password disertakan dalam permintaan pembaruan
    if (req.body.password) {
      const saltRounds = 10; // Sesuaikan salt rounds jika diperlukan (semakin tinggi semakin aman)
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    } else {
      // Jika tidak ada password baru, pertahankan password lama
      const existingPelanggan = await Pelanggan.findByPk(id);
      if (existingPelanggan) {
        req.body.password = existingPelanggan.password;
      }
    }

    const [updated] = await Pelanggan.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedPelanggan = await Pelanggan.findByPk(id);
      res.send(updatedPelanggan);
    } else {
      res.status(404).send({
        message: `Cannot update Pelanggan with id=${id}. Maybe Pelanggan was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a Pelanggan with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await Pelanggan.destroy({
      where: { id: id },
    });

    if (deleted) {
      res.send({ message: "Pelanggan was deleted successfully!" });
    } else {
      res.status(404).send({
        message: `Cannot delete Pelanggan with id=${id}. Maybe Pelanggan was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete all Pelanggans from the database
exports.deleteAll = async (req, res) => {
  try {
    const deleted = await Pelanggan.destroy({
      where: {},
      truncate: false,
    });

    if (deleted) {
      res.send({ message: "All Pelanggans were deleted successfully!" });
    } else {
      res.status(404).send({
        message: `Cannot delete Pelanggans. Maybe Pelanggans were not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
