var usuario;

document.addEventListener("DOMContentLoaded", function () {
  generaTres();
  document
    .getElementById("recargarFotosPokemon")
    .addEventListener("click", recargar);
  usuario = document.getElementById("usuario");
  usuario.addEventListener("input", validarNombre);
});
function generaTres() {
  for (var i = 1; i <= 3; i++) {
    fetchPokemon(Math.floor(Math.random() * 649) + 1);
  }
}
function fetchPokemon(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((response) => response.json())
    .then((data) => {
      crearPokemon(data);
    });
}

function crearPokemon(data) {
  var imagen = document.createElement("img");
  imagen.src = data.sprites.front_default;
  imagen.className = "imagenPokemon";
  imagen.id = data.id;
  imagen.addEventListener("click", seleccionado);
  document.getElementById("fotosPokemonElegir").appendChild(imagen);
}

function seleccionado(ev) {
  var imagenes = document.querySelectorAll(".imagenPokemon");
  imagenes.forEach(function (img) {
    img.style.border = "none";
  });
  ev.target.style.border = "1px solid black";
  ev.target.style.borderRadius = "50%";
  document.getElementById("idFotoPerfil").value = ev.target.id;
}

function recargar() {
  var padre = document.getElementById("fotosPokemonElegir");
  while (padre.firstChild) {
    padre.removeChild(padre.firstChild);
  }
  document.getElementById("idFotoPerfil").value = "";
  generaTres();
}

function validacionCampos(event) {
  event.preventDefault(); // evitar el envío del formulario

  var usuario = document.getElementById("usuario").value.trim();
  var correo = document.getElementById("correo").value.trim();
  var clave = document.getElementById("clave").value.trim();  

  if (usuario === "" || correo === "" || clave === "") {
    Swal.fire({
      title: "Rellena todos los campos obligatorios",
      icon: "warning",
    });
    return false;
  }

  var usuarioInput = document.getElementById("usuario");
  var estiloUsuario = window.getComputedStyle(usuarioInput);
  var colorUsuario = estiloUsuario.color;
  if (colorUsuario !== "rgb(0, 128, 0)") {
    Swal.fire({
      title: "Este nombre de usuario ya está registrado",
      icon: "warning",
    });
    return false;
  }

  if (esCorreoElectronico(correo)) {
    comprobarCorreoRegistrado(correo, function(existe) {
      if (existe) {
        
        Swal.fire({
          title: "Este correo ya está registrado",
          icon: "warning",
        })
      } else {
        
        
        if (document.getElementById("idFotoPerfil").value == "") {
          Swal.fire({
            title: "Selecciona un Pokemon como foto de perfil",
            text: "Lo podrás cambiar más adelante",
            icon: "warning",
          });
          return false;
        }

        Swal.fire({
          title: "¿Desea crear la cuenta?",
          icon: "question",
          showDenyButton: true,
          confirmButtonText: "Crear",
          denyButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Activa la cuenta desde tu correo",
              icon: "success",
              timer: 1500,
              timerProgressBar: true,
              showConfirmButton: false,
            }).then(() => {
              event.target.submit();
            });
          } else if (result.isDenied) {
            Swal.fire({
              title: "Registro cancelado",
              icon: "error",
              timer: 1500,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  }
}

function comprobarCorreoRegistrado(correo, callback) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(xhr.responseText);
    }
  });
  xhr.open("POST", "/comprobarCorreoRegistrado", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("correo=" + correo);
}
function validarNombre() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", validarNombreRespuesta, true);
  xhr.open("POST", "/validarNomUsuario");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("usuario=" + usuario.value);
}

function validarNombreRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    if (event.target.responseText) {
      usuario.style.color = "red";
    } else {
      usuario.style.color = "green";
    }
  }
}

// function comprobarCorreoRegistradoRespuesta(event) {
//   if (event.target.readyState == 4 && event.target.status == 200) {
//     var correo = document.getElementById("correo");
//     if (event.target.responseText) {
//       correo.style.color = "red";
//       Swal.fire({
//         title: "Este correo ya está registrado",
//         icon: "warning",
//       });
//       return false;
//     } else {
//       correo.style.color = "black";
//     }
//   }
// }

function esCorreoElectronico(str) {
  //validar un correo electrónico
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(str);
}
