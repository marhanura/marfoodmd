const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes");
const session = require("express-session");
const easyinvoice = require("easyinvoice");

app.use(express.static("public"));
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

// app.use(flash());

// app.use((req
//   , res, next) => {
//   res.locals.success_msg = req.flash('success');
//   res.locals.error_msg = req.flash('error');
//   next();
// });
app.use("/", router);

app.listen(port, () => {
  console.log(`Welcome to MarfoodMD on port ${port}`);
});
