var contenido;
var inputMensaje;
var botonEnviar;
var idChat;
var comprador;
var propietario;
var rowContenido;
var idProd;
var producto;
var precio;
var correoComprador;
var nombreComprador;
var numTarjeta;

document.addEventListener("DOMContentLoaded", function () {
  contenido = document.getElementById("contenidoChats");
  if (document.getElementById("propietario")) {
    obtenerDatosDelChat();
  }
  disableAutocomplete();
});

function mostrarChatProd(ev) {
  while (contenido.firstChild) {
    //limpiar div
    contenido.removeChild(contenido.firstChild);
  }
  document.getElementById("volverDonde").innerHTML="Volver a los chats";
  idChat = ev.target.id;
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", mostrarChatProdRespuesta, true);
  xhr.open("POST", "/escribirMensajeProd");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("idChat=" + ev.target.id);
}

function mostrarChatProdRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    var arrayMensajes = JSON.parse(event.target.responseText);

    comprador = arrayMensajes[0].comprador;
    propietario = arrayMensajes[0].propietario;

    var fotoPerfil = document.createElement("img");
    fotoPerfil.setAttribute("src", "../fotos/" + arrayMensajes[0].fotoPerfil);
    fotoPerfil.style.width = "60px";
    fotoPerfil.style.height = "60px";
    fotoPerfil.style.borderRadius = "50%";

    var rowTitulo = document.createElement("div");
    rowTitulo.setAttribute("class", "row justify-content-center text-center");
    rowTitulo.innerHTML =
      "<h4 id='titulo'>@" + arrayMensajes[0].comprador + "</h4>";
    contenido.appendChild(rowTitulo);
    rowContenido = document.createElement("div");
    rowContenido.setAttribute("id", "rowContenido");
    rowContenido.setAttribute("class", "py-1");
    rowContenido.style.height = "550px";
    rowContenido.style.overflowY = "auto";
    rowContenido.style.overflowX = "hidden";
    rowContenido.style.border = "1px dotted black";
    rowContenido.style.borderRadius = "12px";
    contenido.appendChild(rowContenido);

    document.getElementById("titulo").appendChild(fotoPerfil);

    setTimeout(function () {
      //Poner abajo el scroll de la conversacion
      rowContenido.scrollTop = rowContenido.scrollHeight;
    }, 10);

    for (var i = 0; i < arrayMensajes.length; i++) {
      var row = document.createElement("div");

      //col foto
      var colFoto = document.createElement("div");
      colFoto.setAttribute("class", "col-1");
      var foto = document.createElement("img");
      foto.setAttribute("src", "../fotos/" + arrayMensajes[i].fotoPerfil);
      foto.style.width = "40px";
      foto.style.height = "40px";
      foto.style.borderRadius = "50%";

      colFoto.appendChild(foto);

      //col mensaje
      var colMensaje = document.createElement("div");
      colMensaje.style.border = "black 1px dashed";
      colMensaje.style.borderRadius = "12px";
      var mensaje = document.createElement("p");
      mensaje.innerHTML = arrayMensajes[i].contenido;
      mensaje.style.textAlign = "left";

      colMensaje.appendChild(mensaje);
      row.setAttribute("class", "row mb-2");
      if (arrayMensajes[i].propietario == arrayMensajes[i].emisor) {
        //Poner mensaje en la iz o dere en funcion de quien sea
        colMensaje.setAttribute(
          "class",
          "col-7 offset-1 offset-md-0 offset-lg-1 offset-xl-0"
        );
        row.appendChild(colFoto);
        row.appendChild(colMensaje);
      } else {
        colMensaje.setAttribute(
          "class",
          "col-7 offset-3 offset-md-4 offset-lg-3 offset-xl-4"
        );
        row.appendChild(colMensaje);
        row.appendChild(colFoto);
      }

      rowContenido.appendChild(row);
    }
    imprimirInputEscribir();
  }
}

function imprimirInputEscribir() {
  var row = document.createElement("div");
  row.setAttribute("class", "row justify-content-center mt-1");

  //col 1 input
  var col1 = document.createElement("div");
  col1.setAttribute("class", "col-10");

  inputMensaje = document.createElement("input");
  inputMensaje.setAttribute("type", "text");
  inputMensaje.setAttribute("class", "form-control");
  inputMensaje.setAttribute("id", "mensaje");
  inputMensaje.setAttribute("placeholder", "Escribe tu mensaje aquí");

  col1.appendChild(inputMensaje);
  row.appendChild(col1);

  //col 2 input
  var col2 = document.createElement("div");
  col2.setAttribute("class", "col-2");

  botonEnviar = document.createElement("button");
  botonEnviar.setAttribute("type", "button");
  botonEnviar.setAttribute("class", "btn btn-primary");
  botonEnviar.addEventListener("click", enviarMensajeComoPropietario);
  botonEnviar.innerHTML = "Enviar";
  col2.appendChild(botonEnviar);
  row.appendChild(col2);

  contenido.appendChild(row);
}

