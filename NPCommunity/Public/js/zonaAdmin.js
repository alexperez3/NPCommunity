var contenedorGlobal;
var banearUsuario;
var papelera;
var tituloQueEs;
var usuarios;
var grupos;
var posts;
var comentarios;
var productos;
var ultimoBotonPulsado;
document.addEventListener("DOMContentLoaded", function () {
    contenedorGlobal = document.getElementById("contenedorGlobal");
    banearUsuario = document.getElementById("banearUsuario");
    papelera = document.getElementById("papeleraAdmin");
    tituloQueEs = document.getElementById("tituloQueEs");
    usuarios = document.getElementById("usuariosAdmin");
    grupos = document.getElementById("gruposAdmin");
    posts = document.getElementById("postsAdmin");
    comentarios = document.getElementById("comentariosAdmin");
    productos = document.getElementById("productosAdmin");
    contenido = document.getElementById("contenido");
    usuariosMasPapelera = document.getElementById("usuariosMasPapelera");

    // eventos a botones
    usuarios.addEventListener("click", mostrarUsuarios);
    grupos.addEventListener("click", mostrarGrupos);
    posts.addEventListener("click", mostrarPosts);
    comentarios.addEventListener("click", mostrarComentarios);
    productos.addEventListener("click", mostrarProductos);

    // funciones para arrastrar
    asignarEventosADragOver(contenedorGlobal);
    asignarEventosADragOver(banearUsuario);
    asignarEventosADragOver(papelera);

    darIdUsuario();
});

function cambiarBoton() {
    usuariosMasPapelera.hidden = true;
    usuarios.classList.remove("active");
    grupos.classList.remove("active");
    posts.classList.remove("active");
    comentarios.classList.remove("active");
    productos.classList.remove("active");
    spiner();
}

function spiner() {
    var spinnerDiv = document.createElement("div");
    spinnerDiv.className = "spinner-border mt-5";
    spinnerDiv.setAttribute("role", "status");

    var spinnerSpan = document.createElement("span");
    spinnerSpan.className = "visually-hidden";
    spinnerSpan.textContent = "Loading...";

    spinnerDiv.appendChild(spinnerSpan);

    var col = document.createElement("div");
    col.classList.add("col-12","d-flex","justify-content-center","align-items-center","mb-5");
    col.appendChild(spinnerDiv);
    
    contenido.appendChild(col);
}

// /////////////////////Usuarios/////////////////////

function darIdUsuario() {
    var usu = document.getElementsByClassName("cadaUsuario");
    for (var i = 0; i < usu.length; i++) {
        usu[i].setAttribute("draggable", "true");
        usu[i].addEventListener("dragstart", drag);
        usu[i].id = "usuario" + i;
    }
}

function asignarEventosADragOver(elemento) {
    elemento.addEventListener("dragover", allowDrop);
    elemento.addEventListener("drop", drop);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var elementoArrastrado = document.getElementById(data);
    var contenedorActual = elementoArrastrado.closest(
        ".conjunto, .papeleraAdmin"
    ); // contenedor actual
    var contenedorObjetivo = ev.target.closest(".conjunto, .papeleraAdmin"); //  contenedor objetivo

    var nomUsuario = elementoArrastrado.textContent.trim();
    // comprueva si va a un contenedor distinto del que viene
    if (contenedorObjetivo && contenedorActual !== contenedorObjetivo) {
        if (contenedorObjetivo.matches(".papeleraAdmin")) {
            Swal.fire({
                title: "¿Quieres eliminar la cuenta de " + nomUsuario + "?",
                icon: "question",
                showDenyButton: true,
                confirmButtonText: "Sí",
                denyButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    elementoArrastrado.remove();
                    eliminarUsuario(nomUsuario);
                }
            });
        } else {
            if (contenedorObjetivo.id == "contenedorGlobal") {
                Swal.fire({
                    title: "¿Quieres desbanear a " + nomUsuario + "?",
                    icon: "question",
                    showDenyButton: true,
                    confirmButtonText: "Sí",
                    denyButtonText: "Cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        contenedorObjetivo.appendChild(elementoArrastrado);
                        desBanearUsuario(nomUsuario);
                    }
                });
            } else if (contenedorObjetivo.id == "banearUsuario") {
                Swal.fire({
                    title: "¿Quieres banear a " + nomUsuario + "?",
                    icon: "question",
                    showDenyButton: true,
                    confirmButtonText: "Sí",
                    denyButtonText: "Cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        contenedorObjetivo.appendChild(elementoArrastrado);
                        banearUsuarioAjax(nomUsuario);
                    }
                });
            }
        }
    }
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// //banear
function banearUsuarioAjax(nomUsuario) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", gestionarBanearUsuario, true);
    xhr.open("POST", "/banearUsuario");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("usuario=" + nomUsuario);
}
// //banear
function gestionarBanearUsuario(evento) {
    if (evento.target.readyState == 4 && evento.target.status == 200) {
        Swal.fire({
            position: "top",
            icon: "success",
            showConfirmButton: false,
            timer: 800,
        });
    }
}

