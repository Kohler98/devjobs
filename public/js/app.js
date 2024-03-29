import axios from 'axios'
import Swal from 'sweetalert2'


document.addEventListener("DOMContentLoaded",()=>{
    const skills = document.querySelector(".lista-conocimientos")
    let alertas = document.querySelector('.alertas')
    if(alertas){
        limpiarAlertas(alertas)
    }
    if(skills){
        skills.addEventListener("click",agregarSkills)
        skillsSeleccionados(skills)
    }

    const vacantesListados = document.querySelector('.panel-administracion')

    if(vacantesListados){
        vacantesListados.addEventListener('click', accionesListado)
    }


})

const skills = new Set()
const agregarSkills = (e)=>{
    if(e.target.tagName == 'LI'){
        if(e.target.classList.contains('activo')){
            skills.delete(e.target.textContent)
            e.target.classList.remove("activo")

        }else{
            skills.add(e.target.textContent)
            e.target.classList.add("activo")

        }
    } 
    const skillsArray = [...skills]
    document.querySelector("#skills").value = skillsArray
}

const skillsSeleccionados = (habilidades) =>{
    for(let habilidad of habilidades.children){
        if(habilidad.classList.value == "activo"){
            skills.add(habilidad.textContent)
        }

    }
    const skillsArray = [...skills]
    document.querySelector("#skills").value = skillsArray
}

const limpiarAlertas = (alertas) =>{
 

   const interval = setInterval(() => {
        if(alertas.children.length >0){
            alertas.removeChild(alertas.children[0])
        }else if(alertas.children.length ==0){
            alertas.parentElement.removeChild(alertas)
            clearInterval(interval)
        }
    }, 2000);
 
}

// eliminar vacantes

const accionesListado = (e)=>{
    e.preventDefault()
    if(e.target.dataset.eliminar){
        //eliminar por medio de axios


 
 
        Swal.fire({
            title: 'Confirmar Eliminacion',
            icon: 'Una vez eliminada no se puede recuperar',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
              'Si, Eliminar',
            cancelButtonText:
              'No, Cancelar',
            confirmButtonColor:'#d33',
            cancelButtonColor:'#3085d6',

          }).then((result)=>{
            if(result.value){
                const url = `${location.origin}/vacante/eliminar/${e.target.dataset.eliminar}`

                axios.delete(url,{params:{url}})
                    .then(function(res){
                        if(res.status ==200){
                            Swal.fire(
                                'Eliminado',
                                res.data,
                                'success'
                            )
                        }
                        e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)

                    })

            }
          })
          .catch(()=>{
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text:'No se pudo eliminar'
            })
          })
    }else if (e.target.tagName == "A"){
        window.location.href = e.target.href
    }
}