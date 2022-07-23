const multer = require("multer");

class StorageController {
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const authStr = req.headers["authorization"];
      const access_token = authStr.split(" ").pop();

      const decoded = tokenService.verifyToken(access_token);

      cb(null, process.env.STORAGE + decoded.email);
    },
    filename: function (req, file, cb) {
      console.log(file);
      cb(null, file.fieldname + "-" + Date.now());
    },
  });

  upload = multer({ storage: this.storage });
  async uploadFile(req, res, next) {
    this.upload.single("files")(req, res, function (err) {
      if (err) {
        // A Multer error occurred when uploading.
        res.json({ msg: err.message });
      } else {
        // Everything went fine.
        // req.file
        // {
        //   fieldname: 'filename_here',
        //   originalname: 'nhancv_dep_trai.png',
        //   encoding: '7bit',
        //   mimetype: 'image/png',
        //   destination: '/tmp/',
        //   filename: 'filename_here-1607694392023-220481630',
        //   path: '/tmp/filename_here-1607694392023-220481630',
        //   size: 5907
        // }
        const file = req.file;
        console.log(file);

        // Delete tmp
        try {
          // fs.unlinkSync(file.path);
        } catch (e) {
          // Ignore
          console.error(e);
        }
        res.json({ msg: "ok" });
      }
    });
  }
}

module.exports = new StorageController();
