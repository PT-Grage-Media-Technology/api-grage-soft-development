const db = require("../models");
const CartPaket = db.cart_paket;
const Invoice = db.invoice;
const Paket = db.paket;

// Create a new CartPaket
exports.create = async (req, res) => {
  try {
    const cartPaketData = {
      id_invoice: req.body.id_invoice,
      id_paket: req.body.id_paket,
      diskon: req.body.diskon,
      harga: req.body.harga,
    };

    const newCartPaket = await CartPaket.create(cartPaketData);
    res.status(201).send(newCartPaket);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all CartPaket
exports.findAll = async (req, res) => {
  try {
    const cartPakets = await CartPaket.findAll({
      include: [
        { model: Invoice, as: "invoices" },
        { model: Paket, as: "pakets" },
      ],
    });
    res.status(200).send(cartPakets);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve a single CartPaket by ID
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const cartPaket = await CartPaket.findByPk(id, {
      include: [
        { model: Invoice, as: "invoices" },
        { model: Paket, as: "pakets" },
      ],
    });

    if (!cartPaket) {
      return res
        .status(404)
        .send({ message: `CartPaket dengan id=${id} tidak ditemukan.` });
    }

    res.status(200).send(cartPaket);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a CartPaket by ID
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const [updated] = await CartPaket.update(req.body, { where: { id: id } });

    if (!updated) {
      return res
        .status(404)
        .send({ message: `CartPaket dengan id=${id} tidak ditemukan.` });
    }

    res.send({ message: "CartPaket berhasil diperbarui." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a CartPaket by ID
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await CartPaket.destroy({ where: { id: id } });

    if (!deleted) {
      return res
        .status(404)
        .send({ message: `CartPaket dengan id=${id} tidak ditemukan.` });
    }

    res.send({ message: "CartPaket berhasil dihapus." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete all CartPakets
exports.deleteAll = async (req, res) => {
  try {
    await CartPaket.destroy({ where: {}, truncate: true });
    res.send({ message: "Semua CartPaket berhasil dihapus." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
