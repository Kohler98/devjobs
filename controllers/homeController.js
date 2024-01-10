const Vacantes = require("../models/Vacantes")
const mongoose = require('mongoose')

mostrarTrabajos = async(req,res, next)=>{
    
    const vacantes =await Vacantes.find()

    if(!vacantes) return next()
    
    res.render('home',{
        nombrePagina:'devJobs',
        tagLines:'Encuentra y Publica trabajos para desarrolladores Web',
        barra:true,
        boton:true,
        vacantes
    })
}

module.exports = {
    mostrarTrabajos
}