// //desbanear
function desBanearUsuario(nomUsuario) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", gestionarDesbanearUsuario, true);
    xhr.open("POST", "/desbanearUsuario");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("usuario=" + nomUsuario);
}
// //desbanear
function gestionarDesbanearUsuario(evento) {
    if (evento.target.readyState == 4 && evento.target.status == 200) {
        Swal.fire({
            position: "top",
            icon: "success",
            showConfirmButton: false,
            timer: 800,
        });
    }
}

// //eliminar
function eliminarUsuario(nomUsuario) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", gestionarEliminarUsuario, true);
    xhr.open("POST", "/eliminarUsuario");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("usuario=" + nomUsuario);
}
// //eliminar
function gestionarEliminarUsuario(evento) {
    if (evento.target.readyState == 4 && evento.target.status == 200) {
        Swal.fire({
            title: evento.target.responseText + " ha sido eliminado",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });
    }
}


function mostrarUsuarios() {
    cambiarBoton();
    usuariosMasPapelera.hidden = false;
    usuarios.classList.add("active");
    contenido.innerHTML = "";
}



// /////////////////////Usuarios/////////////////////

// //////////////////////Grupos//////////////////////
function mostrarGrupos() {
    contenido.innerHTML = "";
    cambiarBoton();
    grupos.classList.add("active");
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", respuestaMostrarGrupos, true);
    xhr.open("GET", "/mostrarGrupos");
    xhr.send();
}

function respuestaMostrarGrupos(evento) {
    if (evento.target.readyState == 4 && evento.target.status == 200) {
        contenido.innerHTML = "";
        objetoRespuesta = JSON.parse(evento.target.responseText);

        for (var i = 0; i < objetoRespuesta.length; i++) {
            (function () {
                var idGrupo = objetoRespuesta[i].id;

                var columna = document.createElement("div");
                columna.classList.add("col-lg-6");
                columna.classList.add("col-xxl-4");
                columna.classList.add("mb-5");
                columna.classList.add(
                    "d-flex",
                    "justify-content-center",
                    "align-items-center"
                );

                var cardDiv = document.createElement("div");
                cardDiv.classList.add("card");
                cardDiv.style.width = "18rem";

                var img = document.createElement("img");
                img.style.width = "17.9rem";
                img.style.height = "17.9rem";
                img.src = "../fotos/" + objetoRespuesta[i].foto_perfil;
                img.classList.add("card-img-top");

                var cardBodyDiv = document.createElement("div");
                cardBodyDiv.classList.add("card-body");

                var title = document.createElement("h5");
                title.classList.add("card-title");
                title.textContent = objetoRespuesta[i].nombre;

                var text = document.createElement("p");
                text.classList.add("card-text");
                if (objetoRespuesta[i].descripcion.length > 59) {
                    text.textContent =
                        objetoRespuesta[i].descripcion.substring(0, 53) + " ...";
                } else {
                    text.textContent = objetoRespuesta[i].descripcion;
                }

                var colBotonEntrar = document.createElement("div");
                colBotonEntrar.classList.add("col-4");

                var linkAlGrupo = document.createElement("a");
                linkAlGrupo.href = "/infoGrupo/" + objetoRespuesta[i].nombre;
                linkAlGrupo.classList.add("btn", "btn-outline-primary");
                linkAlGrupo.textContent = "Entrar";

                var colBotonSeguir = document.createElement("div");
                colBotonSeguir.classList.add("col-8", "d-flex", "justify-content-end");
                var btnSeguimiento = document.createElement("button");

                btnSeguimiento.classList.add("btn", "btn-outline-danger");
                btnSeguimiento.textContent = "Eliminar";
                btnSeguimiento.addEventListener("click", function () {
                    borrarGrupo(idGrupo);
                });

                var rowBotones = document.createElement("div");
                rowBotones.classList.add("row");

                cardBodyDiv.appendChild(title);
                cardBodyDiv.appendChild(text);
                cardBodyDiv.appendChild(rowBotones);
                rowBotones.appendChild(colBotonEntrar);
                rowBotones.appendChild(colBotonSeguir);

                colBotonSeguir.appendChild(btnSeguimiento);
                colBotonEntrar.appendChild(linkAlGrupo);

                cardDiv.appendChild(img);
                cardDiv.appendChild(cardBodyDiv);

                contenido.appendChild(columna);
                columna.appendChild(cardDiv);
            })();
        }
    }
}

