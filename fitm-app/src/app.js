const createServer = require("./server");
const env = process.env.NODE_ENV || "development";
const { PORT } = require("../config/config")[env];
const dbConn = require("./utils/db-connection");
const app = createServer();
const serverPORT = process.env.PORT || PORT;
const init = async () => {
  try {
    await dbConn.connectToDB(); // connect to database
    app.listen(serverPORT, () => {
      //start the http server
      console.log(`Server is listening on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("Error encountered", err);
  }
};
init();
