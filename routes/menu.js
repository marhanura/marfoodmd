// INDEX

const Controller = require("../controllers/controller");
const router = require("express").Router();

router.get("/", Controller.allMenu);
router.get("/:itemId/add", Controller.addToCart);
router.get("/category/:categoryId", Controller.menuByCategory);
router.get("/category", Controller.categories);

module.exports = router;
