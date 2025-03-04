const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("#MakanDimanaaja!");
});

app.listen(port, () => {
  console.log(`Welcome to MarfoodMD on port ${port}`);
});
