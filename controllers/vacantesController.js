const { response } = require("express");
const Vacantes = require("../models/Vacantes");
const { body, sanitizeBody, validationResult } = require('express-validator');
const multer = require('multer')
const shortid = require('shortid')

const mongoose = require('mongoose')
const formularioAgregarVacante = (req,res=response)=>{
    res.render('nueva-vacante',{
        nombrePagina:'Nueva Vacante',
        tagline:'Llena el formulario y publica tu vacante',
        cerrarSesion:true,
        nombre:req.user.nombre,
        imagen:req.user.imagen,
    })
}

//agrega las vacantes a la base de datos
const agregarVacante = async(req,res=response)=>{
    const vacante = new Vacantes(req.body)
    // usuario auther del la ancate

    vacante.autor = req.user._id
    // crear arreglo de habilidades skills
    vacante.skills = req.body.skills.split(",")
    //almacenar en la base de datos 
    
    const nuevaVacante = await vacante.save()

    //redireccionar
    res.redirect(`/vacante/${nuevaVacante.url}`)
}

const mostrarVacante = async(req,res, next)=>{
    const vacante = await Vacantes.findOne({url:req.params.url}).populate('autor')


    if(!vacante) return next()

    res.render('vacante',{
        nombrePagina: vacante.titulo,
        barra:true,
        vacante,
    })
}
const formEditarVacante = async(req,res=response, next)=>{
    const vacante = await Vacantes.findOne({url:req.params.url})
    
    if(!vacante)  return next()
    res.render('editar-vacante',{
        nombrePagina: `Editar - ${vacante.titulo}`,
        barra:true,
        cerrarSesion:true,
        nombre:req.user.nombre,
        vacante,
    })
}
const editarVacante = async(req, res=response)=>{
    const nuevaVacante = req.body
    // crear arreglo de habilidades skills
    nuevaVacante.skills = req.body.skills.split(",")
    const vacante = await Vacantes.findOneAndUpdate({url:req.params.url},nuevaVacante,{
        new:true,
        runValidators:true,

    })

 
    if(!vacante) return next()
    res.render('vacante',{
        nombrePagina: nuevaVacante.titulo,
        barra:true,
        vacante,
    })
}
// validar y sanitizar los campos de las vacantes 
const validarVacante = async(req,res = response,next) =>{
    //sanitizar
    // sanitizeBody('nombre').escape()
    await body('titulo').escape().trim().notEmpty().withMessage('El titulo no puede ir vacío').run(req); 
    await body('empresa').escape().trim().notEmpty().withMessage('La empresa no puede ir vacío').run(req); 
    await body('ubicacion').escape().trim().notEmpty().withMessage('Agrega una ubicacion').run(req); 
    await body('contrato').escape().trim().notEmpty().withMessage('Seleccione el tipo de contrato').run(req); 
    await body('skills').escape().trim().notEmpty().withMessage('Agrega al menos una habilidad').run(req); 
    
    const errores = validationResult(req)

    if(errores.errors.length > 0){
        req.flash('error',errores.errors.map(error=>error.msg))

        res.render('nueva-vacante',{
            nombrePagina:'Nueva Vacante',
            tagline:'LLene el formulario y publica tu vacante',
            cerrarSesion:true,
            nombre:req.user.nombre,
            mensajes:req.flash()
        })
        return
    }
 
    next()
}
const  eliminarVacante = async (req,res)=>{
    const {id} = req.params
    const vacante =  await Vacantes.findById(id)
 
    if(verificarAutor(vacante,req.user)){
        vacante.deleteOne()
        res.status(200).send("Vacante eliminada correctamente")

    }else{

        res.status(403).send('error')
    }

}

const verificarAutor = (vacante = {}, usuario = {}) =>{
    if(!vacante.autor.equals(usuario._id)){
        return false
    }
    return true
}
const subirCV = async(req,res=response, next) =>{
 
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
            res.redirect('back')
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
            cb(null,__dirname+'../../public/uploads/cv')
        },
        filename:(req,file,cb)  =>{
            const extension = file.mimetype.split('/')[1]
            cb(null,`${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype == 'application/pdf'){
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true)
        }else{
            cb(new Error('Formato no valido'), false)
        }
    },
    
}
const upload = multer(configuracionMulter).single('cv')

// almacenar los canddatos en la BD
const contactar = async(req,res=response, next) =>{
    const vacante = await Vacantes.findOne({url:req.params.url})


    if(!vacante) return next()
    // contruir el objeto con el cv
    const nuevoCandidato = {
        nombre:req.body.nombre,
        email:req.body.email,
        cv:req.file.filename
    }

    // almacenar la vacante}
    vacante.candidatos.push(nuevoCandidato)
    await vacante.save()

    // mensaje flash y redireccion
    
    req.flash('correcto', 'Se envio tu corriculum correctamente')

    res.redirect('/')
}
const mostrarCandidatos = async(req,res=response, next) =>{ 
    const vacante = await Vacantes.findById(req.params.id)


    if(vacante.autor != req.user._id.toString() || !vacante){
        return next()
    }
    res.render('candidatos',{
        nombrePagina:`Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion:true,
        nombre:req.user.imagen,
        imagen:req.user.imagen,
        candidatos:vacante.candidatos
    })


}
//buscador de vacantes

const buscarVacantes = async(req,res)=>{
    const vacantes = await Vacantes.find({
        $text:{
            $search:req.body.q
        }
    })

    // mostrar las vacantes
    res.render('home',{
        nombrePagina: `Resultados para la busqueda : ${req.body.q}`,
        barra:true,
        vacantes
    })
}
module.exports={

    formularioAgregarVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante,
    validarVacante,
    eliminarVacante,
    subirCV,
    contactar,
    mostrarCandidatos,
    buscarVacantes
}