const {Schema,model}  = require('mongoose')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
mongoose.Promise = global.Promise
 

const UsuariosSchema = new Schema({
    nombre:{
        type:String,
        require:'El nombre de es obligatorio',
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        trim:true,
        required:true,
    },
    token:String,
    expira:Date,
    imagen:String
})
// metodo para hashear los password
UsuariosSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }

    const hash = await bcrypt.hash(this.password,12)
    this.password = hash
    next()
})
UsuariosSchema.post('save',function(error, doc, next){
    if(error.name == "MongoError" && error.code == 11000){
        next("Ese correo ya esta registrado ")
    }else{
        next(error)
    }
})
UsuariosSchema.methods = {
    compararPassword:function(password){
        return bcrypt.compareSync(password,this.password)
    }
}
module.exports = model('Usuario',UsuariosSchema)