function borrarGrupo(idGrupo) {
    Swal.fire({
        title: "¿Si confirma se eliminará el grupo y todos sus posts?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            xhr = new XMLHttpRequest();
            xhr.addEventListener(
                "readystatechange",
                gestionarRespuestaBorrarGrupo,
                true
            );
            xhr.open("GET", "/borrarGrupo/" + idGrupo);
            xhr.send();
        }
    });
}

function gestionarRespuestaBorrarGrupo(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        Swal.fire({
            title: "Se ha borrado el grupo",
            icon: "success",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
        }).then(() => {
            mostrarGrupos();
        });
    }
}
// //////////////////////Grupos//////////////////////

// //////////////////////Posts//////////////////////

function mostrarPosts() {
    contenido.innerHTML = "";
    cambiarBoton();
    posts.classList.add("active");
    //   esconderBaneadosYPapelera();
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", respuestaMostrarPosts, true);
    xhr.open("GET", "/mostrarPosts");
    xhr.send();
}

function respuestaMostrarPosts(evento) {
    if (evento.target.readyState == 4 && evento.target.status == 200) {
        contenido.innerHTML = "";

        objetoRespuesta = JSON.parse(evento.target.responseText);

        for (var i = 0; i < objetoRespuesta.length; i++) {
            (function () {
                var fila = document.createElement("div");
                fila.classList.add("row");

                var columna = document.createElement("div");
                columna.classList.add("col-12", "col-lg-8", "offset-0", "offset-lg-1");

                var cardDiv = document.createElement("div");
                cardDiv.classList.add("card", "mb-3", "w-100");

                var link = document.createElement("form");
                link.setAttribute("action", "/comentariosPorPost");
                link.setAttribute("method", "POST");

                var inputId = document.createElement("input");
                inputId.setAttribute("type", "text");
                inputId.setAttribute("name", "idPost");
                inputId.setAttribute("value", objetoRespuesta[i].id);
                inputId.setAttribute("hidden", true);
                link.appendChild(inputId);
                link.addEventListener("click", enviarForm);

                var filaContenido = document.createElement("div");
                filaContenido.classList.add("row", "g-0");

                var columnaImg = document.createElement("div");
                columnaImg.classList.add("col-lg-4");

                var img = document.createElement("img");
                img.classList.add(
                    "img-fluid",
                    "lg-rounded-start",
                    "w-100",
                    "h-auto",
                    "d-lg-block"
                );
                img.src = "../fotos/" + objetoRespuesta[i].foto;

                var divGrupo = document.createElement("div");
                divGrupo.classList.add("row", "mt-2", "mb-1");

                var colFotoGrupo = document.createElement("div");
                colFotoGrupo.classList.add(
                    "col-4",
                    "offset-1",
                    "d-flex",
                    "justify-content-end"
                );

                var colNombreGrupo = document.createElement("div");
                colNombreGrupo.classList.add("col-7", "d-flex", "align-items-center");

                var imgGrupo = document.createElement("img");
                imgGrupo.style.width = "50px";
                imgGrupo.style.height = "50px";
                imgGrupo.src = "../fotos/" + objetoRespuesta[i].fotoGrupo;

                var grupo = document.createElement("h6");
                grupo.classList.add("card-title", "mt-1");
                grupo.textContent = objetoRespuesta[i].nomGrupo;

                colFotoGrupo.appendChild(imgGrupo);
                colNombreGrupo.appendChild(grupo);
                divGrupo.appendChild(colFotoGrupo);
                divGrupo.appendChild(colNombreGrupo);

                columnaImg.appendChild(divGrupo);
                columnaImg.appendChild(img);

                var columnaInfo = document.createElement("div");
                columnaInfo.classList.add("col-lg-8");

                var cardBodyDiv = document.createElement("div");
                cardBodyDiv.classList.add("card-body");

                var filaTitulo = document.createElement("div");
                filaTitulo.classList.add("row", "align-items-center", "mb-3", "mt-2");

                var columnaFotoPerfil = document.createElement("div");
                columnaFotoPerfil.classList.add(
                    "col-2",
                    "offset-1",
                    "d-flex",
                    "justify-content-center"
                );

                var imgFotoPerfil = document.createElement("img");
                imgFotoPerfil.classList.add("rounded-circle");
                imgFotoPerfil.style.width = "50px";
                imgFotoPerfil.style.height = "50px";
                imgFotoPerfil.src = "../fotos/" + objetoRespuesta[i].fotoPerfilUsu;

                var columnaNombreUsuario = document.createElement("div");
                columnaNombreUsuario.classList.add("col-9");

                var title = document.createElement("h5");
                title.classList.add("card-title", "fs-5");
                title.textContent = "@" + objetoRespuesta[i].nomUsuario;

                columnaFotoPerfil.appendChild(imgFotoPerfil);
                columnaNombreUsuario.appendChild(title);

                filaTitulo.appendChild(columnaFotoPerfil);
                filaTitulo.appendChild(columnaNombreUsuario);

                var filaTexto = document.createElement("div");
                filaTexto.classList.add("row");

                var columnaTexto = document.createElement("div");
                columnaTexto.classList.add("col-lg-12");

                var textContenido = document.createElement("p");
                textContenido.classList.add("card-text");
                textContenido.textContent = objetoRespuesta[i].contenido;

                var rowInfo = document.createElement("div");
                rowInfo.classList.add("row");

                var colFecha = document.createElement("div");
                colFecha.classList.add("col-6", "d-flex", "justify-content-end");

                var textFecha = document.createElement("small");
                textFecha.classList.add("card-text", "text-muted");
                textFecha.textContent = objetoRespuesta[i].fechaHora;

                columnaTexto.appendChild(textContenido);
                colFecha.appendChild(textFecha);
                columnaTexto.appendChild(colFecha);

                filaTexto.appendChild(columnaTexto);

                cardBodyDiv.appendChild(filaTitulo);
                cardBodyDiv.appendChild(filaTexto);

                columnaInfo.appendChild(cardBodyDiv);

                filaContenido.appendChild(columnaImg);
                filaContenido.appendChild(columnaInfo);

                link.appendChild(filaContenido);
                cardDiv.appendChild(link);
                columna.appendChild(cardDiv);
                fila.appendChild(columna);

                var colEliminar = document.createElement("div");
                colEliminar.classList.add("col-12", "col-lg-2", "d-flex", "justify-content-center", "align-items-center", "mb-5", "mb-lg-0");

                var eliminar = document.createElement("button");

                eliminar.classList.add("btn", "btn-outline-danger");
                eliminar.textContent = "Eliminar";
                var idPost = objetoRespuesta[i].id;
                eliminar.addEventListener("click", function () {
                    eliminarPost(idPost);
                });

                colEliminar.appendChild(eliminar);
                fila.appendChild(colEliminar);

                contenido.appendChild(fila);
            })();
        }
    }
}

