const { where } = require("sequelize");
const db = require("../models");
const cartPaket = db.cart_paket;
const Invoice = db.invoice;
const Pelanggan = db.pelanggan;
const KategoriWebsite = db.kategoriwebsite;
const Paket = db.paket;
const CartPaket = db.cart_paket;

// Create a new Invoice
exports.create = async (req, res) => {
  try {
    const invoiceData = {
      refrensi: req.body.refrensi,
      tanggal: new Date(),
      tgl_jatuh_tempo: new Date(),
      pelanggan_id: req.body.pelanggan_id,
      subtotal: req.body.subtotal,
      total_diskon: req.body.total_diskon,
      total: req.body.total,
    };

    const newInvoice = await Invoice.create(invoiceData);
    res.status(201).send(newInvoice);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getInvoicesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all invoices for the user
    const invoices = await Invoice.findAll({
      where: { pelanggan_id: userId },
      include: [
        {
          model: CartPaket,
          as: "cartPaket", // Specify the alias here
          include: [
            {
              model: Paket,
              as: "paket",
              include: [
                {
                  model: KategoriWebsite,
                  as: "kategoriWebsite",
                },
              ],
            },
          ],
        },
      ],
    });

    if (invoices.length === 0) {
      return res
        .status(404)
        .json({ message: "No invoices found for this user" });
    }

    // For simplicity, let's just return the first invoice's cart items
    const firstInvoice = invoices[0];
    res.status(200).send(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res
      .status(500)
      .json({ message: "Error fetching invoices", error: error.message });
  }
};

// Retrieve all Invoices
exports.findAll = async (req, res) => {
  // const { pelanggan_id } = req.query;
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: CartPaket,
          as: "cartPaket", // Specify the alias here
          include: [
            {
              model: Paket,
              as: "paket",
              include: [
                {
                  model: KategoriWebsite,
                  as: "kategoriWebsite",
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(200).send(invoices);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve a single Invoice by ID
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Pelanggan, as: "pelanggas" },
        {
          model: cartPaket,
          as: "cartPaket",
          include: [
            {
              model: Paket,
              as: "pakets",
              include: [{ model: KategoriWebsite, as: "kategoriWebsite" }],
            },
          ],
        },
      ],
    });

    if (!invoice) {
      return res
        .status(404)
        .send({ message: `Invoice dengan id=${id} tidak ditemukan.` });
    }

    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update an Invoice by ID
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const [updated] = await Invoice.update(req.body, { where: { id: id } });

    if (!updated) {
      return res
        .status(404)
        .send({ message: `Invoice dengan id=${id} tidak ditemukan.` });
    }

    res.send({ message: "Invoice berhasil diperbarui." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete an Invoice by ID
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Invoice.destroy({ where: { id: id } });

    if (!deleted) {
      return res
        .status(404)
        .send({ message: `Invoice dengan id=${id} tidak ditemukan.` });
    }

    res.send({ message: "Invoice berhasil dihapus." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete all Invoices
exports.deleteAll = async (req, res) => {
  try {
    await Invoice.destroy({ where: {}, truncate: true });
    res.send({ message: "Semua Invoice berhasil dihapus." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
