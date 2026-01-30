function comprobarNombreGrupoNoExistente() {
  var nombre = document.getElementById("nom_grupo").value;
  var xhr = new XMLHttpRequest();
  xhr.addEventListener(
    "readystatechange",
    comprobarNombreGrupoNoExistenteRespuesta,
    true
  );
  xhr.open("POST", "/comprobarNombreGrupoNoExistente");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("nombre=" + nombre);
}

function comprobarNombreGrupoNoExistenteRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    var mensajeNombreGrupo = document.getElementById("mensajeNombreGrupo");
    var nombreInput = document.getElementById("nom_grupo");
    var crearGrupoH1 = document.getElementById("crearGrupoH1");
    if (nombreInput.value.trim() !== "") {
      if (event.target.responseText == "true") {
        mensajeNombreGrupo.classList.remove("d-none");
        crearGrupoH1.classList.add("d-none");
        nombreInput.value = "";
        nombreInput.focus();
      } else {
        mensajeNombreGrupo.classList.add("d-none");
        crearGrupoH1.classList.remove("d-none");
      }
    }
  }
}

var fotoElegida = false;
function validarFoto() {
  if (foto.files.length > 0) {
    if (
      foto.files[0] &&
      !foto.files[0].type.match("image/jpeg") &&
      !foto.files[0].type.match("image/png") &&
      !foto.files[0].type.match("image/gif") &&
      !foto.files[0].type.match("image/jpg")
    ) {
      Swal.fire({
        title: "Solo se aceptan archivos de foto PNG, JPEG, GIF o JPG",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      foto.value = "";
    } else {
      var reader = new FileReader();
      reader.onload = function (e) {
        imagen.src = e.target.result;
        imagen.style.display = "inline"; // mostrar vista previa de la imagen
      };
      reader.readAsDataURL(foto.files[0]);
      fotoElegida = true;
    }
  } else {
    imagen.style.display = "none";
    fotoElegida = false;
  }
}

function validarGrupo() {
  setTimeout(function () {
    var nombre = document.getElementById("nom_grupo");
    var descripcion = document.getElementById("descripcion");
    var foto = document.getElementById("foto");
    if (nombre.value.trim() === "" || descripcion.value.trim() === "") {
      Swal.fire({
        title: "Rellena todos los campos",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return false;
    } else {
      if (!fotoElegida) {
        Swal.fire({
          title: "Selecciona una imagen",
          icon: "error",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return false;
      } else {
        //crearNuevoGrupo
        var formData = new FormData();
        formData.append("foto", foto.files[0]);
        formData.append("nombre", nombre.value);
        formData.append("descripcion", descripcion.value);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", crearGrupoRespuesta, true);
        xhr.open("POST", "/crearNuevoGrupo");
        xhr.send(formData);
        fotoElegida = false;
      }
    }
  }, 500);
}

function crearGrupoRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Grupo creado",
      icon: "success",
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    //redireccionar al usu dentro del grupo
    setTimeout(function () {
      window.location.href =
        "http://localhost:8000/infoGrupo/" + event.target.responseText;
    }, 800);
  }
}