function enviarForm(event) {
    event.preventDefault();
    var formulario = event.currentTarget;
    formulario.submit();
}


function eliminarPost(idPost) {
    Swal.fire({
        title: "¿Quieres eliminar el post?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", eliminarPostRespuesta, true);
            xhr.open("POST", "/eliminarPost");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("post=" + idPost);
        }
    });
}

function eliminarPostRespuesta(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        Swal.fire({
            title: "El post ha sido eliminado",
            icon: "success",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
        });
        mostrarPosts();
    }
}

// //////////////////////Posts//////////////////////

// ///////////////////Comentarios///////////////////

function mostrarComentarios() {
    contenido.innerHTML = "";
    cambiarBoton();
    comentarios.classList.add("active");
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", respuestaMostrarComentarios, true);
    xhr.open("GET", "/mostrarComentarios");
    xhr.send();
}


function respuestaMostrarComentarios(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        contenido.innerHTML = "";

        var respuesta = JSON.parse(event.target.responseText);
        for (var i = 0; i < respuesta.length; i++) {
            (function () {
                var fotoPerfil = respuesta[i].fotoPerfil;
                var mensajeRes = respuesta[i].contenido;
                var nomUsuario = respuesta[i].nomUsuario;
                var fecha = respuesta[i].fechaActual;

                // Crear elementos
                var cardDiv = document.createElement("div");
                var cardHeader = document.createElement("h5");
                var rowDiv = document.createElement("div");
                var col8Div = document.createElement("div");
                var col4Div = document.createElement("div");
                var imgElement = document.createElement("img");
                var usernameSpan = document.createElement("span");
                var smallerElement = document.createElement("small");
                var cardBodyDiv = document.createElement("div");
                var cardTextP = document.createElement("p");

                // Asignar clases y atributos
                cardDiv.classList.add("card", "mb-2");
                cardHeader.classList.add("card-header");
                rowDiv.classList.add("row");
                col8Div.classList.add("col-8");
                col4Div.classList.add("col-4", "d-flex", "align-items-center");
                imgElement.style.borderRadius = "50px";
                imgElement.width = 35;
                imgElement.height = 35;
                imgElement.src = "../fotos/" + fotoPerfil;
                usernameSpan.textContent = " @" + nomUsuario;
                smallerElement.style.fontSize = "18px";
                smallerElement.classList.add("text-body-secondary");

                // Formatear la fecha y hora
                const date = new Date(fecha.date);

                var hours = String(date.getHours()).padStart(2, "0");
                var minutes = String(date.getMinutes()).padStart(2, "0");
                var seconds = String(date.getSeconds()).padStart(2, "0");
                var day = String(date.getDate()).padStart(2, "0");
                var month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses comienzan en 0
                var year = date.getFullYear();

                // Formatear la fecha como 'H:i:s d-m-Y'
                var fechaFormateada = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
                smallerElement.textContent = fechaFormateada;

                cardBodyDiv.classList.add("card-body");
                cardTextP.classList.add("card-text");
                cardTextP.textContent = mensajeRes;

                // Anidar elementos
                col8Div.appendChild(imgElement);
                col8Div.appendChild(usernameSpan);
                col4Div.appendChild(smallerElement);
                rowDiv.appendChild(col8Div);
                rowDiv.appendChild(col4Div);
                cardHeader.appendChild(rowDiv);
                cardBodyDiv.appendChild(cardTextP);
                cardDiv.appendChild(cardHeader);
                cardDiv.appendChild(cardBodyDiv);

                var row = document.createElement("div");
                row.className = "row";

                var colCarta = document.createElement("div");
                colCarta.classList.add("col-12", "col-lg-8", "offset-0", "offset-lg-1");

                var colBoton = document.createElement("div");
                colBoton.classList.add("col-12", "col-lg-2", "d-flex", "justify-content-center", "align-items-center", "mb-5", "mb-lg-0");

                var eliminar = document.createElement("button");

                eliminar.classList.add("btn", "btn-outline-danger");
                eliminar.textContent = "Eliminar";
                var idPost = respuesta[i].id;
                eliminar.addEventListener("click", function () {
                    eliminarComentario(idPost);
                });

                colCarta.appendChild(cardDiv);
                colBoton.appendChild(eliminar);

                row.appendChild(colCarta);
                row.appendChild(colBoton);

                contenido.appendChild(row);

            })();
        }
    }
}


