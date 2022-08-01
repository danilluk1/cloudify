require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/user.routes");
const pool = require("./db");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const storageRouter = require("./routes/storage.routes");
const tokenService = require("./services/token.service");
const fileUpload = require("express-fileupload");
const logger = require("./logger/logger");

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 4 * 1024 * 1024 * 1024 * 1024, //4GB
    },
  })
);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(userRouter);
app.use(storageRouter);
app.use(errorMiddleware);

const PORT = 5000 || process.env.PORT;

const start = async () => {
  try {
    pool.query("SELECT NOW()", (err, res) => {
      if (err) {
        logger.err(err);
        pool.end();
      } else logger.info("DB connected");
    });

    app.listen(PORT, () => {
      logger.info(`Server started at ${PORT}`);
    });
  } catch (e) {
    logger.err(e);
  }
};

start();
