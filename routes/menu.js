// INDEX

const Controller = require("../controllers/controller");
const router = require("express").Router();

router.get("/", Controller.allMenu);
router.get("/category", Controller.categories);
router.get("/category/:categoryId", Controller.menuByCategory);
router.get("/:itemId/add", Controller.addToCart);
router.get("/:id/increase", Controller.increaseCart);
router.get("/:id/decrease", Controller.decreaseCart);

module.exports = router;
