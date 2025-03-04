const Controller = require("../controllers/controller")
const router = require("express").Router()


router.get("/", Controller.home);
router.get("/login", Controller.renderLogin);
router.post("/login", Controller.handlerLogin);
router.get("/register", Controller.renderRegister);
router.post("/register", Controller.handlerRegister);
router.get("/categories", Controller.categoriesMenu);
router.get("/categories/:categoryId", Controller.renderByCategory);
router.post("/categories/:categoryId", Controller.handlerByCategory);
router.get("/cart", Controller.cart);
router.post("/cart", Controller.handlerCart);
router.get("/cart/:id/delete", Controller.deleteCart);
router.get("/success", Controller.renderInvoice);
router.get("/profile/", Controller.profile);
router.get("/editprofile", Controller.editProfile);
router.post("/editprofile", Controller.handlerEditProfile);
router.post("/logout", Controller.logout)

module.exports = router