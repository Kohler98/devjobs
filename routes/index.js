
const express = require("express")
const {mostrarTrabajos} = require('../controllers/homeController')
const { formularioAgregarVacante,agregarVacante,mostrarVacante,formEditarVacante,editarVacante,validarVacante,eliminarVacante,subirCV,contactar, mostrarCandidatos,buscarVacantes} = require("../controllers/vacantesController")
const { formIniciarSesion, formCrearCuenta,crearCuenta,validarRegistro,subirImagen, validarInicioSesion,formEditarPerfil,editarPerfil,validarEditarPerfil} = require("../controllers/usuariosController")
const { autenticarUsuario,mostrarPanel,verificarUsuario,cerrarSesion,formReestableerPassword,enviarToken,reestablecerPassword,guardarPassword} = require("../controllers/authController")
const router = express.Router()
 
router.get("/",mostrarTrabajos)
//crear vacantes

router.get('/vacante/nueva',
verificarUsuario,
formularioAgregarVacante)

router.post('/vacante/nueva',
verificarUsuario,
validarVacante,
agregarVacante)

// mostrar vacante (singular)
router.get('/vacante/:url',mostrarVacante)

// editar vacante
router.get('/vacante/editar/:url',
verificarUsuario,
formEditarVacante)
// guardar  vacante editado
router.post('/vacante/editar/:url',
verificarUsuario,
validarVacante,
editarVacante)
//eliminar Vacantes

router.delete('/vacante/eliminar/:id',
eliminarVacante)
// crear cuentas
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta',
validarRegistro,
crearCuenta)
// iniciar sesion
router.get('/iniciar-sesion',formIniciarSesion)
router.post('/iniciar-sesion',
validarInicioSesion,
autenticarUsuario)

//cerrar sesion
router.get('/cerrar-sesion',
verificarUsuario,
cerrarSesion
)
// resetear password (emails)

router.get('/reestablecer-password', formReestableerPassword)
router.post('/reestablecer-password', enviarToken)
// resetear password (almacenar en la base de datos)

router.get('/reestablecer-password/:token',
reestablecerPassword)
router.post('/reestablecer-password/:token',
guardarPassword)
//panel de administracion

router.get('/administracion',
verificarUsuario,
mostrarPanel)

//editar perfil
router.get('/editar-perfil',
verificarUsuario,

formEditarPerfil
)
router.post('/editar-perfil',
verificarUsuario,
// validarEditarPerfil,
subirImagen,
editarPerfil
)

// recibir mensajes de canditados

router.post('/vacantes/:url',
subirCV,
contactar)

router.get('/candidatos/:id',
verificarUsuario,
mostrarCandidatos
)

// buscador de vacantes
router.post('/buscador',buscarVacantes)
module.exports = router
