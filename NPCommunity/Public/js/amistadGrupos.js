var xhr;
var idGrupo;
var nomGrupo;
var formularios;

////////////////////FUNCIONES PARA PODER HACER CLICK EN EL DIV DEL POST Y TE REDIRIJA A SU PÁGINA DE MOSTRAR COMENTARIO////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  formularios = document.getElementsByTagName("form");
  for (var i = 0; i < formularios.length; i++) {
    formularios[i].addEventListener("click", enviarForm);
  }

  if (document.getElementById("boton")) {
    boton = document.getElementById("boton");
    idGrupo = document.getElementById("idGrupo").value;
    nomGrupo = document.getElementById("nomGrupo").value;
    if (boton.value === "borrar") {
      boton.addEventListener("click", function () {
        borrarGrupoAmistad(idGrupo);
      });
    } else if (boton.value === "dejarDSeguir") {
      boton.addEventListener("click", dejarSeguir);
    } else if (boton.value === "seguir") {
      boton.addEventListener("click", seguir);
    }
  }
});

function dejarSeguir() {
  dejarDeSeguirAmistad(idGrupo);
}

function seguir() {
  seguirAmistad(idGrupo);
}

function enviarForm(event) {
  event.preventDefault();
  var formulario = event.currentTarget;
  formulario.submit();
}
////////////////////FUNCIONES PARA PODER HACER CLICK EN EL DIV DEL POST Y TE REDIRIJA A SU PÁGINA DE MOSTRAR COMENTARIO////////////////////////

function seguirAmistad(idGrupo) {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaSeguirAmistad, true);
  xhr.open("GET", "/seguir/" + idGrupo);
  xhr.send();
}
function dejarDeSeguirAmistad(idGrupo) {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", gestionarRespuestaDejarDeSeguirAmistad, true);
  xhr.open("GET", "/dejarDeSeguir/" + idGrupo);
  xhr.send();
}

function borrarGrupoAmistad(idGrupo) {
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
        gestionarRespuestaBorrarGrupoAmistad,
        true
      );
      xhr.open("GET", "/borrarGrupo/" + idGrupo);
      xhr.send();
    }
  });
}

function gestionarRespuestaSeguirAmistad(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Se ha seguido al grupo",
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      //window.location.href = "/infoGrupo/" + nomGrupo; BORRAR


      while (boton.classList.length > 0) {//eliminar todas las classes del boton
        boton.classList.remove(boton.classList.item(0));
      }
      boton.removeEventListener("click", seguir);
      boton.classList.add('btn', 'btn-outline-secondary');
      boton.innerHTML = "Dejar de seguir";
      boton.addEventListener("click", dejarSeguir);
    });
  }
}

function gestionarRespuestaDejarDeSeguirAmistad(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Se ha dejado de seguir al grupo",
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      //window.location.href = "/infoGrupo/" + nomGrupo; BORRAR

      while (boton.classList.length > 0) {//eliminar todas las classes del boton
        boton.classList.remove(boton.classList.item(0));
      }
      boton.removeEventListener("click", dejarSeguir);
      boton.classList.add('btn', 'btn-outline-info');
      boton.innerHTML = "Seguir";
      boton.addEventListener("click", seguir);
    });
  }
}

function gestionarRespuestaBorrarGrupoAmistad(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Se ha borrado el grupo",
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "/principal";
    });
  }
}

function volver() {
  window.location.href = "/principal";
}