function enviarMensajeComoPropietario() {
  var mensaje = document.getElementById("mensaje");
  if (mensaje.value.trim() !== "") {
    xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append("idChat", idChat);
    formData.append("emisor", propietario);
    formData.append("receptor", comprador);
    formData.append("contenido", mensaje.value);
    xhr.addEventListener("readystatechange", enviarMensajeRespuesta, true);
    xhr.open("POST", "/enviarMensajeProd");
    xhr.send(formData);
  }
}

function enviarMensajeRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    var inputMensaje = document.getElementById("mensaje");
    inputMensaje.value = "";
    var respuesta = JSON.parse(event.target.responseText);
    var fotoPerfil = respuesta[0].fotoPerfil;
    var mensajeRes = respuesta[0].contenido;

    var row = document.createElement("div");
    row.setAttribute("class", "row mb-2 mt-1");

    if (idChat == null) {
      //Por si es el primer mensaje
      idChat = respuesta[0].idChat;
    }
    //col foto
    var colFoto = document.createElement("div");
    colFoto.setAttribute("class", "col-1");
    var foto = document.createElement("img");
    foto.setAttribute("src", "../fotos/" + fotoPerfil);
    foto.style.width = "40px";
    foto.style.height = "40px";
    foto.style.borderRadius = "50%";
    colFoto.appendChild(foto);

    //col mensaje
    var colMensaje = document.createElement("div");
    colMensaje.setAttribute("class", "col-7");
    colMensaje.innerHTML = mensajeRes;
    colMensaje.style.textAlign = "left";
    colMensaje.style.border = "1px dashed black";
    colMensaje.style.borderRadius = "12px";

    if (
      !document.getElementById("columnaConver") &&
      !document.getElementById("rowContenido")
    ) {
      crearColumnaConver(); //crear columna conver si no exist
    }
    if (!rowContenido) {
      colMensaje.classList.add("offset-4");
      row.appendChild(colMensaje);
      row.appendChild(colFoto);
      document.getElementById("columnaConver").appendChild(row);
      setTimeout(function () {
        //Poner abajo el scroll de la conversacion
        document.getElementById("divScroll").scrollTop =
          document.getElementById("divScroll").scrollHeight;
      }, 10);
    } else {
      row.appendChild(colFoto);
      row.appendChild(colMensaje);
      rowContenido.appendChild(row);
      setTimeout(function () {
        //Poner abajo el scroll de la conversacion
        rowContenido.scrollTop = rowContenido.scrollHeight;
      }, 10);
    }
  }
}

function obtenerDatosDelChat() {
  if (document.getElementById("divScroll")) {
    setTimeout(function () {
      //Poner abajo el scroll de la conversacion
      document.getElementById("divScroll").scrollTop =
        document.getElementById("divScroll").scrollHeight;
    }, 10);
  }
  xhr = new XMLHttpRequest();
  var formData = new FormData();
  idProd = document.getElementById("idProducto").value;

  formData.append("idProducto", document.getElementById("idProducto").value);
  formData.append("propietario", document.getElementById("propietario").value);
  formData.append("comprador", document.getElementById("comprador").value);

  xhr.addEventListener("readystatechange", obtenerDatosDelChatRespuesta, true);
  xhr.open("POST", "/obtenerDatosDelChat");
  xhr.send(formData);
}

function obtenerDatosDelChatRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    var respuesta = JSON.parse(event.target.responseText);
    comprador = respuesta[0].comprador;
    propietario = respuesta[0].propietario;
    idChat = respuesta[0].idChat;
    correoComprador = respuesta[0].correoComprador;
    producto = respuesta[0].producto;
    precio = respuesta[0].precio;
    nombreComprador = respuesta[0].nombreComprador;
  }
}

function enviarMensajeComoComprador() {
  var mensaje = document.getElementById("mensaje");
  if (mensaje.value.trim() !== "") {
    xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append("idChat", idChat);
    formData.append("emisor", comprador);
    formData.append("receptor", propietario);
    formData.append("contenido", mensaje.value);
    if (document.getElementById("idProducto")) {
      formData.append(
        "idProducto",
        document.getElementById("idProducto").value
      );
    }
    xhr.addEventListener("readystatechange", enviarMensajeRespuesta, true);
    xhr.open("POST", "/enviarMensajeProd");
    xhr.send(formData);
  }
}

function crearColumnaConver() {
  var divScroll = document.getElementById("divScroll");
  while (divScroll.firstChild) {
    //limpiar div
    divScroll.removeChild(divScroll.firstChild);
  }
  var columnaConver = document.createElement("div");
  columnaConver.setAttribute("id", "columnaConver");
  columnaConver.setAttribute("class", "col-12");
  divScroll.appendChild(columnaConver);
}

