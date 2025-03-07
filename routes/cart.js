// INDEX

const Controller = require("../controllers/controller");
const router = require("express").Router();

const isLoggedIn = function (req, res, next) {
  if (!req.session.userId) {
    const error = "Please login first";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

router.get("/", Controller.cart);
router.post("/", Controller.handlerCart);
router.get("/success", Controller.success);
router.post("/success", Controller.renderInvoice);
router.get("/:id/increase", Controller.increaseCart);
router.get("/:id/decrease", Controller.decreaseCart);
router.get("/:id/delete", Controller.deleteCart);

module.exports = router;
