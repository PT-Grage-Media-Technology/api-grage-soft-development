const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs/database"); // Mengimpor JWT_SECRET dari file konfigurasi

const authMiddleware = (req, res, next) => {
  // Dapatkan token dari header Authorization
  const token = req.header("Authorization");

  // Periksa jika token tidak ada
  if (!token) {
    return res
      .status(401)
      .json({ message: "Missing token, authorization denied" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tambahkan user ke request untuk digunakan di endpoint terproteksi
    req.user = decoded;

    // Lanjutkan ke middleware berikutnya atau ke endpoint
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // return res.status(403).json({ message: "masuk" });
  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }

    req.user = decoded; // Simpan data user dari token ke req.user
    next();
  });
};

// const verifyToken = (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(403).json({ message: "Token not provided" });

//   try {
//     const bearerToken = token.split(" ")[1];
//     const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
//     req.pelangganId = decoded.id; // Simpan PelangganId ke req untuk digunakan di endpoint
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
(module.exports = authMiddleware), verifyToken;
