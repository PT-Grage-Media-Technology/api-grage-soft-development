const db = require("../models");
const KategoriWebsite = db.kategoriwebsite;
const JSONAPISerializer = require("jsonapi-serializer").Serializer;
const serializer = new JSONAPISerializer("kategori_website", {
  attributes: ["nama_kategori", "deskripsi_kategori"],
});

// Create and Save a new KategoriWebsite
exports.create = async (req, res) => {
  try {
    const kategoriWebsite = {
      nama_kategori: req.body.nama_kategori,
      deskripsi_kategori: req.body.deskripsi_kategori,
    };

    const newKategoriWebsite = await KategoriWebsite.create(kategoriWebsite);
    res.status(201).send(newKategoriWebsite);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all KategoriWebsites from the database
exports.findAll = async (req, res) => {
  try {
    const kategoriWebsites = await KategoriWebsite.findAll();
    const serializedData = serializer.serialize(kategoriWebsites);
    res.send(serializedData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Find a single KategoriWebsite with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  KategoriWebsite.findByPk(id)
    .then((kategoriWebsite) => {
      if (kategoriWebsite) {
        const serializedData = serializer.serialize(kategoriWebsite);
        res.send(serializedData);
      } else {
        res
          .status(404)
          .send({ message: `Cannot find KategoriWebsite with id=${id}.` });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

// Update a KategoriWebsite by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  KategoriWebsite.update(req.body, {
    where: { id: id },
  })
    .then(([updated]) => {
      if (updated) {
        return KategoriWebsite.findByPk(id);
      } else {
        res
          .status(404)
          .send({
            message: `Cannot update KategoriWebsite with id=${id}. Maybe KategoriWebsite was not found or req.body is empty!`,
          });
      }
    })
    .then((updatedKategoriWebsite) => {
      if (updatedKategoriWebsite) {
        const serializedData = serializer.serialize(updatedKategoriWebsite);
        res.send(serializedData);
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

// Delete a KategoriWebsite with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  KategoriWebsite.destroy({
    where: { id: id },
  })
    .then((deleted) => {
      if (deleted) {
        res.send({ message: "KategoriWebsite was deleted successfully!" });
      } else {
        res
          .status(404)
          .send({
            message: `Cannot delete KategoriWebsite with id=${id}. Maybe KategoriWebsite was not found!`,
          });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

// Delete all KategoriWebsites from the database
exports.deleteAll = async (req, res) => {
  try {
    const deleted = await KategoriWebsite.destroy({
      where: {},
      truncate: false,
    });

    if (deleted) {
      res.send({ message: "All KategoriWebsites were deleted successfully!" });
    } else {
      res
        .status(404)
        .send({
          message: `Cannot delete KategoriWebsites. Maybe KategoriWebsites were not found!`,
        });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
