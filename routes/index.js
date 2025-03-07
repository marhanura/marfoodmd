// INDEX

const easyinvoice = require("easyinvoice");
const fs = require("fs");
const path = require("path");
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

const generateInvoiceData = (cartItems) => ({
  documentTitle: "Invoice",
  currency: "IDR",
  taxNotation: "vat",
  sender: {
    company: "MarFoodMD",
    address: "Jl. Makanan No. 1",
    zip: "12345",
    city: "Jakarta",
    country: "Indonesia",
  },
  client: {
    company: "Pelanggan",
    address: "Alamat Pelanggan",
    zip: "67890",
    city: "Kota Pelanggan",
    country: "Indonesia",
  },
  invoiceNumber: Math.floor(Math.random() * 100000).toString(),
  invoiceDate: new Date().toISOString().split("T")[0],
  products: cartItems.map((item) => ({
    quantity: item.quantity,
    description: item.Item.name,
    price: item.Item.price,
  })),
  bottomNotice: "Terima kasih telah berbelanja di MarFoodMD!",
});

router.get("/invoice", async (req, res) => {
  try {
    // Contoh cartItems, seharusnya ini diambil dari database
    const cartItems = [
      { Item: { name: "Ayam Goreng", price: 20000 }, quantity: 2 },
      { Item: { name: "Nasi Uduk", price: 10000 }, quantity: 1 },
    ];

    const invoiceData = generateInvoiceData(cartItems);
    const pdfResult = await easyinvoice.createInvoice(invoiceData);

    const filePath = path.join(__dirname, "../public", "invoice.pdf");
    fs.writeFileSync(filePath, pdfResult.pdf, "base64");

    res.json({ success: true, url: "/invoice.pdf" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error generating invoice" });
  }
});

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
router.get("/cart/:id/increase", Controller.increaseCart);
router.get("/cart/:id/decrease", Controller.decreaseCart);
router.post("/cart", Controller.handlerCart);
router.get("/cart/:id/delete", Controller.deleteCart);
router.get("/success", Controller.renderInvoice);
router.use("/profile/", isLoggedIn, routerProfile);

module.exports = router;
