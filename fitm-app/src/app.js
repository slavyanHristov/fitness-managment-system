const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const userRoutes = require("./routes/register");
const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin")
const managerRoutes = require("./routes/manager")
const clientRoutes = require("./routes/client")
const myMiddlewares = require("./middleware");

function createServer() {
  const app = express();

  const corsOptions = {
    origin: "http://localhost:3000",
  };
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "./access.log")
  ); // log every http request in access.log file

  app.use(cors(corsOptions));
  app.use(helmet()); // middleware for more secure response headers -- REMOVE IT IF YOU ENCOUNTER CORS --
  app.use(morgan("combined", {
    stream: accessLogStream
  }));
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(express.json());
  app.use("/api/register", userRoutes); // think about moving this to routes/user.js
  app.use("/api/auth", authRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/manager', managerRoutes)
  app.use('/api/client', clientRoutes)
  app.use(myMiddlewares.notFound);

  return app;
}
module.exports = createServer;