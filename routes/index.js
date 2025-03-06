// INDEX

const Controller = require("../controllers/controller");
const router = require("express").Router();
const routerProfile = require("./profile");

const isLoggedIn = function (req, res, next) {
  if (!req.session.userId) {
    const error = "Please login first";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

const isAdmin = function (reg, res, next) {
  if (req.session.userId && req.session.role !== "admin") {
    const error = "You have no access";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

router.get("/register", Controller.renderRegister);
router.post("/register", Controller.handlerRegister);
router.get("/login", Controller.renderLogin);
router.post("/login", Controller.handlerLogin);
router.get("/logout", Controller.logout);
router.get("/about", Controller.construction);
router.get("/contact", Controller.construction);
router.get("/", Controller.home);
router.get("/menu", Controller.allMenu);
router.get("/menu/:itemId/add", Controller.addToCart);
router.get("/menu/category/:categoryId", Controller.menuByCategory);
router.get("/categories", Controller.categories);
router.get("/cart", Controller.cart);
router.post("/cart", Controller.handlerCart);
router.get("/cart/:id/delete", Controller.deleteCart);
router.get("/success", Controller.renderInvoice);
router.use("/profile/", isLoggedIn, routerProfile);

module.exports = router;
