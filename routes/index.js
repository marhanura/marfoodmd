const Controller = require("../controllers/controller")
const router = require("express").Router()
const session = require('express-session')

const isLoggedIn = function(req,res, next){
    if (!req.session.userId) {
        const error = "Please login first"
        res.redirect(`/login?error=${error}`)
    }else{
        next()
    }
}

const isAdmin = function(reg, res, next){
    if (req.session.userId && req.session.role !== "admin") {
        const error ="You have no access"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}

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