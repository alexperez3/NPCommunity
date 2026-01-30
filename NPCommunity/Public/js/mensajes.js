var boton;
var texto;
var receptor;
var conversacion;
var colConversacion;
var colConversacionNueva;
var col;

document.addEventListener("DOMContentLoaded", function () {
  texto = document.getElementById("texto");
  receptor = document.getElementById("receptor");
  if (document.getElementById("colConversacion")) {
    colConversacion = document.getElementById("colConversacion");
  } else {
    colConversacionNueva = document.getElementById("conversacion");
    col = document.createElement("div");
    col.classList.add("col-12");
    colConversacionNueva.appendChild(col);
  }
  if (document.getElementById("conversacion")) {
    conversacion = document.getElementById("conversacion");
    conversacion.scrollTop = conversacion.scrollHeight;
  }

  if (document.getElementById("boton")) {
    boton = document.getElementById("boton");
    boton.addEventListener("click", enviarMensaje);
  }
});

function enviarMensaje() {
  if (texto.value.trim() === "") {
    Swal.fire({
      title: "No puedes enviar un mensaje vacío",
      icon: "error",
      timer: 1800,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } else {
    xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", enviarMensajeRespuesta, true);
    xhr.open("POST", "/enviarMensaje");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("texto=" + texto.value + "&receptor=" + receptor.innerHTML);
  }
}

function enviarMensajeRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    if (document.getElementById("nuevaConver")) {
      document.getElementById("nuevaConver").remove();
    }
    var respuesta = event.target.responseText.split("-");
    mostrarMensaje(respuesta[0], respuesta[1]);
    conversacion.scrollTop = conversacion.scrollHeight;
    Swal.fire({
      position: "top",
      icon: "success",
      showConfirmButton: false,
      timer: 700,
    });
    texto.value = "";
  }
}

function mostrarMensaje(mensaje, foto) {
  var row = document.createElement("div");
  row.setAttribute("class", "row mb-2");
  if (colConversacion) {
    colConversacion.appendChild(row);
  } else {
    col.appendChild(row);

  }

  var colMensaje = document.createElement("div");
  colMensaje.classList.add("col-6", "col-lg-7", "offset-4");
  colMensaje.style.border = "1px dashed black";
  colMensaje.style.borderRadius = "12px";
  colMensaje.innerHTML = mensaje;
  row.appendChild(colMensaje);

  var colFoto = document.createElement("div");
  colFoto.classList.add("col-2", "col-lg-1");
  row.appendChild(colFoto);

  var nuevaFoto = document.createElement("img");
  nuevaFoto.setAttribute("src", "../fotos/" + foto);
  nuevaFoto.style.width = "40px";
  nuevaFoto.style.height = "40px";
  nuevaFoto.style.borderRadius = "50%";
  colFoto.appendChild(nuevaFoto);
}

function volverMensajes() {
  window.location.href = "/mensajes";
}

function volverPrincipal() {
  window.location.href = "/principal";
}