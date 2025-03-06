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

class Controller {
  static async home(req, res) {
    try {
      let category = await Category.findAll();
      let menu = await Item.findAll();
      let session = req.session;
      let user = await User.findByPk(req.session.userId, {
        include: UserProfile,
      });
      res.render("home", { category, menu, session, user });
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
      res.render("construction", { category, session, user });
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
      res.render("menu", { menu, categories, formatRupiah });
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
      res.redirect(`/categories/${categoryId}`);
    } catch (error) {
      res.send(error);
    }
  }

  static async cart(req, res) {
    try {
      const data = await Cart.findAll({
        include: CartItem,
      });
      res.send(data);
      // res.render('cart', {data, formatRupiah})
    } catch (error) {
      res.send(error.message);
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
          { where: { CartId: cart.id, ItemId } }
        );
      }
      res.redirect("/cart");
    } catch (error) {
      res.send(error);
    }
  }
  static async deleteCart(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async renderInvoice(req, res) {
    try {
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
