const { response } = require("express")
const Usuario = require("../models/Usuarios")
const { default: mongoose } = require("mongoose")
const bcrypt = require('bcrypt')
const { body, sanitizeBody, validationResult } = require('express-validator');
const Usuarios = require("../models/Usuarios");
const multer = require('multer')
const shortid = require('shortid')

const subirImagen = async(req,res=response, next) =>{
 
    upload(req,res, function(error) {   
        if(error){
            console.log(error)
            if( error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo es muy grande maximo 100kbs')
                }{
                    req.flash('error', error.message)

                }
            }else{
                req.flash('error',error.message)
            }
            res.redirect('/administracion')
            return 
        }else{
            return next()
        }
        
    })
 
}
// opciones de multer
const configuracionMulter = {
    limits:{fileSize : 100000},
    storage:fileStorage = multer.diskStorage({
        destination: (req,file,cb) =>{
            cb(null,__dirname+'../../public/uploads/perfiles')
        },
        filename:(req,file,cb)  =>{
            const extension = file.mimetype.split('/')[1]
            cb(null,`${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype == "image/jpeg" || file.mimetype == 'image/png'){
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true)
        }else{
            cb(new Error('Formato no valido'), false)
        }
    },
    
}

const upload = multer(configuracionMulter).single('imagen')


const formCrearCuenta = async(req,res)=>{
    res.render('crear-cuenta',{
        nombrePagina:'Crea tu cuenta en devJobs',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}
const validarRegistro = async(req,res = response,next) =>{
    //sanitizar
    // sanitizeBody('nombre').escape()
    await body('nombre').escape().trim().notEmpty().withMessage('El nombre no puede ir vacío').run(req); 
    await body('email').escape().trim().notEmpty().withMessage('El email no puede ir vacío').run(req); 
    await body('email').escape().trim().notEmpty().isEmail().withMessage('El email debe ser valido').run(req); 
    await body('password').escape().trim().notEmpty().withMessage('El password no puede ir vacío').run(req); 
    await body('confirmar').escape().trim().notEmpty().withMessage('El confirmar contraseña no puede ir vacío').run(req); 
    await body('confirmar').escape().trim().equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req); 
    
    const errores = validationResult(req)

    if(errores.errors.length > 0){
        req.flash('error',errores.errors.map(error=>error.msg))

        res.render('crear-cuenta',{
            nombrePagina:'Crea tu cuenta en devJobs',
            tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes:req.flash()
        })
        return
    }
 
    next()
}
const validarInicioSesion= async(req,res = response,next) =>{
    //sanitizar
 
    await body('email').escape().trim().notEmpty().withMessage('El email no puede ir vacío').run(req); 
    await body('email').escape().trim().notEmpty().isEmail().withMessage('El email debe ser valido').run(req); 
    await body('password').escape().trim().notEmpty().withMessage('El password no puede ir vacío').run(req); 
 
    
    const errores = validationResult(req)
 
    if(errores.errors.length > 0){
        req.flash('error',errores.errors.map(error=>error.msg))

        res.render('iniciar-sesion',{
            nombrePagina:'Inicia sesion en devJobs',
            tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes:req.flash()
        })
        return
    }
 
    next()
}
const crearCuenta = async(req,res=response)=>{

    const usuario = new Usuario(req.body)
    
    
    try {
        await usuario.save()
        res.redirect('/iniciar-sesion')
        
    } catch (error) {
        req.flash('error',error)
        res.redirect('/crear-cuenta')
    }
 

}
const formIniciarSesion = async(req, res=response)=>{
    res.render('iniciar-sesion',{
        nombrePagina:'Inicia sesion en devJobs',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}
const iniciarSesion = async(req, res=response)=>{
    const {email, password} = req.body
    const usuario = await Usuario.findOne({email:req.body.email})
    const validPassword = bcrypt.compareSync(password,usuario.password)
    if(!validPassword){

    }
    console.log(validPassword)
}
// editar perfil
const formEditarPerfil = (req,res)=>{
    res.render('editar-perfil',{
        nombrePagina:'Edita tu perfil en devJobs',
        usuario:req.usuario,
        cerrarSesion:true,
        nombre:req.user.nombre,
    })
}

const editarPerfil = async(req,res) =>{
    const usuario = await Usuarios.findById(req.user._id)
    usuario.nombre = req.body.nombre
    usuario.email = req.body.email
    if(req.body.password){
        usuario.password = req.body.password
    }

    if(req.file){
        usuario.imagen = req.file.filename
    }
 
    await usuario.save()
    req.flash('correcto','Cambios guardados correctamente')
    res.redirect('/administracion')
}
const validarEditarPerfil = async(req,res = response,next) =>{
    //sanitizar
 
    await body('nombre').escape().trim().notEmpty().withMessage('El nombre no puede ir vacío').run(req); 
    await body('email').escape().trim().notEmpty().withMessage('El email no puede ir vacío').run(req); 
 
 
 
    
    const errores = validationResult(req)
 
    if(errores.errors.length > 0){
        req.flash('error',errores.errors.map(error=>error.msg))

        res.render('iniciar-sesion',{
            nombrePagina:'Edita tu perfil en devJobs',
            usuario:req.usuario,
            cerrarSesion:true,
            nombre:req.user.nombre,
            mensajes:req.flash()
        })
        return
    }
 
    next()
}
module.exports = {
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    iniciarSesion,
    validarRegistro,
    validarInicioSesion,
    formEditarPerfil,
    editarPerfil,
    validarEditarPerfil,
    subirImagen
}