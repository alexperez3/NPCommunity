var botonMisPosts;
var botonMisGrupos;
var botonMisProductos;
var rowContenidoPerfil;
document.addEventListener("DOMContentLoaded", function () {
  rowContenidoPerfil = document.getElementById("contenidoPerfil");
  botonMisPosts = document.getElementById("mostrarMisPosts");
  botonMisGrupos = document.getElementById("mostrarMisGrupos");
  botonMisProductos = document.getElementById("mostrarMisProductos");

  botonMisPosts.addEventListener("click", mostrarMisPosts);
  botonMisGrupos.addEventListener("click", mostrarMisGrupos);
  botonMisProductos.addEventListener("click", mostrarMisProductos);

  mostrarMisPosts();
});

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

  rowContenidoPerfil.appendChild(col);
}

function mostrarMisGrupos() {
  botonMisGrupos.classList.add("active");
  botonMisPosts.classList.remove("active");
  botonMisProductos.classList.remove("active");
  rowContenidoPerfil.innerHTML = "";
  spiner();
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaMisGrupos, true);
  xhr.open("GET", "/misGrupos");
  xhr.send();
}

function gestionarRespuestaMisGrupos(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    rowContenidoPerfil.innerHTML = "";

    objetoRespuesta = JSON.parse(evento.target.responseText);
    if (objetoRespuesta.length > 0) {
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
          colBotonEntrar.classList.add("col-5");
          var linkAlGrupo = document.createElement("a");
          linkAlGrupo.href = "/infoGrupo/" + objetoRespuesta[i].nombre;
          linkAlGrupo.classList.add("btn", "btn-outline-primary");
          linkAlGrupo.textContent = "Entrar";

          var colBotonSeguir = document.createElement("div");
          colBotonSeguir.classList.add(
            "col-7",
            "d-flex",
            "justify-content-end"
          );
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

          rowContenidoPerfil.appendChild(columna);
          columna.appendChild(cardDiv);
        })();
      }
    } else {
      var columna = document.createElement("div");
      columna.classList.add(
        "col-12",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-3"
      );
      columna.innerHTML =
        "<h1 style='text-aling:center'>Crea tu primer grupo</h1>";
      rowContenidoPerfil.appendChild(columna);

      var columna2 = document.createElement("div");
      columna2.classList.add(
        "col-12",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-2"
      );

      var boton = document.createElement("a");
      boton.innerHTML = "Crear grupo";
      boton.classList.add("btn", "btn-outline-primary");
      boton.href = "http://localhost:8000/crearGrupo";
      rowContenidoPerfil.appendChild(columna2);
      columna2.appendChild(boton);
    }
  }
}

function mostrarMisProductos() {
  botonMisProductos.classList.add("active");
  botonMisPosts.classList.remove("active");
  botonMisGrupos.classList.remove("active");
  rowContenidoPerfil.innerHTML = "";
  spiner();
  xhr = new XMLHttpRequest();
  xhr.addEventListener(
    "readystatechange",
    gestionarRespuestaMisProductos,
    true
  );
  xhr.open("GET", "/misProductos");
  xhr.send();
}

function gestionarRespuestaMisProductos(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    rowContenidoPerfil.innerHTML = "";
    objetoRespuesta = JSON.parse(evento.target.responseText);
    if (objetoRespuesta.length > 0) {
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

          rowContenidoPerfil.appendChild(columna);
          columna.appendChild(cardDiv);

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
            borrarProducto(idProducto);
          });
          rowBotones.appendChild(colBotonEliminar);
          colBotonEliminar.appendChild(botonEliminar);
        })();
      }
    } else {
      var columna = document.createElement("div");
      columna.classList.add(
        "col-12",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-3"
      );
      columna.innerHTML =
        "<h1 style='text-aling:center'>Publica tu primer producto</h1>";
      rowContenidoPerfil.appendChild(columna);

      var columna2 = document.createElement("div");
      columna2.classList.add(
        "col-12",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-2"
      );

      var boton = document.createElement("a");
      boton.innerHTML = "Nuevo producto";
      boton.classList.add("btn", "btn-outline-primary");
      boton.href = "http://localhost:8000/crearProducto";
      rowContenidoPerfil.appendChild(columna2);
      columna2.appendChild(boton);
    }
  }
}

function mostrarMisPosts() {
  botonMisGrupos.classList.remove("active");
  botonMisProductos.classList.remove("active");
  botonMisPosts.classList.add("active");
  rowContenidoPerfil.innerHTML = "";
  spiner();
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaMisPosts, true);
  xhr.open("GET", "/misPosts");
  xhr.send();
}

function gestionarRespuestaMisPosts(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    rowContenidoPerfil.innerHTML = "";
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

        rowContenidoPerfil.appendChild(fila);
      }
    } else {
      var columna = document.createElement("div");
      columna.classList.add(
        "col-12",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-3"
      );
      columna.innerHTML =
        "<h1 style='text-aling:center'>Publica tu primer post</h1>";
      rowContenidoPerfil.appendChild(columna);

      var columna2 = document.createElement("div");
      columna2.classList.add(
        "col-12",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "mt-2"
      );

      var boton = document.createElement("a");
      boton.innerHTML = "Nuevo post";
      boton.classList.add("btn", "btn-outline-primary");
      boton.href = "http://localhost:8000/crearPost";
      rowContenidoPerfil.appendChild(columna2);
      columna2.appendChild(boton);
    }
  }
}

function enviarForm(event) {
  event.preventDefault();
  var formulario = event.currentTarget;
  formulario.submit();
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
      mostrarMisGrupos();
    });
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
      mostrarMisProductos();
    });
  }
}
