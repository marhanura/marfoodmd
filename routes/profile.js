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

router.get("/", isLoggedIn, Controller.profile);
router.get("/edit", isLoggedIn, Controller.editProfile);
router.post("/edit", isLoggedIn, Controller.handlerEditProfile);

module.exports = router;
