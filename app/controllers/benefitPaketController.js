const db = require("../models");
const BenefitPaket = db.benefitPaket;
const Paket = db.paket;


exports.create = async (req, res) => {
  try {
    const { nama_benefit, paket_id } = req.body;
    const paket = await Paket.findByPk(paket_id);

    if (!paket) {
      return res.status(404).send({
        message: "Paket tidak ditemukan.",
      });
    }

    const benefitPaket = {
      nama_benefit,
      paket_id: paket.id,
    };

    const data = await BenefitPaket.create(benefitPaket);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat membuat Benefit Paket.",
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const { nama_benefit, paket_id } = req.body;
    const paket = await Paket.findByPk(paket_id);

    if (!paket) {
      return res.status(404).send({
        message: "Paket tidak ditemukan.",
      });
    }

    const updatedBenefitPaket = {
      nama_benefit,
      paket_id: paket.id,
    };

    const [updated] = await BenefitPaket.update(updatedBenefitPaket, {
      where: { id: id },
    });

    if (updated) {
      const updatedBenefit = await BenefitPaket.findByPk(id);
      res.send(updatedBenefit);
    } else {
      res.status(404).send({
        message: `Benefit Paket dengan id=${id} tidak ditemukan.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Terjadi kesalahan saat memperbarui Benefit Paket.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const benefitPaket = await BenefitPaket.findAll({
      include: [{ model: Paket, as: "paket" }],
    });
    // const serializedData = serializer.serialize(benefitPaket);

    res.status(200).send({
      data: benefitPaket,
    });
  } catch (error) {
    res.status(500).send({
      message: "Terjadi kesalahan saat mengambil data Benefit Paket.",
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const benefitPaket = await BenefitPaket.findByPk(id, {
      include: [{ model: Paket, as: "paket" }],
    });

    if (benefitPaket) {
      res.status(200).send({
        data: benefitPaket,
      });
    } else {
      res.status(404).send({
        message: `Benefit Paket dengan id=${id} tidak ditemukan.`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Terjadi kesalahan saat mengambil data Benefit Paket.",
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const benefitPaket = await BenefitPaket.findByPk(id);

    if (!benefitPaket) {
      return res.status(404).send({
        message: `Benefit Paket dengan id=${id} tidak ditemukan.`,
      });
    }

    await BenefitPaket.destroy({ where: { id: id } });
    res.send({ message: "Benefit Paket berhasil dihapus." });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Terjadi kesalahan saat menghapus Benefit Paket.",
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await BenefitPaket.destroy({ where: {}, truncate: false });
    res.send({ message: "Semua Benefit Paket berhasil dihapus." });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Terjadi kesalahan saat menghapus semua Benefit Paket.",
    });
  }
};
