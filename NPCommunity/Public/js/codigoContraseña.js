var codigoColores;
var codigoNumeros;
var borrar;
var letraColor = "";

document.addEventListener("DOMContentLoaded", function () {
  codigoColores = document.getElementById("codigoColores");
  codigoNumeros = document.getElementById("codigoNumeros");
  borrar = document.getElementById("borrarCodigo");

  for (var i = 0; i < document.getElementById("colores").children.length; i++) {
    document
      .getElementById("colores")
      .children[i].addEventListener("click", color);
  }
  borrar.addEventListener("click", borrarCodigo);
  codigoColores.addEventListener("focus", quitarFocus);
});

function color(event) {
  if (codigoColores.value.length < 6) {
    switch (event.target.id) {
      case "r":
        codigoColores.value += "🟥";
        letraColor += "r";
        break;
      case "v":
        codigoColores.value += "🟩";
        letraColor += "v";
        break;
      case "a":
        codigoColores.value += "🟦";
        letraColor += "a";
        break;
    }
  }
}

function quitarFocus() {
  codigoColores.blur();
}

function borrarCodigo() {
  codigoColores.value = "";
  codigoNumeros.value = "";
  letraColor = "";
}

function validacionCodigoAjax(event) {
  event.preventDefault(); // evitar el envío del formulario
  if (codigoColores.value != "" && codigoNumeros.value != "") {
    var codigo = letraColor + codigoNumeros.value;
    xhr = new XMLHttpRequest();
    xhr.addEventListener(
      "readystatechange",
      validacionCodigoGestionarRespuesta,
      true
    );
    xhr.open("POST", "/compruebaCodigos");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("codigo=" + codigo);
  } else {
    Swal.fire({
      title: "Rellene los códigos enviados a su correo",
      icon: "warning",
      timer: 3500,
    })
  }
}

function validacionCodigoGestionarRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    console.log(event.target.responseText);
    if (event.target.responseText == "Errorazo") {
      Swal.fire({
        title: "Código erróneo, compruebe su correo.",
        icon: "error",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Ingrese su nueva contraseña.",
        icon: "warning",
        input: "text",
        confirmButtonText: "Actualizar contraseña",
        showCancelButton: true,
        inputAttributes: {
          autocomplete: "off",
          autocapitalize: "off",
          autocorrect: "off",
          name: "precio_" + Math.random().toString(36).substring(7), // Genera un nombre de campo aleatorio
        },
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          if (!/\S/.test(result.value.trim())) {
            //solo espacios en blanco
            Swal.fire({
              title: "Debes introducir un número válido.",
              icon: "error",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          } else {
            cambioClaveAjax(result.value, event.target.responseText);
          }
        } else {
          Swal.fire({
            title: "Proceso cancelado.",
            icon: "error",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      });
    }
  }
}

function cambioClaveAjax(nuevaClave, idUsuario) {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", cambioClaveGestionarRespuesta, true);
  xhr.open("POST", "/ctrl_cambiarContraseña");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("nuevaClave=" + nuevaClave + "&idUsuario=" + idUsuario);
}

function cambioClaveGestionarRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Contraseña actualizada",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = '/login';
    });
  }
}

