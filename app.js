const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes");
const session = require("express-session");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "Ini Rahasia",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: true,
    },
  })
);
app.use("/", router);

app.listen(port, () => {
  console.log(`Welcome to MarfoodMD on port ${port}`);
});