function eliminarComentario(idComentario) {
    Swal.fire({
        title: "¿Quieres eliminar el comentario?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", eliminarPostRespuesta, true);
            xhr.open("POST", "/eliminarComentario");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("comentario=" + idComentario);
        }
    });
}

function eliminarPostRespuesta(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        Swal.fire({
            title: "El comentario ha sido eliminado",
            icon: "success",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
        });
        mostrarComentarios();
    }
}

// ///////////////////Comentarios///////////////////

// ////////////////////Productos////////////////////

function mostrarProductos() {
    contenido.innerHTML = "";
    cambiarBoton();
    productos.classList.add("active");
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", respuestaMostrarProductos, true);
    xhr.open("GET", "/mostrarProductos");
    xhr.send();
}


function respuestaMostrarProductos(evento) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        contenido.innerHTML = "";

        if (
            evento.target.responseText == null ||
            evento.target.responseText == "" ||
            evento.target.responseText == "{}"
        ) {
            contenido.innerHTML = "<p>No hay productos disponibles</p>";
        } else {
            objetoRespuesta = JSON.parse(evento.target.responseText);
            for (var i = 0; i < objetoRespuesta.length; i++) {
                (function () {
                    var columna = document.createElement("div");
                    columna.classList.add("col-lg-6");
                    columna.classList.add("col-xxl-4");
                    columna.classList.add("mb-5");
                    columna.classList.add(
                        "d-flex",
                        "justify-content-center",
                        "align-items-center"
                    );

                    var cardDiv = document.createElement("div");
                    cardDiv.classList.add("card");
                    cardDiv.style.width = "18rem";

                    var img = document.createElement("img");
                    img.style.width = "17.9rem";
                    img.style.height = "17.9rem";
                    img.src = "../fotos/" + objetoRespuesta[i].foto;
                    img.classList.add("card-img-top");

                    var cardBodyDiv = document.createElement("div");
                    cardBodyDiv.classList.add("card-body");

                    var title = document.createElement("h5");
                    title.classList.add("card-title");
                    title.textContent = objetoRespuesta[i].nombre;

                    var text = document.createElement("p");
                    text.classList.add("card-text");
                    text.textContent = objetoRespuesta[i].precio + "€";

                    cardBodyDiv.appendChild(title);
                    cardBodyDiv.appendChild(text);

                    cardDiv.appendChild(img);
                    cardDiv.appendChild(cardBodyDiv);

                    contenido.appendChild(columna);
                    columna.appendChild(cardDiv);

                    //row botones
                    var rowBotones = document.createElement("div");
                    rowBotones.classList.add("row");
                    cardBodyDiv.appendChild(rowBotones);

                    var colBotonEntrar = document.createElement("div");
                    colBotonEntrar.classList.add("col-8");
                    var link = document.createElement("a");
                    link.setAttribute("href", "/infoProducto/" + objetoRespuesta[i].id);
                    link.classList.add("btn", "btn-outline-primary");
                    link.textContent = "Ver producto";
                    rowBotones.appendChild(colBotonEntrar);
                    colBotonEntrar.appendChild(link);
                    var idProducto = objetoRespuesta[i].id;

                    //boton eliminar

                    var colBotonEliminar = document.createElement("div");
                    colBotonEliminar.classList.add(
                        "col-4",
                        "d-flex",
                        "justify-content-end"
                    );
                    var botonEliminar = document.createElement("button");
                    botonEliminar.classList.add("btn", "btn-outline-danger");
                    botonEliminar.textContent = "Eliminar";
                    botonEliminar.addEventListener("click", function () {
                        eliminarProducto(idProducto);
                    });
                    rowBotones.appendChild(colBotonEliminar);
                    colBotonEliminar.appendChild(botonEliminar);

                })();
            }
        }
    }
}

function eliminarProducto(idProducto) {
    Swal.fire({
        title: "¿Quieres eliminar este producto?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", eliminarProductoRespuesta, true);
            xhr.open("POST", "/eliminarProducto");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("producto=" + idProducto);
        }
    });
}

function eliminarProductoRespuesta(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        Swal.fire({
            title: "El producto ha sido eliminado",
            icon: "success",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
        });
        mostrarProductos();
    }
}

// ////////////////////Productos////////////////////
