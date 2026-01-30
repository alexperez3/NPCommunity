var xhr;
var objetoRespuesta;
var divContenido;
var elemento;
var enlace;

var inputId;

var divPost;
var formPost;
var inputIdPost;

var idGrupo;

window.onload = inicializar;

//SETTEAR LAS FUNCIONES A LOS ELEMENTOS DE LA PRINCIPAL
function inicializar() {
  divContenido = document.getElementById("contenido");
  if (document.getElementById("grupos")) {
    document
      .getElementById("grupos")
      .addEventListener("click", enviarPeticionAjaxGrupos);
  }
  if (document.getElementById("tienda")) {
    document
      .getElementById("tienda")
      .addEventListener("click", enviarPeticionAjaxTienda);
  }
  if (document.getElementById("posts")) {
    document
      .getElementById("posts")
      .addEventListener("click", enviarPeticionAjaxPosts);
  }
  enviarPeticionAjaxGrupos();
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
  col.classList.add("col-12", "d-flex", "justify-content-center", "align-items-center", "mb-5");
  col.appendChild(spinnerDiv);

  divContenido.appendChild(col);
}


//CREAR LISTA DE LOS GRUPOS
function enviarPeticionAjaxGrupos() {
  document.getElementById("grupos").classList.add("active");
  document.getElementById("tienda").classList.remove("active");
  if (document.getElementById("posts")) {
    document.getElementById("posts").classList.remove("active");
  }
  divContenido.innerHTML = "";
  spiner();
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaGrupos, true);
  xhr.open("GET", "/listarGrupos");
  xhr.send();
}

function gestionarRespuestaGrupos(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    objetoRespuesta = JSON.parse(evento.target.responseText);
    divContenido.innerHTML = "";

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
        if (objetoRespuesta[i].leSigue == "0") {
          btnSeguimiento.textContent = "Seguir";
          btnSeguimiento.classList.add("btn", "btn-outline-info");
          btnSeguimiento.addEventListener("click", function () {
            seguir(idGrupo);
          });
        } else if (objetoRespuesta[i].leSigue == "1") {
          btnSeguimiento.classList.add("btn", "btn-outline-secondary");
          btnSeguimiento.textContent = "Dejar de seguir";
          btnSeguimiento.addEventListener("click", function () {
            dejarDeSeguir(idGrupo);
          });
        } else if (objetoRespuesta[i].leSigue == "2") {
          btnSeguimiento.classList.add("btn", "btn-outline-danger");
          btnSeguimiento.textContent = "Eliminar";
          btnSeguimiento.addEventListener("click", function () {
            borrarGrupo(idGrupo);
          });
        }

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

        divContenido.appendChild(columna);
        columna.appendChild(cardDiv);
      })();
    }
  }
}

function seguir(idGrupo) {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaSeguir, true);
  xhr.open("GET", "/seguir/" + idGrupo);
  xhr.send();
}

function dejarDeSeguir(idGrupo) {
  xhr = new XMLHttpRequest();
  xhr.addEventListener(
    "readystatechange",
    gestionarRespuestaDejarDeSeguir,
    true
  );
  xhr.open("GET", "/dejarDeSeguir/" + idGrupo);
  xhr.send();
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

function gestionarRespuestaSeguir(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    if (event.target.responseText) {
      Swal.fire({
        title: "Se ha seguido al grupo",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        enviarPeticionAjaxGrupos();
      });
    } else {
      window.location.href = "/login";
    }
  }
}

function gestionarRespuestaDejarDeSeguir(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Se ha dejado de seguir al grupo",
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      enviarPeticionAjaxGrupos();
    });
  }
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
      enviarPeticionAjaxGrupos();
    });
  }
}

// //CREAR LISTA DE LOS POSTS DE LA GENTE QUE SIGUE
function enviarPeticionAjaxPosts() {
  document.getElementById("posts").classList.add("active");
  document.getElementById("grupos").classList.remove("active");
  document.getElementById("tienda").classList.remove("active");
  divContenido.innerHTML = "";
  spiner();
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaPosts, true);
  xhr.open("GET", "/listarPosts");
  xhr.send();
}

function gestionarRespuestaPosts(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {

    divContenido.innerHTML = "";
    objetoRespuesta = JSON.parse(evento.target.responseText);

    if (objetoRespuesta.length > 0) {

      for (var i = 0; i < objetoRespuesta.length; i++) {
        var fila = document.createElement("div");
        fila.classList.add("row");

        var columna = document.createElement("div");
        columna.classList.add("col-10", "col-md-8", "offset-2");

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

        var colFecha = document.createElement("div");
        colFecha.classList.add("col-lg-12", "d-flex", "justify-content-end");

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

        divContenido.appendChild(fila);
      }
    }
    else {
      var columna = document.createElement("div");
      columna.classList.add(
        "col-12",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-3"
      );
      columna.innerHTML =
        "<h1 style='text-aling:center'>Nadie ha publicado un post en los ultimos 5 días</h1>";
      divContenido.appendChild(columna);

      var columna2 = document.createElement("div");
      columna2.classList.add(
        "col-12",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-2"
      );

      var boton = document.createElement("a");
      boton.innerHTML = "Crea un post";
      boton.classList.add("btn", "btn-outline-primary");
      boton.href = "http://localhost:8000/crearPost";
      divContenido.appendChild(columna2);
      columna2.appendChild(boton);
    }
  }
}

function enviarForm(event) {
  event.preventDefault();
  var formulario = event.currentTarget;
  formulario.submit();
}

//CREAR LISTA DE LOS PRODUCTOS

function enviarPeticionAjaxTienda() {
  document.getElementById("grupos").classList.remove("active");
  document.getElementById("tienda").classList.add("active");
  if (document.getElementById("posts")) {
    document.getElementById("posts").classList.remove("active");
  }
  divContenido.innerHTML = "";
  spiner();
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaTienda, true);
  xhr.open("GET", "/listarProductos");
  xhr.send();
}

function gestionarRespuestaTienda(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    divContenido.innerHTML = "";

    if (
      evento.target.responseText == null ||
      evento.target.responseText == "" ||
      evento.target.responseText == "{}"
    ) {
      divContenido.innerHTML = "<p>No hay productos disponibles</p>";
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

          divContenido.appendChild(columna);
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
          if (objetoRespuesta[i].mio == 1) {
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
              borrarProducto(idProducto);
            });
            rowBotones.appendChild(colBotonEliminar);
            colBotonEliminar.appendChild(botonEliminar);
          }
        })();
      }
    }
  }
}

function borrarProducto(idProducto) {
  Swal.fire({
    title: "¿Si confirma se eliminará el producto de la tienda?",
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Confirmar",
    denyButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      xhr = new XMLHttpRequest();
      xhr.addEventListener(
        "readystatechange",
        gestionarRespuestaBorrarProducto,
        true
      );
      xhr.open("GET", "/borrarProducto/" + idProducto);
      xhr.send();
    }
  });
}

function gestionarRespuestaBorrarProducto(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Se ha borrado el producto",
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      enviarPeticionAjaxTienda();
    });
  }
}
