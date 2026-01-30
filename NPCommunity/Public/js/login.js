var mostrarClaveBoton;
var error;
var passwordInput;
var formularioLogin;
var nomUsu;
document.addEventListener("DOMContentLoaded", function () {
  error = document.getElementById("error").dataset.variable;
  if (error) {
    Swal.fire({
      title: "Credenciales erróneas",
      icon: "error",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
  mostrarClaveBoton = document.getElementById("mostrarClave");
  passwordInput = document.getElementById("password");
  mostrarClaveBoton.addEventListener("click", mostrarClave);
  nomUsu = document.getElementById("username");
  formularioLogin = document.getElementById("formularioLogin");
  // comprobarEmail();
});

function mostrarClave() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    mostrarClaveBoton.src = "../fotos/noVer.png";
  } else {
    passwordInput.type = "password";
    mostrarClaveBoton.src = "../fotos/ver.png";
  }
}
function comprobarEmail() {
  if (document.getElementById("validarEmail").value=="no") {
    mensajeEmailNoValido();
  }
}
function mensajeEmailNoValido() {
  Swal.fire({
    title: "Active su cuenta desde el correo",
    icon: "error",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}
