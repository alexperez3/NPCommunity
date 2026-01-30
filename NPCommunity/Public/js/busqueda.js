var divRes;
var resBusqueda;
var usuario_busqueda;

var divNotificaciones;
var formularios;

document.addEventListener("DOMContentLoaded", function () {
  usuario_busqueda = document.getElementById("usuario_busqueda");
  usuario_busqueda.addEventListener("input", convertirAMinusculas);
  usuario_busqueda.addEventListener("input", enviarPeticionAjaxBusqueda);
  divRes = document.createElement("div");

  usuario_busqueda.insertAdjacentElement("afterend", divRes);

  divRes.style.position = "fixed";
  divRes.style.backgroundColor = "lightgrey";
  divRes.style.zIndex = 10;
  divRes.style.borderRadius = "8px";

  if (document.getElementById("navegacionNotificaciones")) {
    if (document.getElementById("divNotificaciones")) {
      cargarMensajes();
    }

    document.getElementById("notiMensajes").addEventListener("click", cargarMensajes);
    document.getElementById("notiSeguidores").addEventListener("click", cargarSeguidores);
    document.getElementById("notiRespuestas").addEventListener("click", cargarRespuestas);
    document.getElementById("notiPublicaciones").addEventListener("click", cargarPublicaciones);
    document.getElementById("notiProductos").addEventListener("click", cargarProductos);

    divNotificaciones = document.getElementById("divNotificaciones");
  }

});

//RESETEAR LA BUSQUEDA SI SE HACE CLICK EN CUALQUIER OTRA PARTE DEL DOCUMENTO.
document.addEventListener("click", function (evento) {
  if (
    !usuario_busqueda.contains(evento.target) &&
    !divRes.contains(evento.target)
  ) {
    resetearBusqueda();
  }
});

//FUNCIONES DE BUSQUEDA DE USUARIOS O GRUPOS
function convertirAMinusculas() {
  usuario_busqueda = document.getElementById("usuario_busqueda");
  usuario_busqueda.value = usuario_busqueda.value.toLowerCase();
}

function resetearBusqueda() {
  usuario_busqueda.value = "";
  divRes.innerHTML = "";
  divRes.style.display = "none";
  usuario_busqueda.removeEventListener("input", enviarPeticionAjaxBusqueda);
  usuario_busqueda.addEventListener("input", enviarPeticionAjaxBusqueda);
}

function enviarPeticionAjaxBusqueda() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaBusqueda, true);
  xhr.open("POST", "/busqueda");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("usuario_busqueda=" + usuario_busqueda.value);
}

function gestionarRespuestaBusqueda(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    if (usuario_busqueda.value == "") {
      divRes.innerHTML = "";
      divRes.style.display = "none";
      evento.target.removeEventListener("input", enviarPeticionAjaxBusqueda);
    } else if (evento.target.responseText == "") {
      divRes.innerHTML = "";
      divRes.innerHTML = "No se han encontrado coincidencias.";
    } else {
      resBusqueda = JSON.parse(evento.target.responseText);
      divRes.innerHTML = "";
      divRes.style.display = "";
      

      if (resBusqueda["usuarios"] == "") {
        divRes.innerHTML += "<strong>Usuarios:</strong><br>";
        divRes.innerHTML += "No se han encontrado usuarios. <br>";
      } else {
        divRes.innerHTML += "<strong>Usuarios:</strong><br>";

        for (var i = 0; i < resBusqueda["usuarios"].length; i++) {
          divRes.innerHTML +=
            '<li><a href="/perfilesBusqueda/' +
            resBusqueda["usuarios"][i] +
            '"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">' +
            '<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>' +
            "</svg>" +
            resBusqueda["usuarios"][i] +
            "</a></li>";
        }
        divRes.innerHTML += "<br>";
      }

      if (resBusqueda["grupos"] == "") {
        divRes.innerHTML += "<strong>Grupos:</strong><br>";
        divRes.innerHTML += "No se han encontrado grupos. <br>";
      } else {
        divRes.innerHTML += "<strong>Grupos:</strong><br>";

        for (var i = 0; i < resBusqueda["grupos"].length; i++) {
          divRes.innerHTML +=
            "<li><a href='/gruposBusqueda/" +
            resBusqueda["grupos"][i] +
            "'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-people-fill' viewBox='0 0 16 16'>" +
            "<path d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5'/>" +
            "</svg>" +
            resBusqueda["grupos"][i] +
            "</a></li>";
        }
        divRes.innerHTML += "<br>";
      }

      if (resBusqueda["productos"] == "") {
        divRes.innerHTML += "<strong>Productos:</strong><br>";
        divRes.innerHTML += "No se han encontrado productos. <br>";
      } else {
        divRes.innerHTML += "<strong>Productos:</strong><br>";

        for (var i = 0; i < resBusqueda["productos"].length; i++) {
          divRes.innerHTML +=
            '<li><a href="/infoProducto/' +
            resBusqueda["productos"][i]["id"] +
            '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-fill" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>' +
            "</svg>" +
            resBusqueda["productos"][i]["nombre"] +
            '</a><span style="color:grey; float:right">~ ' +
            resBusqueda["productos"][i]["nom_usuario"] +
            "</span></li>";
        }
        divRes.innerHTML += "<br>";
      }
    }
  }
}

