const { where } = require("sequelize")
const { Cart, CartItem, Category, Item, User, UserProfile} = require("../models")
const bcrypt = require('bcryptjs')
const e = require("express")


class Controller {
    static async home(req, res){
        try {
            res.send("HALOOO!!!")
        } catch (error) {
            res.send(error)
        }
    }
    static async renderLogin(req, res){
        try {
            res.render('login')
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerLogin(req, res){
        try {
            let {email, password} = req.body
            let user = await User.findOne({where: {email}})
            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (isValidPassword) {
                    req.session.userId = user.id
                    req.session.role = user.role
                    res.redirect('/')
                }else {
                    const error = "Invalid password"
                    res.redirect(`/login?error=${error}`)
                }
            }else {
                const error = "Email not found"
                res.redirect(`/login?error=${error}`)
            }
        } catch (error) {
            res.send(error)
        }
    }
    static async renderRegister(req, res){
        try {
            res.render('register')
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerRegister(req, res){
        try {
            let { name, email, password, role} = req.body
            await User.create({name, email, password, role})
            res.redirect("/login")
        } catch (error) {
            res.send(error)
        }
    }
    static async categoriesMenu(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async renderByCategory(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerByCategory(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async cart(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerCart(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async deleteCart(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async renderInvoice(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async profile(req, res){
        try {

        } catch (error) {
            res.send(error)
        }
    }
    static async editProfile(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerEditProfile(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async logout(req, res){
        try {
            await req.session.destroy()
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller