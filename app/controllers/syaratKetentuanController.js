const db = require("../models");
const SyaratKetentuan = db.syaratKetentuan;

exports.create = async(req, res) => {
    try {
        const syaratKetentuan = await SyaratKetentuan.create({
            nama_syarat_ketentuan: req.body.nama_syarat_ketentuan,
        });
        res.status(201).send(syaratKetentuan);
    } catch (error) {
        res.status(500).send({
            message: "Terjadi kesalahan saat membuat SyaratKetentuan.",
        });
    }
};

//disuruh mas rendi

exports.update = async(req, res) => {
    const id = req.params.id;

    try {
        const [updated] = await SyaratKetentuan.update({
            nama_syarat_ketentuan: req.body.nama_syarat_ketentuan,
        }, {
            where: { id: id },
        });

        if (updated) {
            const updatedSyaratKetentuan = await SyaratKetentuan.findOne({
                where: { id: id },
            });
            res.status(200).send(updatedSyaratKetentuan);
        } else {
            res.status(404).send({
                message: `Tidak dapat menemukan SyaratKetentuan dengan id=${id}.`,
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Terjadi kesalahan saat mengupdate SyaratKetentuan.",
        });
    }
};

exports.findOne = async(req, res) => {
    const id = req.params.id;

    try {
        const syaratKetentuan = await SyaratKetentuan.findOne({
            where: { id: id },
        });

        if (syaratKetentuan) {
            res.status(200).send(syaratKetentuan);
        } else {
            res.status(404).send({
                message: `Tidak dapat menemukan SyaratKetentuan dengan id=${id}.`,
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Terjadi kesalahan saat mengambil SyaratKetentuan.",
        });
    }
};

exports.findAll = async(req, res) => {
    try {
        const syaratKetentuan = await SyaratKetentuan.findAll();
        res.status(200).send(syaratKetentuan);
    } catch (error) {
        res.status(500).send({
            message: "Terjadi kesalahan saat mengambil semua SyaratKetentuan.",
        });
    }
};

exports.delete = async(req, res) => {
    const id = req.params.id;

    try {
        const deleted = await SyaratKetentuan.destroy({
            where: { id: id },
        });

        if (deleted) {
            res.status(200).send({
                message: "SyaratKetentuan berhasil dihapus.",
            });
        } else {
            res.status(404).send({
                message: `Tidak dapat menemukan SyaratKetentuan dengan id=${id}.`,
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Terjadi kesalahan saat menghapus SyaratKetentuan.",
        });
    }
};

exports.deleteAll = async(req, res) => {
    try {
        const deleted = await SyaratKetentuan.destroy({
            where: {},
            truncate: false,
        });

        res.status(200).send({
            message: `${deleted} SyaratKetentuan berhasil dihapus.`,
        });
    } catch (error) {
        res.status(500).send({
            message: "Terjadi kesalahan saat menghapus semua SyaratKetentuan.",
        });
    }
};