function cargarMensajes() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarMensajes, true);
  xhr.open("POST", "/nuevosMensajes");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
}

function gestionarMensajes(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    notiMensajes.classList.add("active");
    notiSeguidores.classList.remove("active");
    notiRespuestas.classList.remove("active");
    notiPublicaciones.classList.remove("active");
    notiProductos.classList.remove("active");

    if (evento.target.responseText == "null") {
      divNotificaciones.innerHTML = "";

      var fila = document.createElement("div");
      fila.classList.add("row");

      var divAlerta = document.createElement("div");
      divAlerta.classList.add("alert");
      divAlerta.classList.add("alert-danger");
      divAlerta.innerHTML = "No tienes nuevos mensajes.";

      fila.appendChild(divAlerta);
      divNotificaciones.appendChild(fila);

    } else {
      divNotificaciones.innerHTML = "";
      objetoRespuesta = JSON.parse(evento.target.responseText);

      for(var i = 0; i < objetoRespuesta.length; i++) {
        var fila = document.createElement("div");
        fila.classList.add("row");

        var cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.classList.add("w-75");

        var enlace = document.createElement("a");
        enlace.setAttribute("href", "/chat/"+objetoRespuesta[i].nom_usu_emisor);
        enlace.classList.add("quitarEnlace");

        var divTitulo = document.createElement("div");
        divTitulo.classList.add("row");
        divTitulo.classList.add("card-header");

        var titulo = document.createElement("h5");
        titulo.innerHTML = "Tienes un mensaje nuevo!";

        var cardBody = document.createElement("div");
        cardBody.classList.add("row");
        cardBody.classList.add("card-body");

        var columnaImg = document.createElement("div");
        columnaImg.classList.add("col-3");

        var img = document.createElement("img");
        img.style.width = "100px";
        img.style.height = "100px";
        img.src = "fotos/"+objetoRespuesta[i].foto_perfil_emisor;
        img.classList.add("rounded-circle");

        var columnaInfo = document.createElement("div");
        columnaInfo.classList.add("col-9");

        var bloque = document.createElement("blockquote");
        bloque.classList.add("blockquote");
        bloque.classList.add("mb-0");

        var parrafo = document.createElement("p");
        parrafo.innerHTML = "@"+objetoRespuesta[i].nom_usu_emisor+ " te ha enviado un mensaje nuevo!";

        var footer = document.createElement("footer");
        footer.classList.add("blockquote-footer");
        footer.innerHTML = objetoRespuesta[i].fecha_hora;

        enlace.appendChild(divTitulo);
        enlace.appendChild(cardBody);

        divTitulo.appendChild(titulo);

        cardBody.appendChild(columnaImg);
        cardBody.appendChild(columnaInfo);

        columnaImg.appendChild(img);
        columnaInfo.appendChild(bloque);

        bloque.appendChild(parrafo);
        bloque.appendChild(footer);

        cardDiv.appendChild(enlace);
        fila.appendChild(cardDiv);
        divNotificaciones.appendChild(fila);
        divNotificaciones.innerHTML += "<br>";
      }
    }
  }
}

function cargarSeguidores() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarSeguidores, true);
  xhr.open("POST", "/nuevosSeguidores");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
}

