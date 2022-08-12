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
const myMiddlewares = require("./middleware");
require("./utils/paypal");
global.__basedir = path.resolve("../");

function createServer() {
  const app = express();

  const corsOptions = {
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://fitness-managment.herokuapp.com",
      "https://fitm-serv.herokuapp.com",
    ],
  };
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "./access.log")
  ); // log every http request in access.log file
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
  ); // middleware for more secure response headers
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
  app.use("/api/register", registerRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/manager", managerRoutes);
  app.use("/api/client", clientRoutes);
  app.use("/api/instructor", instructorRoutes);
  app.use("/api/fullAccess", fullAccessRoutes);
  app.use("/api/user", userRoutes);
  app.use(myMiddlewares.notFound);

  return app;
}
module.exports = createServer;
