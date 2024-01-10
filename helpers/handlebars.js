const seleccionarSkills = (seleccionadas = [], opciones) =>{
 
    const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

    let html = ''
    skills.forEach(skill =>{
        html += `
        <li class=${seleccionadas.indexOf(skill)>=0 ? 'activo': '' }>${skill}</li>
        `   
    })

    return opciones.fn().html = html
}

 
const tipoContrato = (seleccionado,opciones)=>{
    return opciones.fn(this).replace(
        new RegExp(`value="${seleccionado}"`),'$& selected="selected"'
    )
}

const mostrarAlertas = (errores = {}, alertas) =>{
    const categoria = Object.keys(errores)
    
    let html = ''
    if(categoria && categoria.length){
        errores[categoria].forEach((error)=>{
            html+=`
                <div class="${categoria} alerta">
                    ${error}
                </div>
            `
        })    
        return alertas.fn().html = html
    }
 
}

module.exports = {
    seleccionarSkills,
    tipoContrato,
    mostrarAlertas
}