function gestionarSeguidores(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    notiMensajes.classList.remove("active");
    notiSeguidores.classList.add("active");
    notiRespuestas.classList.remove("active");
    notiPublicaciones.classList.remove("active");
    notiProductos.classList.remove("active")
    
    if (evento.target.responseText == null) {
      divNotificaciones.innerHTML = "";

      var fila = document.createElement("div");
      fila.classList.add("row");

      var divAlerta = document.createElement("div");
      divAlerta.classList.add("alert");
      divAlerta.classList.add("alert-danger");
      divAlerta.innerHTML = "No tienes nuevos seguidores.";

      divNotificaciones.appendChild(fila);
      fila.appendChild(divAlerta);

    } else {
      divNotificaciones.innerHTML = "";
      objetoRespuesta = JSON.parse(evento.target.responseText);

      for(var i = 0; i < objetoRespuesta.length; i++) {
        var fila = document.createElement("div");
        fila.classList.add("row");

        var cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.classList.add("w-75");

        var enlace = document.createElement("a");
        enlace.setAttribute("href", "/perfilUsuario/"+objetoRespuesta[i].nom_usu_seguidor);
        enlace.classList.add("quitarEnlace");

        var divTitulo = document.createElement("div");
        divTitulo.classList.add("row");
        divTitulo.classList.add("card-header");

        var titulo = document.createElement("h5");
        titulo.innerHTML = "Tienes un nuevo seguidor!";

        var cardBody = document.createElement("div");
        cardBody.classList.add("row");
        cardBody.classList.add("card-body");

        var columnaImg = document.createElement("div");
        columnaImg.classList.add("col-3");

        var img = document.createElement("img");
        img.style.width = "100px";
        img.style.height = "100px";
        img.src = "fotos/"+objetoRespuesta[i].foto_perfil_seguidor;
        img.classList.add("rounded-circle");

        var columnaInfo = document.createElement("div");
        columnaInfo.classList.add("col-9");

        var bloque = document.createElement("blockquote");
        bloque.classList.add("blockquote");
        bloque.classList.add("mb-0");

        var parrafo = document.createElement("p");
        parrafo.innerHTML = "@"+objetoRespuesta[i].nom_usu_seguidor +" ahora forma parte de tu comunidad: "+objetoRespuesta[i].nom_grupo_seguido;

        var footer = document.createElement("footer");
        footer.classList.add("blockquote-footer");
        footer.innerHTML = objetoRespuesta[i].fecha_hora;

        enlace.appendChild(divTitulo);
        enlace.appendChild(cardBody);

        divTitulo.appendChild(titulo);

        cardBody.appendChild(columnaImg);
        cardBody.appendChild(columnaInfo);

        columnaImg.appendChild(img);
        columnaInfo.appendChild(bloque);

        bloque.appendChild(parrafo);
        bloque.appendChild(footer);

        cardDiv.appendChild(enlace);
        fila.appendChild(cardDiv);
        divNotificaciones.appendChild(fila);
        divNotificaciones.innerHTML += "<br>";
      }
    }
  }
}

function cargarRespuestas() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestas, true);
  xhr.open("POST", "/nuevasRespuestas");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
}

