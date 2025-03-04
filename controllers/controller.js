const { Cart, CartItem, Category, Item, User, UserProfile} = require("../models")


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
            
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerLogin(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async renderRegister(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
    static async handlerRegister(req, res){
        try {
            
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
            
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller