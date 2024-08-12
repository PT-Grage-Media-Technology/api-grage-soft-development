const mysqldump = require("mysqldump");

exports.backup = [
  async (req, res) => {
    try {
      const backupFilePath = path.join(__dirname, "backup.sql");

      await mysqldump({
        connection: {
          host: "localhost",
          user: "root",
          password: "",
          database: "gmt_soft_development",
        },
        dumpToFile: backupFilePath,
      });

      res.download(backupFilePath, "backup.sql", (err) => {
        if (err) {
          console.error("Error during file download:", err);
          res.status(500).send("Error during backup");
        } else {
          fs.unlinkSync(backupFilePath); // Hapus file setelah berhasil didownload
        }
      });
    } catch (error) {
      console.error("Backup error:", error);
      res.status(500).send("Backup failed");
    }
  },
];
