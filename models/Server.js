const express = require('express')
const handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { dbConnection } = require('../config/db')
const cookieParser = require('cookie-parser')
const exphbs = require("express-handlebars")
const session = require('express-session');
const mongoStore = require('connect-mongo') 
const flash = require("connect-flash")
const passport = require('../config/passport')

const createError = require('http-errors')
require('dotenv').config({path:'variables.env'})
 
class Server{
    constructor(){
        this.app = express()
        this.PORT = process.env.PORT
 
        // this.server = require('http').createServer(this.app);



        this.paths = {
            appRoutes:"/",
        }
        //conectar a base de datos

        this.conectarDB()
        //Midlewares : no son mas que funciones que van a añadirle otras funcionalidades al web server
        // en otras palabras es una funcion que se ejecuta antes de llamar un controlador o seguir con la ejecucion
        //de las peticiones
        //rutas de mi applicacion

        this.middlewares()
        
        this.routes()

        //sockets
 
    }

    middlewares(){
        // //cors 
 
        // habilitar lectura de datos de formulario
        this.app.use(express.urlencoded({extended:true}))
         //lectura y parseo del body
         this.app.use(express.json())
 
        // habilitar coockieParser
        this.app.use(cookieParser())
        // habilitar el csurfs
 
        
        // carpeta publica
        this.app.use(express.static('public'))
  
    
        this.app.engine('handlebars',
            exphbs.engine({
                handlebars: allowInsecurePrototypeAccess(handlebars),
                defaultLayout:'layout',
                helpers:require('../helpers/handlebars'),
        })
        ) 
        this.app.use(session({
            secret: process.env.SECRETO,
            key: process.env.KEY,
            resave: false, 
            saveUninitialized: false, 
            
            store: mongoStore.create({
                mongoUrl: process.env.DATABASE,
            })
          }));
        // inicializar passport
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        // alertas y flash messages
        this.app.use(flash())
        this.app.use(function(req,res,next){
            res.locals.mensajes = req.flash()
            next()
        })
        this.app.set('view engine','handlebars')
        // this.app.use((req,res,next) =>{
 
        //     next(createError(404,'No encontrado'))
        // })
        // this.app.use((error,req,res,next) =>{
        //     res.locals.mensaje = error.message
  
        //     const status = error.status || 500
        //     res.locals.status = status
        //     res.status(status)
        //     res.render('error')
        // })

    
    }
    routes(){
    
        this.app.use(this.paths.appRoutes, require("../routes/index.js"))
 
    }
 
    listen(){
        this.app.listen(this.PORT, ()=>{
            console.log("Servidor corriendo en puerto", this.PORT)
        })
    
      
    }

    async conectarDB(){
        await dbConnection()
    }
}


module.exports = Server