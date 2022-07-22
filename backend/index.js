const express = require("express");
const userRouter = require("./routes/user.routes");
const pool = require("./db");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors({credentials: true}));
app.use(cookieParser());
app.use(userRouter);
app.use(storageRouter);
app.use(errorMiddleware);

const PORT = 5000 || process.env.PORT;

const start = async () => {
  try {

    pool.query("SELECT NOW()", (err, res) => {
      if(err){
        console.log(err);
        pool.end();
      }
      else
        console.log('DB connected');
    });

    app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
