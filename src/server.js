const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const api = require("./router");
const path = require("path");

const app = express();

app.use(
  express.json({
    limit: "20mb",
  })
);

app.use(cors());

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(
  express.urlencoded({
    limit: "20mb",
    extended: true,
  })
);

app.use(express.static("public"));

app.use("/api", api);

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../public", "index.html"))
);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
