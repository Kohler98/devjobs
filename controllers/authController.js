const passport = require('passport')
const Vacantes = require('../models/Vacantes')
const Usuarios = require('../models/Usuarios')
const crypto = require('crypto')
const enviarEmail = require('../handler/email')

const autenticarUsuario = passport.authenticate('local',{
    successRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//revisar si el usuario esta autenticado o no

const verificarUsuario = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/iniciar-sesion')
}
const mostrarPanel = async(req,res)=>{
    const vacantes = await Vacantes.find({autor:req.user._id})

 
    res.render('administracion',{
        nombrePagina:'Panel de administracion',
        tagline:'Crea y administra tus vacantes dede aqui',
        cerrarSesion:true,
        nombre:req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    })
}

const cerrarSesion = (req, res)=>{
    req.logout(function(err){
        if(err) {
            return next(err);
        }
    })
    req.flash('correcto','Cerraste sesion correctamente')
        return res.redirect('/iniciar-sesion')
}

const formReestableerPassword = (req, res= response) =>{
    res.render('reestablecer-password',{
        nombrePagina : 'Reestablece tu Password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloco tu email'
    })
}
const enviarToken = async(req, res= response) =>{
    const usuario = await Usuarios.findOne({email:req.body.email})
    
    if(!usuario){
        req.flash('error', 'No existe ese usuario')
        return res.redirect('/iniciar-sesion')
    }
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expira = Date.now()+ 3600000
    
    // guardar el usuario
    
    await usuario.save()
    
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`
    
    console.log(resetUrl)
    
    
    await enviarEmail.enviar({
        usuario,
        subject:'Password Reset',
        resetUrl,
        archivo:'reset'
    })
    //todo correcto
    req.flash('correcto','Revisa tu email para las indicacion')
    res.redirect('/iniciar-sesion')
}  
const reestablecerPassword = async(req, res= response) =>{
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira:{
            $gt:Date.now(),
            
        }
    })
    if(!usuario){
        req.flash('error','El formulario ya no es valido, intenta de nuevo')
        return res.redirect('/reestablecer-password')
    }
    
    // todo bien mostrar elformulario
    
    res.render('nueva-password',{
        nombrePagina:"Nueva Contraseña"
    })
}
const guardarPassword = async(req, res= response) =>{
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira:{
            $gt:Date.now(),
            
        }
    })
    if(!usuario){
        req.flash('error','El formulario ya no es valido, intenta de nuevo')
        return res.redirect('/reestablecer-password')
    }
    // asignar nuevo password
    usuario.password = req.body.password
    usuario.token = undefined
    usuario.expira = undefined

    //agregar y eliminar valores del objeto
    await usuario.save()

    req.flash('correcto','Contraseña se ha modificado correctamente')
    res.redirect('/iniciar-sesion')
}
module.exports = {
    autenticarUsuario,
    mostrarPanel,
    verificarUsuario,
    cerrarSesion,
    formReestableerPassword,
    enviarToken,
    reestablecerPassword,
    guardarPassword
}