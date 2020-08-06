// variables
const carrito = document.getElementById('carrito');
const Cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

// listeners
cargarEventListeners();
function cargarEventListeners(){
     // se dispara cuando se presiona agregar carrito
     Cursos.addEventListener('click', comprarCurso);

     //cuando se elimina un curso del carrito
     carrito.addEventListener('click',eliminarCurso);

     //al vaciar el carrtio
     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

     // al cargar el documento, mostrar local storage
     document.addEventListener('DOMContentLoaded', leerLocalStorage);
}

// funciones
//funcion que añade el curso al carrito
function comprarCurso(e){
     e.preventDefault();
     //delegation para agregar-carrito
     if(e.target.classList.contains('agregar-carrito')){
          const curso = e.target.parentElement.parentElement;
          // enviamos el curso seleccionado para tomar sus datos           
          leerDatosCurso(curso);
     }
}
// lee los datos del curso
function leerDatosCurso(curso){
     const infoCurso = {
          imagen: curso.querySelector('img').src,
          titulo: curso.querySelector('h4').textContent,
          precio: curso.querySelector('.precio span').textContent,
          id: curso.querySelector('a').getAttribute('data-id')
     }

     insertarCarrito(infoCurso);
}
//muestra el curso seleccionado en el carrito
function insertarCarrito(curso){
     const row = document.createElement('tr');
     row.innerHTML= `
          <td>
               <img src="${curso.imagen}" width=100>
          </td>
          <td>${curso.titulo}</td>
          <td>${curso.precio}</td>
          <td>
               <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
          </td>
     `;
     listaCursos.appendChild(row);
     guardarCursoLocalStorage(curso);
}
//elimina el curso del carrito en el DOM
function eliminarCurso(e){
     e.preventDefault();

     let curso;
     let cursoId;
     if(e.target.classList.contains('borrar-curso')){
          e.target.parentElement.parentElement.remove();
          curso = e.target.parentElement.parentElement;
          cursoId = curso.querySelector('a').getAttribute('data-id');
     }
     eliminarCursoLocalStorage(cursoId);
}
//elimina los cursos del carrito en el DOM
function vaciarCarrito(){
     // forma lenta
     //listaCursos.innerHTML = '';
     // forma rapida (recomendada)
     while(listaCursos.firstChild){
          listaCursos.removeChild(listaCursos.firstChild);
     }

     // vaciar local storage
     vaciarLocalStorage();

     return false;
}

//almacena cursos en el carrito a local storage
function guardarCursoLocalStorage(curso){
     let  cursos;
     // toma el valor de un arreglo con datos de LS o vacio
     cursos = obtenerCursosLogalStorage();

     //el curso seleccionado se agrega al carrito
     cursos.push(curso);

     localStorage.setItem('cursos', JSON.stringify(cursos));
}

//comprueba que haya elementos en local storage
function obtenerCursosLogalStorage(){
     let cursosLS;

     //comprobamos si hay algo en local storage
     if(localStorage.getItem('cursos') === null){
          cursosLS = [];
     }else{
          cursosLS = JSON.parse(localStorage.getItem('cursos'));
     }
     return cursosLS;
}

//imprime los cursos de local storage en el carrito
function leerLocalStorage(){
     let cursosLS;

     cursosLS = obtenerCursosLogalStorage();

     cursosLS.forEach(function(curso){
          // construir el template
          const row = document.createElement('tr');
          row.innerHTML= `
               <td>
                    <img src="${curso.imagen}" width=100>
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
               </td>
          `;
          listaCursos.appendChild(row);
     })
}

//eliminar curso por el id en local storage
function eliminarCursoLocalStorage(curso){
     let cursosLS;
     //obtenemos el arreglo de  cursos
     cursosLS = obtenerCursosLogalStorage();
     // iteramos comparando el ID del curso borrado con los del LS
     cursosLS.forEach(function(cursoLS, index){
          if(cursoLS.id === curso){
               cursosLS.splice(index, 1);
          }
     })
     // añadimos el arreglo actual a local storage
     localStorage.setItem('cursos', JSON.stringify(cursosLS));
}

//elimina todos los cursos de local storage
function vaciarLocalStorage(){
     localStorage.clear();
}