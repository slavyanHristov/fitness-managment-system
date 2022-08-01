const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const registerRoutes = require("./routes/register");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const managerRoutes = require("./routes/manager");
const fullAccessRoutes = require("./routes/fullAccess");
const clientRoutes = require("./routes/client");
const instructorRoutes = require("./routes/instructor");
const userRoutes = require("./routes/user");
const imageRoutes = require("./routes/image");
const myMiddlewares = require("./middleware");
require("./utils/paypal");
global.__basedir = path.resolve("../"); //TODO: is it correct?

function createServer() {
  const app = express();

  const corsOptions = {
    credentials: true,
    origin: "http://localhost:3000",
  };
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "./access.log")
  ); // log every http request in access.log file

  // paypal.configure({
  //   mode: "sandbox", //sandbox or live
  //   client_id:
  //     "AfSfpit4difA3a3thowdD7AgdA4D01FIjTmryoKnyGcxyeqAWk0VNLZH9ElaPekTbUOCvIMOlsipYUQa",
  //   client_secret:
  //     "EPKPYNUoCXCD9cIWt3qI-5XoMrHXDz43R73F68KdwYJbCoFaa-fHe0JRnBqaL_1-6Be8ODbxmmb8HrgK",
  // });

  app.use(cors(corsOptions));
  app.use(
    "/resources",
    express.static(path.join(__basedir, "resources/static/assets/"))
  );
  app.use(cookieParser());
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  ); // middleware for more secure response headers -- REMOVE IT IF YOU ENCOUNTER CORS --
  app.use(
    morgan("combined", {
      stream: accessLogStream,
    })
  );
  app.use(
    express.json({
      limit: "5mb",
    })
  );
  app.use(
    express.urlencoded({
      limit: "5mb",
      extended: true,
    })
  );
  app.use("/api/register", registerRoutes); // think about moving this to routes/user.js
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/manager", managerRoutes);
  app.use("/api/client", clientRoutes);
  app.use("/api/instructor", instructorRoutes);
  app.use("/api/image", imageRoutes);
  app.use("/api/fullAccess", fullAccessRoutes);
  app.use("/api/user", userRoutes);
  app.use(myMiddlewares.notFound);

  return app;
}
module.exports = createServer;
