const {Schema,model}  = require('mongoose')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const slug = require('slug')
const shortid = require('shortid')

const VacantesSchema = new Schema({
    titulo:{
        type:String,
        require:'El nombre de la vacante es obligatorio',
        trim:true
    },
    empresa:{
        type:String,
        trim:true
    },
    ubicacion:{
        type:String,
        trim:true,
        require:'La ubicacion de la vacante es obligatorio',
    },
    salario:{
        type:String,
        default:0
    },
    contrato:{
        type:String
    },
    descripcion:{
        type:String,
        trim:true
    },
    url:{
        type:String,
        lowercase:true
    },
    skills:[String],
    candidatos:[{
        nombre:String,
        email:String,
        cv:String
    }],
    autor:{
        type:Schema.ObjectId,
        ref:'Usuario',
        required:'El autor es obligatorio'
    }
})
VacantesSchema.pre('save',function(next){
    const url = slug(this.titulo)
    this.url = `${url}-${shortid.generate()}`
    next()
})

// Crear un indice
VacantesSchema.index({titulo:'text'})
module.exports = model('Vacante',VacantesSchema)