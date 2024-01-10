const  mongoose = require('mongoose')
const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const LocalStrategy = require('passport-local').Strategy 

passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
},async(email,password,done)=>{
    const usuario = await Usuarios.findOne({email})

    if(!usuario) return done(null,false,{
        message:'Usuario no existente'
    })

    const verificarPass = usuario.compararPassword(password)
    if(!verificarPass) return done(null,false,{
        message:'Password incorrecto'
    })

    return done(null, usuario)
}))

passport.serializeUser((usuario,done)=>done(null,usuario._id))

passport.deserializeUser(async(id,done)=>{
    const usuario = await Usuarios.findById(id).exec()
    return done(null,usuario)
})

module.exports = passport