const formatRupiah = require('../helpers/helper.js')
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
    static async home(req, res){
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }
  static async renderLogin(req, res) {
    try {
      res.render("login");
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
          console.log(req.session);

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
      res.send(error);
    }
  }

  static async renderRegister(req, res) {
    try {
      if (req.session.userId) {
        res.redirect("/");
      } else {
        res.render("register");
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
      res.send(error);
    }
  }
  static async categoriesMenu(req, res) {
    try {
      let data = await Category.findAll({ include: Item });
      res.render("category", { data });
    } catch (error) {
      res.send(error);
    }
  }
  static async renderByCategory(req, res) {
    try {
      let { categoryId } = req.params;
      let data = await Item.findAll({ where: { CategoryId: categoryId } });
      res.render("item", { data });
    } catch (error) {
      res.send(error);
    }
  }
  static async handlerByCategory(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async cart(req, res) {
    try {
        const data = await Cart.findAll({
            include: CartItem 
          });
        res.send(data)
        // res.render('cart', {data, formatRupiah})
    } catch (error) {
        
      res.send(error.message);
    }
  }
  static async handlerCart(req, res) {
    try {
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
      let data = await User.findByPk(id, {
        include: UserProfile,
      });
      res.render(data);
      // res.redirect("/profile/edit", { data });
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
