const db = require("../models");
const Pelanggan = db.pelanggan;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../configs/database"); // Mengimpor nilai JWT_SECRET dari file konfigurasi

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari administrator berdasarkan email
    const pelanggan = await Pelanggan.findOne({
      where: { email: email },
    });

    // Jika administrator tidak ditemukan atau password salah, kirim respons error
    if (!pelanggan || !(await bcrypt.compare(password, pelanggan.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: pelanggan.id }, JWT_SECRET, {
      // Menggunakan JWT_SECRET sebagai kunci rahasia
      expiresIn: "7d",
    });

    // Kirim token sebagai respons
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi logout
exports.logout = (req, res) => {
  try {
    // Dapatkan token dari header Authorization
    const token = req.header("Authorization");

    // Periksa jika token tidak ada
    if (!token) {
      return res.status(401).json({ message: "Missing token, logout failed" });
    }

    // Verifikasi token dan ambil ID pengguna dari token
    const decoded = jwt.verify(token, JWT_SECRET);
    const pelangganId = decoded.id;

    // Hapus token dari sisi klien (misalnya, dengan menghapus token dari local storage)

    // Kirim respons logout berhasil
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.cekToken = async (req, res) => {
  try {
    // Dapatkan token dari header Authorization
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Missing token, logout failed" });
    }

    // decode JWT untuk mendapatkan id dari pelanggan
    decodeJWTAndGetID(token)
      .then(async (id) => {
        const pelanggan = await Pelanggan.findOne({
          where: { id: id },
        });

        // return res.status(500).json({ message: pelanggan });

        res.json({ id: pelanggan.id });
      })
      .catch((err) => {
        res.status(500).json({ message: `Gagal mendeskripsi JWT:`, err });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

function decodeJWTAndGetID(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        // mengambbil id dari payload JWT
        const id = decoded.id;
        resolve(id);
      }
    });
  });
}

exports.me = async (req, res) => {
  try {
    // Check if user information is available in the request
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User information not found" });
    }

    const pelanggan = await Pelanggan.findByPk(req.user.id, {
      attributes: ["id", "nama", "telp", "email"],
    });

    if (!pelanggan) {
      return res.status(404).json({ message: "Pelanggan not found" });
    }

    res.json(pelanggan);
  } catch (error) {
    console.error("Error fetching pelanggan data:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