function gestionarRespuestas(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    notiMensajes.classList.remove("active");
    notiSeguidores.classList.remove("active");
    notiRespuestas.classList.add("active");
    notiPublicaciones.classList.remove("active");
    notiProductos.classList.remove("active")

    if (evento.target.responseText == null) {
      divNotificaciones.innerHTML = "";

      var fila = document.createElement("div");
      fila.classList.add("row");

      var divAlerta = document.createElement("div");
      divAlerta.classList.add("alert");
      divAlerta.classList.add("alert-danger");
      divAlerta.innerHTML = "No tienes nuevas respuestas.";

      divNotificaciones.appendChild(fila);
      fila.appendChild(divAlerta);

    } else {
      divNotificaciones.innerHTML = "";
      objetoRespuesta = JSON.parse(evento.target.responseText);

      for(var i = 0; i < objetoRespuesta.length; i++) {
        var fila = document.createElement("div");
        fila.classList.add("row");

        var cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.classList.add("w-75");

        var formulario = document.createElement("form");
        formulario.setAttribute("method", "POST");
        formulario.setAttribute("action", "/comentariosPorPost");

        var inputIdPost = document.createElement("input");
        inputIdPost.setAttribute("style", "display:none");
        inputIdPost.setAttribute("name", "idPost");
        inputIdPost.setAttribute("value", objetoRespuesta[i].id_post_comentado);

        var divTitulo = document.createElement("div");
        divTitulo.classList.add("row");
        divTitulo.classList.add("card-header");

        var titulo = document.createElement("h5");
        titulo.innerHTML = "Tienes un nuevo comentario en tu post!";

        var cardBody = document.createElement("div");
        cardBody.classList.add("row");
        cardBody.classList.add("card-body");

        var columnaImg = document.createElement("div");
        columnaImg.classList.add("col-3");

        var img = document.createElement("img");
        img.style.width = "100px";
        img.style.height = "100px";
        img.src = "fotos/"+objetoRespuesta[i].foto_perfil_comentador;
        img.classList.add("rounded-circle");

        var columnaInfo = document.createElement("div");
        columnaInfo.classList.add("col-9");

        var bloque = document.createElement("blockquote");
        bloque.classList.add("blockquote");
        bloque.classList.add("mb-0");

        var parrafo = document.createElement("p");
        parrafo.innerHTML += "@"+objetoRespuesta[i].nom_usu_comentador +" ha comentado en tu post del grupo: "+objetoRespuesta[i].nom_grupo_post_comentado;

        var footer = document.createElement("footer");
        footer.classList.add("blockquote-footer");
        footer.innerHTML = objetoRespuesta[i].fecha_hora;

        formulario.appendChild(divTitulo);
        formulario.appendChild(inputIdPost);
        formulario.appendChild(cardBody);

        divTitulo.appendChild(titulo);

        cardBody.appendChild(columnaImg);
        cardBody.appendChild(columnaInfo);

        columnaImg.appendChild(img);
        columnaInfo.appendChild(bloque);

        bloque.appendChild(parrafo);
        bloque.appendChild(footer);

        cardDiv.appendChild(formulario);
        fila.appendChild(cardDiv);
        divNotificaciones.appendChild(fila);
        divNotificaciones.innerHTML += "<br>";
      }

      formularios = document.getElementsByTagName("form");
      for (var i = 0; i < formularios.length; i++) {
        formularios[i].addEventListener("click", enviarForm);
      }
    }
  }
}

function enviarForm(event) {
  event.preventDefault();
  var formulario = event.currentTarget;
  formulario.submit();
}

function cargarPublicaciones() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarPublicaciones, true);
  xhr.open("POST", "/nuevasPublicaciones");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
}

function gestionarPublicaciones(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    notiMensajes.classList.remove("active");
    notiSeguidores.classList.remove("active");
    notiRespuestas.classList.remove("active");
    notiPublicaciones.classList.add("active");
    notiProductos.classList.remove("active")

    if (evento.target.responseText == null) {
      divNotificaciones.innerHTML = "";

      var fila = document.createElement("div");
      fila.classList.add("row");

      var divAlerta = document.createElement("div");
      divAlerta.classList.add("alert");
      divAlerta.classList.add("alert-danger");
      divAlerta.innerHTML = "No tienes nuevas publicaciones en tus grupos.";

      divNotificaciones.appendChild(fila);
      fila.appendChild(divAlerta);

    } else {
      divNotificaciones.innerHTML = "";
      objetoRespuesta = JSON.parse(evento.target.responseText);

      for(var i = 0; i < objetoRespuesta.length; i++) {
        var fila = document.createElement("div");
        fila.classList.add("row");

        var cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.classList.add("w-75");

        var enlace = document.createElement("a");
        enlace.setAttribute("href", "/infoGrupo/"+objetoRespuesta[i].nom_grupo_post_publicado);
        enlace.classList.add("quitarEnlace");

        var divTitulo = document.createElement("div");
        divTitulo.classList.add("row");
        divTitulo.classList.add("card-header");

        var titulo = document.createElement("h5");
        titulo.innerHTML = "Tienes un nuevo post en tu grupo!";

        var cardBody = document.createElement("div");
        cardBody.classList.add("row");
        cardBody.classList.add("card-body");

        var columnaImg = document.createElement("div");
        columnaImg.classList.add("col-3");

        var img = document.createElement("img");
        img.style.width = "100px";
        img.style.height = "100px";
        img.src = "fotos/"+objetoRespuesta[i].foto_perfil_publicador;
        img.classList.add("rounded-circle");

        var columnaInfo = document.createElement("div");
        columnaInfo.classList.add("col-9");

        var bloque = document.createElement("blockquote");
        bloque.classList.add("blockquote");
        bloque.classList.add("mb-0");

        var parrafo = document.createElement("p");
        parrafo.innerHTML += "@"+objetoRespuesta[i].nom_usu_publicador +" ha publicado un nuevo post en tu grupo: "+objetoRespuesta[i].nom_grupo_post_publicado;

        var footer = document.createElement("footer");
        footer.classList.add("blockquote-footer");
        footer.innerHTML = objetoRespuesta[i].fecha_hora;

        enlace.appendChild(divTitulo);
        enlace.appendChild(cardBody);

        divTitulo.appendChild(titulo);

        cardBody.appendChild(columnaImg);
        cardBody.appendChild(columnaInfo);

        columnaImg.appendChild(img);
        columnaInfo.appendChild(bloque);

        bloque.appendChild(parrafo);
        bloque.appendChild(footer);

        cardDiv.appendChild(enlace);
        fila.appendChild(cardDiv);
        divNotificaciones.appendChild(fila);
        divNotificaciones.innerHTML += "<br>";
      }
    }
  }
}

