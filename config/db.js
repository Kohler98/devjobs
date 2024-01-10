
const mongoose = require("mongoose")


const dbConnection = async() =>{
    try{
        await mongoose.connect(process.env.DATABASE,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        
        })

        console.log("base de datos online")
    }catch(error){
        console.log(error)
        throw new Error ( "Error a la hora de iniciar la base de datos")
    }
}
//importar los modelos
module.exports = {
    dbConnection
}