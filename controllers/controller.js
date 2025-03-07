const { where } = require("sequelize");
const formatRupiah = require("../helpers/helper.js");
const {
  Cart,
  CartItem,
  Category,
  Item,
  User,
  UserProfile,
} = require("../models");
const bcrypt = require("bcryptjs");
const e = require("express");
const easyinvoice = require("easyinvoice");

class Controller {
  static async home(req, res) {
    try {
      let category = await Category.findAll();
      let menu = await Item.findAll();
      let session = req.session;
      let user = await User.findByPk(req.session.userId, {
        include: UserProfile,
      });
      res.render("home", { category, menu, session, user, formatRupiah });
    } catch (error) {
      res.send(error);
    }
  }

  static async construction(req, res) {
    try {
      let category = await Category.findAll();
      let session = req.session;
      let user = await User.findByPk(req.session.userId, {
        include: UserProfile,
      });
      res.render("construction", { category, session, user, formatRupiah });
    } catch (error) {
      res.send(error);
    }
  }

  static async renderLogin(req, res) {
    try {
      let { error } = req.query;
      if (error) {
        error = error.split(",").join(" ");
      }
      res.render("login", { error });
    } catch (error) {
      res.send(error);
    }
  }
  static async handlerLogin(req, res) {
    try {
      let { email, password } = req.body;
      let user = await User.findOne({ where: { email } });
      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (isValidPassword) {
          req.session.userId = user.id;
          req.session.role = user.role;
          res.redirect("/");
        } else {
          const error = "Invalid password";
          res.redirect(`/login?error=${error}`);
        }
      } else {
        const error = "Email not found";
        res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((el) => el.message);
        res.redirect(`/register?error=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async renderRegister(req, res) {
    try {
      let { error } = req.query;
      if (error) {
        error = error.split(",").join(" ");
      }
      if (req.session.userId) {
        res.redirect("/");
      } else {
        res.render("register", { error });
      }
    } catch (error) {
      res.send(error);
    }
  }

  static async handlerRegister(req, res) {
    try {
      let { name, email, password, role } = req.body;
      let user = await User.create({ name, email, password, role });
      await UserProfile.create({
        balance: 0,
        UserId: user.id,
      });
      res.redirect("/login");
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let errors = error.errors.map((el) => el.message);
        res.redirect(`/register?error=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async categories(req, res) {
    try {
      let data = await Category.findAll({ include: Item });
      res.render("category", { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async allMenu(req, res) {
    try {
      let { search } = req.query;
      let menu = await Item.search(search);
      let categories = await Category.findAll();
      let cartUser = await Cart.findAll({ include: User });
      res.render("menu", { menu, categories, cartUser, formatRupiah });
    } catch (error) {
      res.send(error);
    }
  }

  static async menuByCategory(req, res) {
    try {
      let { categoryId } = req.params;
      let menu = await Item.findAll({ where: { CategoryId: categoryId } });
      let categories = await Category.findAll();
      res.render("menu", { menu, categories, formatRupiah });
    } catch (error) {
      res.send(error);
    }
  }

  static async handlerByCategory(req, res) {
    try {
      let { categoryId } = req.params;
      let { ItemId, quantity } = req.body;
      let UserId = req.session.userId;
      let cart = await Cart.findOne({ where: { UserId } });
      if (!cart) {
        cart = await Cart.create({ UserId });
      }
      let cartItem = await CartItem.findOne({
        where: { CartId: cart.id, ItemId },
      });
      if (!cartItem) {
        await CartItem.create({ CartId: cart.id, ItemId, quantity });
      } else {
        await CartItem.update(
          { quantity },
          { where: { CartId: cart.id, ItemId } }
        );
      }
      res.redirect("/cart");
    } catch (error) {
      res.send(error);
    }
  }

  static async addToCart(req, res) {
    try {
      let { categoryId, itemId } = req.params;
      let cart = await Cart.findAll({ where: { ItemId: itemId } });
      let newCart = await Cart.create({
        ItemId: itemId,
        UserId: req.session.userId,
        quantity: 1,
      });
      await CartItem.create({
        ItemId: itemId,
        CartId: newCart.id,
      });
      res.redirect(`/menu`);
    } catch (error) {
      res.send(error);
    }
  }

  static async cart(req, res) {
    try {
      let { deleted } = req.query;
      let UserId = req.session.userId;
      let cart = await Cart.findAll({ include: Item }, { where: { UserId } });
      let cartItems = await CartItem.findAll();
      let user = await User.findByPk(req.session.userId, {
        include: UserProfile,
      });
      res.render("cart", { cartItems, deleted, formatRupiah, user, cart });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async increaseCart(req, res) {
    try {
      const { id } = req.params;
      await Cart.increment(
        {
          quantity: 1,
        },
        {
          where: {
            id,
          },
        }
      );
      res.redirect("/cart");
    } catch (error) {
      res.send(error);
    }
  }
  static async decreaseCart(req, res) {
    try {
      const { id } = req.params;
      await Cart.decrement(
        {
          quantity: 1,
        },
        {
          where: {
            id,
          },
        }
      );
      res.redirect("/cart");
    } catch (error) {
      res.send(error);
    }
  }

  static async handlerCart(req, res) {
    try {
      let { ItemId, quantity } = req.body;
      let UserId = req.session.userId;
      let cart = await Cart.findOne({ where: { UserId } });
      if (!cart) {
        cart = await Cart.create({ UserId });
      }
      let cartItem = await CartItem.findOne({
        where: { CartId: cart.id, ItemId },
      });
      if (!cartItem) {
        await CartItem.create({ CartId: cart.id, ItemId, quantity });
      } else {
        await CartItem.update(
          { quantity },
          { where: { id: 1, CartId: cart.id, ItemId } }
        );
      }
      res.redirect("/cart");
    } catch (error) {
      res.send(error);
    }
  }
  static async deleteCart(req, res) {
    try {
      let { id } = req.params;
      let data = await Cart.findByPk(id, { include: Item });
      let deleted = "";
      data.Items.map((el) => (deleted = el.name));
      await CartItem.destroy({ where: { CartId: id } });
      await Cart.destroy({
        where: {
          id: id,
        },
      });
      res.redirect(`/cart?deleted=${deleted}`);
    } catch (error) {
      res.send(error);
    }
  }

  static async success(req, res) {
    try {
      const userId = req.session.userId;
      let cart = await Cart.findAll(
        { include: Item },
        { where: { UserId: userId } }
      );
      cart.forEach((el) => {
        CartItem.destroy({ where: { CartId: el.id } });
      });
      await Cart.destroy({ where: { UserId: userId } });
      res.render("success");
    } catch (error) {
      res.send(error);
    }
  }

  static async renderInvoice(req, res) {
    try {
      const userId = req.session.userId;
      const user = await User.findByPk(userId, {
        include: UserProfile,
      });
      let cart = await Cart.findAll(
        { include: Item },
        { where: { UserId: userId } }
      );
      let productList = [];
      let listItem = {};
      cart.forEach((el) => {
        el.Items.forEach((item) => {
          listItem.quantity = el.quantity;
          listItem.description = item.name;
          listItem.price = item.price;
          productList.push(listItem);
          listItem = {};
        });
      });

      const data = {
        client: {
          company: user.name,
          address: user.UserProfile.address,
          zip: user.email,
          city: user.UserProfile.phoneNumber,
        },
        sender: {
          company: "MarFoodMD",
          address: "Hacktiv8 Pondok Indah",
          zip: "HCK-081",
          city: "Jakarta",
          country: "Indonesia",
        },
        images: {
          logo: "https://raw.githubusercontent.com/marhanura/marfoodmd/refs/heads/main/public/logo.png",
        },
        information: {
          number:
            new Date().getFullYear() +
            new Date().getMonth() +
            user.role +
            user.id,
          date: new Date().toISOString().split("T")[0],
        },
        products: productList,
        bottomNotice: "Thank you for purchasing with us! #MakanDimanaaja",
        settings: {
          currency: "IDR",
        },
      };
      const result = await easyinvoice.createInvoice(data);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="invoice.pdf"'
      );
      res.send(Buffer.from(result.pdf, "base64"));
    } catch (error) {
      res.send(error);
    }
  }

  static async profile(req, res) {
    try {
      let id = req.session.userId;
      let data = await User.findByPk(id, {
        include: UserProfile,
      });
      res.render("profile", { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async editProfile(req, res) {
    try {
      let id = req.session.userId;
      let data = await User.findByPk(id, { include: UserProfile });
      res.render("editProfile", { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async handlerEditProfile(req, res) {
    try {
      let id = req.session.userId;
      let { name, email, password, address, phoneNumber } = req.body;
      await User.update(
        {
          name,
          email,
          password,
        },
        { where: { id } }
      );
      await UserProfile.update(
        {
          address,
          phoneNumber,
        },
        {
          where: { UserId: id },
        }
      );
      res.redirect("/profile");
    } catch (error) {
      res.send(error);
    }
  }

  static async logout(req, res) {
    try {
      await req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