function cargarProductos() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarPublicaciones, true);
  xhr.open("POST", "/nuevosProductos");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
}

// function gestionarPublicaciones(evento) {
//   if (evento.target.readyState == 4 && evento.target.status == 200) {
//     notiMensajes.classList.remove("active");
//     notiSeguidores.classList.remove("active");
//     notiRespuestas.classList.remove("active");
//     notiPublicaciones.classList.add("active");
//     notiProductos.classList.remove("active")

//     if (evento.target.responseText == null) {
//       divNotificaciones.innerHTML = "";

//       var fila = document.createElement("div");
//       fila.classList.add("row");

//       var divAlerta = document.createElement("div");
//       divAlerta.classList.add("alert");
//       divAlerta.classList.add("alert-danger");
//       divAlerta.innerHTML = "No tienes nuevas publicaciones en tus grupos.";

//       divNotificaciones.appendChild(fila);
//       fila.appendChild(divAlerta);

//     } else {
//       divNotificaciones.innerHTML = "";
//       objetoRespuesta = JSON.parse(evento.target.responseText);

//       for(var i = 0; i < objetoRespuesta.length; i++) {
//         var fila = document.createElement("div");
//         fila.classList.add("row");

//         var cardDiv = document.createElement("div");
//         cardDiv.classList.add("card");
//         cardDiv.classList.add("w-75");

//         var enlace = document.createElement("a");
//         enlace.setAttribute("href", "/infoGrupo/"+objetoRespuesta[i].nom_grupo_post_publicado);
//         enlace.classList.add("quitarEnlace");

//         var divTitulo = document.createElement("div");
//         divTitulo.classList.add("row");
//         divTitulo.classList.add("card-header");

//         var titulo = document.createElement("h5");
//         titulo.innerHTML = "Tienes un nuevo post en tu grupo!";

//         var cardBody = document.createElement("div");
//         cardBody.classList.add("row");
//         cardBody.classList.add("card-body");

//         var columnaImg = document.createElement("div");
//         columnaImg.classList.add("col-3");

//         var img = document.createElement("img");
//         img.style.width = "100px";
//         img.style.height = "100px";
//         img.src = "fotos/"+objetoRespuesta[i].foto_perfil_publicador;
//         img.classList.add("rounded-circle");

//         var columnaInfo = document.createElement("div");
//         columnaInfo.classList.add("col-9");

//         var bloque = document.createElement("blockquote");
//         bloque.classList.add("blockquote");
//         bloque.classList.add("mb-0");

//         var parrafo = document.createElement("p");
//         parrafo.innerHTML += "@"+objetoRespuesta[i].nom_usu_publicador +" ha publicado un nuevo post en tu grupo: "+objetoRespuesta[i].nom_grupo_post_publicado;

//         var footer = document.createElement("footer");
//         footer.classList.add("blockquote-footer");
//         footer.innerHTML = objetoRespuesta[i].fecha_hora;

//         enlace.appendChild(divTitulo);
//         enlace.appendChild(cardBody);

//         divTitulo.appendChild(titulo);

//         cardBody.appendChild(columnaImg);
//         cardBody.appendChild(columnaInfo);

//         columnaImg.appendChild(img);
//         columnaInfo.appendChild(bloque);

//         bloque.appendChild(parrafo);
//         bloque.appendChild(footer);

//         cardDiv.appendChild(enlace);
//         fila.appendChild(cardDiv);
//         divNotificaciones.appendChild(fila);
//         divNotificaciones.innerHTML += "<br>";
//       }
//     }
//   }
// }