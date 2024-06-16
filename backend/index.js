const express = require("express");
const app = express();
const logger = require("morgan");
var cors = require("cors");
const bodyParser = require("body-parser");
const server = require("http").createServer(app);
const data = require("./customer_type.json");

const origin = ["http://localhost:3000"];
app.use(logger("dev"));
app.use(
  cors({
    origin,
  })
);
app.use(bodyParser.json());
app.disable("etag");

app.get("/data", (req, res) => {
  res.send(data);
});
app.use("/static", express.static("static"));

const port = 8000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