function cambiarPrecio() {
  Swal.fire({
    title: "Introduce el nuevo precio de tu producto",
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: "Cancelar",
    input: "text",
    inputPlaceholder: "Nuevo precio",
    inputAttributes: {
      autocomplete: "off",
      autocapitalize: "off",
      autocorrect: "off",
      name: "precio_" + Math.random().toString(36).substring(7), // Genera un nombre de campo aleatorio
    },
    preConfirm: (value) => {
      return new Promise((resolve) => {
        // Reemplazar comas con puntos para validar
        let validValue = value.replace(",", ".");

        // Agregar 0 delante si el primer caracter es . o ,
        if (validValue.charAt(0) === "." || validValue.charAt(0) === ",") {
          validValue = "0" + validValue;
        }

        // Eliminar el ultimo caracter si es . o ,
        if (
          validValue.charAt(validValue.length - 1) === "." ||
          validValue.charAt(validValue.length - 1) === ","
        ) {
          validValue = validValue.slice(0, -1);
        }

        if (!validValue || isNaN(validValue) || validValue <= 0) {
          Swal.showValidationMessage(
            "Por favor, introduce un número válido mayor a 0"
          );
          resolve(false);
        } else {
          resolve(validValue);
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (result.value !== false) {
        // Reemplazar puntos con comas para ajax
        let newValue = result.value.replace(".", ",");
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", cambiarPrecioRespuesta, true);
        xhr.open("POST", "/cambiarPrecio");
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xhr.send(
          "precio=" +
          newValue +
          "&idProducto=" +
          document.getElementById("idProducto").value
        );
      } else {
        alert("error");
      }
    } else if (result.isDenied) {
      Swal.fire("Operación cancelada", "", "info");
    }
  });
}

function cambiarPrecioRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    document.getElementById("precio").innerHTML =
      event.target.responseText + "€";
  }
}

function volver() {
  if (document.getElementById("titulo").innerHTML == "Mensajes") {
    window.location.href = "/principal";
  } else {
    window.location.href = "/infoProducto/" + idProd;
  }
}

function formatCardNumber(value) {
  return value.replace(/\D/g, '').replace(/(.{4})/g, '$1-').trim().slice(0, 19);
}

function formatExpiration(value) {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2').trim().slice(0, 5);
}

function disableAutocomplete() {
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach(input => {
    input.setAttribute('autocomplete', 'off');
  });
}

function comprarProducto() {
  Swal.fire({
    title: 'Introduce los datos de tu tarjeta',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Número de tarjeta" type="text" maxlength="19" oninput="this.value = formatCardNumber(this.value)">' +
      '<input id="swal-input2" class="swal2-input" placeholder="CVV" type="text" maxlength="3" oninput="this.value = this.value.replace(/[^0-9]/g, \'\');">' +
      '<input id="swal-input3" class="swal2-input" placeholder="MM/YY" type="text" maxlength="5" oninput="this.value = formatExpiration(this.value);">',
    focusConfirm: false,
    showDenyButton: true,
    confirmButtonText: 'Comprar',
    denyButtonText: 'Cancelar',
    preConfirm: () => {
      const tarjeta = document.getElementById('swal-input1').value.replace(/-/g, '');
      const cvv = document.getElementById('swal-input2').value;
      const fechaCaducidad = document.getElementById('swal-input3').value;

      // validacion tarjeta
      if (!tarjeta || tarjeta.length !== 16) {
        Swal.showValidationMessage('El número de tarjeta debe tener 16 dígitos');
        return false;
      }

      // validacion cvv
      if (!cvv || cvv.length !== 3) {
        Swal.showValidationMessage('El CVV debe tener 3 dígitos');
        return false;
      }

      // validacion caducidad
      const regexFecha = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!regexFecha.test(fechaCaducidad)) {
        Swal.showValidationMessage('Formato de fecha de caducidad inválido (MM/YY)');
        return false;
      }

      const [mes, ano] = fechaCaducidad.split('/');

      // fecha actual
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      const inputMonth = parseInt(mes, 10);
      const inputYear = parseInt(ano, 10);

      // validar caducidad
      if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
        Swal.showValidationMessage('La tarjeta está caducada');
        return false;
      }

      return {
        tarjeta: tarjeta,
        cvv: cvv,
        fechaCaducidad: fechaCaducidad
      };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      numTarjeta = result.value.tarjeta;
      const cvv = result.value.cvv;
      const fechaCaducidad = result.value.fechaCaducidad;
      Swal.fire({
        // title: "Se ha enviado un correo para confirmar la compra",
        html: "Se ha enviado un correo a <strong>" + correoComprador + "</strong> con los detalles de la compra",
        icon: "info",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          mandarCorreoComprar();
        } 
      });
    } else if (result.isDenied) {
      Swal.fire('Operación cancelada');
    }
  });
}

function mandarCorreoComprar() {
  xhr = new XMLHttpRequest();
  var formData = new FormData();
  formData.append("correo", correoComprador);
  formData.append("precio", precio);
  formData.append("tarjeta", numTarjeta);
  formData.append("nombreComprador", nombreComprador);
  formData.append("producto", producto);
  formData.append("idProd", idProd);
  xhr.addEventListener("readystatechange", mandarCorreoComprarRespuesta, true);
  xhr.open("POST", "/mandarCorreoComprar");
  xhr.send(formData);
}

function mandarCorreoComprarRespuesta() {
  window.location.href = "/perfil";
}
