var nuevoNombre;
var nuevoApellidos;
var nuevoCorreo;
var nuevoNomUsuario;
var nuevoBio;
var inputArchivo;

var botonNombre;
var botonApellidos;
var botonCorreo;
var botonNomUsuario;
var botonFoto;
var botonBio;
var fotoPerfil;
document.addEventListener("DOMContentLoaded", function () {
  darValores();
  ocultarBotones();
});

function darValores() {
  nuevoNombre = document.getElementById("nuevoNombre");
  nuevoApellidos = document.getElementById("nuevoApellido");
  nuevoCorreo = document.getElementById("nuevoCorreo");
  nuevoNomUsuario = document.getElementById("nuevoNomUsuario");
  nuevoBio = document.getElementById("nuevoBio");
  inputArchivo = document.getElementById("inputArchivo");

  botonNombre = document.getElementById("botonNombre");
  botonApellidos = document.getElementById("botonApellidos");
  botonCorreo = document.getElementById("botonCorreo");
  botonNomUsuario = document.getElementById("botonNomUsuario");
  botonBio = document.getElementById("botonBio");
  botonFoto = document.getElementById("botonFoto");
  fotoPerfil = document.getElementById("fotoPerfilEditar");

  //Cambiar nombre
  nuevoNombre.addEventListener("input", function () {
    if (nuevoNombre.value.trim() === "") {
      botonNombre.hidden = true;
    } else {
      botonNombre.hidden = false;
    }
  });
  botonNombre.addEventListener("click", cambiarNombre);

  //Cambiar apellidos
  nuevoApellidos.addEventListener("input", function () {
    if (nuevoApellidos.value.trim() === "") {
      botonApellidos.hidden = true;
    } else {
      botonApellidos.hidden = false;
    }
  });
  botonApellidos.addEventListener("click", cambiarApellidos);

  //Cambiar Bio
  nuevoBio.addEventListener("input", function () {
    if (nuevoBio.value.trim() === "") {
      botonBio.hidden = true;
    } else {
      botonBio.hidden = false;
    }
  });
  botonBio.addEventListener("click", cambiarBio);

  //Cambiar correo
  nuevoCorreo.addEventListener("input", function () {
    if (nuevoCorreo.value.trim() === "") {
      botonCorreo.hidden = true;
    } else {
      botonCorreo.hidden = false;
    }
  });
  nuevoCorreo.addEventListener("input", comprobarCorreo);

  //Cambiar nombre Usuario
  nuevoNomUsuario.addEventListener("input", function () {
    if (nuevoNomUsuario.value.trim() === "") {
      botonNomUsuario.hidden = true;
    } else {
      botonNomUsuario.hidden = false;
    }
  });
  nuevoNomUsuario.addEventListener("input", comprobarNomUsuario);

  //Cambiar foto perfil

  fotoPerfil.addEventListener("click", function () {
    inputArchivo.click();
  });

  inputArchivo.addEventListener("change", function () {
    if (inputArchivo.files.length > 0) {
      botonFoto.hidden = false;
    } else {
      botonFoto.hidden = true;
    }
  });
  inputArchivo.addEventListener("change", cogerFoto);
  botonFoto.addEventListener("click", cambiarFotoPerfil);
}

function ocultarBotones() {
  var camposTexto = document.querySelectorAll(".campoTexto");

  camposTexto.forEach(function (input) {
    input.addEventListener("input", function () {
      var button =
        input.parentNode.nextElementSibling.querySelector(".botonCambiar");
      if (input.value.trim() === "") {
        button.setAttribute("hidden", "true");
      } else {
        button.removeAttribute("hidden");
      }
    });
  });
}

//Cambiar nombre
function cambiarNombre() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", cambiarNombreRespuesta, true);
  xhr.open("POST", "/cambiarNombre");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("nuevoNombre=" + nuevoNombre.value);
}

function cambiarNombreRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    nuevoNombre.placeholder = nuevoNombre.value;
    nuevoNombre.value = "";
    botonNombre.hidden = true;
    Swal.fire({
      title: "Nombre actualizado",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}

//Cambiar apellidos
function cambiarApellidos() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", cambiarApellidosRespuesta, true);
  xhr.open("POST", "/cambiarApellidos");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("nuevoApellido=" + nuevoApellidos.value);
}

function cambiarApellidosRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    nuevoApellidos.placeholder = nuevoApellidos.value;
    nuevoApellidos.value = "";
    botonApellidos.hidden = true;
    Swal.fire({
      title: "Apellidos actualizados",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}

//Cambiar cambiar Bio
function cambiarBio() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", cambiarBioRespuesta, true);
  xhr.open("POST", "/cambiarBio");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("nuevoBio=" + nuevoBio.value);
}

function cambiarBioRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    nuevoBio.placeholder = nuevoBio.value;
    nuevoBio.value = "";
    botonBio.hidden = true;
    Swal.fire({
      title: "Biografía actualizada",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}

//Cambiar correo
function cambiarCorreo() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", cambiarCorreoRespuesta, true);
  xhr.open("POST", "/cambiarCorreo");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("nuevoCorreo=" + nuevoCorreo.value);
}

function cambiarCorreoRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    nuevoCorreo.placeholder = nuevoCorreo.value;
    nuevoCorreo.value = "";
    botonCorreo.hidden = true;
    Swal.fire({
      title: "Correo actualizado",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}

function comprobarCorreo() {
  if (esCorreoElectronico(nuevoCorreo.value)) {
    xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", comprobarCorreoRespuesta, true);
    xhr.open("POST", "/comprobarCorreo");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("nuevoCorreo=" + nuevoCorreo.value);
  } else {
    nuevoCorreo.style.color = "red";
    botonCorreo.removeEventListener("click", correoYaRegistrado);
    botonCorreo.removeEventListener("click", cambiarCorreo);
    botonCorreo.addEventListener("click", correoNoValido);
  }
}

function comprobarCorreoRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    if (event.target.responseText) {
      nuevoCorreo.style.color = "red";
      botonCorreo.removeEventListener("click", cambiarCorreo);
      botonCorreo.removeEventListener("click", correoNoValido);
      botonCorreo.addEventListener("click", correoYaRegistrado);
    } else {
      nuevoCorreo.style.color = "green";
      botonCorreo.removeEventListener("click", correoNoValido);
      botonCorreo.removeEventListener("click", correoYaRegistrado);
      botonCorreo.addEventListener("click", cambiarCorreo);
    }
  }
}

function esCorreoElectronico(str) {
  //validar un correo electrónico
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(str);
}

function correoNoValido() {
  Swal.fire({
    title: "Introduce un correo válido",
    icon: "error",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

function correoYaRegistrado() {
  Swal.fire({
    title: "Este correo ya está registrado",
    icon: "error",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

//camabiar nombre de usuario
function cambiarNomUsuario() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", cambiarNomUsuarioRespuesta, true);
  xhr.open("POST", "/cambiarNomUsuario");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("nuevoNomUsuario=" + nuevoNomUsuario.value);
}

function cambiarNomUsuarioRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    nuevoNomUsuario.placeholder = nuevoNomUsuario.value;
    nuevoNomUsuario.value = "";
    botonNomUsuario.hidden = true;
    Swal.fire({
      title: "Nombre de usuario actualizado",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}

function comprobarNomUsuario() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", comprobarNomUsuarioRespuesta, true);
  xhr.open("POST", "/comprobarNomUsuario");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("nuevoNomUsuario=" + nuevoNomUsuario.value);
}

function comprobarNomUsuarioRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    if (event.target.responseText) {
      nuevoNomUsuario.style.color = "red";
      botonNomUsuario.removeEventListener("click", cambiarNomUsuario);
      botonNomUsuario.addEventListener("click", correoYaRegistrado);
    } else {
      nuevoNomUsuario.style.color = "green";
      botonNomUsuario.removeEventListener("click", correoYaRegistrado);
      botonNomUsuario.addEventListener("click", cambiarNomUsuario);
    }
  }
}

function correoYaRegistrado() {
  Swal.fire({
    title: "Este nombre de usuario ya está registrado",
    icon: "error",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

//Cambiar foto de perfil

var archivo;
var cambioManejado = false;
function cogerFoto() {
  if (!cambioManejado) {
    archivo = inputArchivo.files[0];
    cambioManejado = true;
  }

  if (
    archivo &&
    !archivo.type.match("image/jpeg") &&
    !archivo.type.match("image/png") &&
    !archivo.type.match("image/gif") &&
    !archivo.type.match("image/jpg")
  ) {
    Swal.fire({
      title: "Solo se aceptan archivos de imagen PNG, JPEG, GIF o JPG",
      icon: "error",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return;
  } else {
    if (archivo) {
      botonFoto.hidden = false;
      var reader = new FileReader();
      reader.onload = function (e) {
        fotoPerfil.src = e.target.result; // mostrar vista previa de la imagen
      };
      reader.readAsDataURL(archivo);
      fotoPerfil.style.filter = "brightness(50%)";
      cambioManejado = false;
      fotoPerfilEditar.removeEventListener("mouseover", aplicarBrillo);
    fotoPerfilEditar.removeEventListener("mouseout", quitarBrillo);
    } else {
      botonFoto.hidden = true;
      fotoPerfil.src = document.getElementById("fotoPerfil").src;
      fotoPerfil.style.filter = "brightness(100%)";
      cambioManejado = false;
      fotoPerfilEditar.addEventListener("mouseover", aplicarBrillo);
      fotoPerfilEditar.addEventListener("mouseout", quitarBrillo);
    }
  }
}

function cambiarFotoPerfil() {
  var archivo = document.getElementById("inputArchivo").files[0];
  var formData = new FormData();
  formData.append("archivo", archivo);
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", cambiarFotoPerfilRespuesta, true);
  xhr.open("POST", "/cambiarFotoPerfil");
  xhr.send(formData);
}

function cambiarFotoPerfilRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    botonFoto.hidden = true;
    fotoPerfil.style.filter = "brightness(100%)";
    fotoPerfilEditar.style.transition = "opacity 0.3s ease";
    document.getElementById("fotoPerfil").src =
      "fotos/" + event.target.responseText;

    Swal.fire({
      title: "Foto de perfil actualizada",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}

function aplicarBrillo() {
  fotoPerfilEditar.style.filter = "brightness(50%)";
}
function quitarBrillo() {
  fotoPerfilEditar.style.filter = "brightness(100%)";
}
