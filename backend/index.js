require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/user.routes");
const pool = require("./db");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const storageRouter = require("./routes/storage.routes");

const multer = require("multer");
const tokenService = require("./services/token.service");
const storage = multer.diskStorage({
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

const app = express();

app.use(bodyParser.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(userRouter);
app.use(storageRouter);
app.use(errorMiddleware);

const PORT = 5000 || process.env.PORT;

const start = async () => {
  try {
    pool.query("SELECT NOW()", (err, res) => {
      if (err) {
        console.log(err);
        pool.end();
      } else console.log("DB connected");
    });

    app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
