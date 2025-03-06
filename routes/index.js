// INDEX

const Controller = require("../controllers/controller");
const router = require("express").Router();
const routerProfile = require("./profile");
const routerMenu = require("./menu");
const routerCart = require("./cart");

const isLoggedIn = function (req, res, next) {
  if (!req.session.userId) {
    const error = "Please login first";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

router.get("/", Controller.home);
router.get("/register", Controller.renderRegister);
router.post("/register", Controller.handlerRegister);
router.get("/login", Controller.renderLogin);
router.post("/login", Controller.handlerLogin);
router.get("/logout", Controller.logout);
router.get("/about", Controller.construction);
router.get("/contact", Controller.construction);
router.use("/menu", routerMenu);
router.use("/cart", isLoggedIn, routerCart);
router.get("/success", Controller.renderInvoice);
router.use("/profile/", isLoggedIn, routerProfile);

module.exports = router;
