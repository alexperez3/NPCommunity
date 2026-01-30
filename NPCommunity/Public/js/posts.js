var botonComentar;
var inputComentar;

document.addEventListener("DOMContentLoaded", function () {
  botonComentar = document.getElementById("botonComentar");
  inputComentar = document.getElementById("inputComentar");
  idPost = document.getElementById("idPost");
});

function enviarComentario() {
  if (inputComentar.value.trim() !== "") {
    xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", enviarMensajeRespuesta, true);
    xhr.open("POST", "/publicar_comentario");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("id_post=" + idPost.value + "&comen=" + inputComentar.value);
  }
}

function enviarMensajeRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    inputComentar.value = "";
    var respuesta = JSON.parse(event.target.responseText);
    var fotoPerfil = respuesta[0].fotoPerfil;
    var mensajeRes = respuesta[0].contenido;
    var nomUsuario = respuesta[0].nomUsuario;
    var fecha = respuesta[0].fechaActual;

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

    // Insertar como primer comentario de la lista
    document.getElementById("primerComentario").parentNode.insertBefore(cardDiv, document.getElementById("primerComentario").nextSibling);

    //Scroll al principio
    document.getElementById("divScrollComentarios").scrollTop = 0;


    //Aumentar comentarios
    var comentarios = document.getElementById("cantidadComentarios");
    var valorActual = parseInt(comentarios.textContent, 10);
    var nuevoValor = valorActual + 1;
    comentarios.textContent = nuevoValor;

    if(document.getElementById("noComentarios")){
      document.getElementById("noComentarios").remove();
    }
  }
}

function volverListaPosts(nomGrupo) {
  window.location.href = "/infoGrupo/" + nomGrupo;
}
