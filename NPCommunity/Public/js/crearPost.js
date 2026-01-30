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

function validarPost() {
  var contenido = document.getElementById("contenidoPost");
  var grupo = document.getElementById("grupos_seguidos");
  var foto = document.getElementById("foto");
  var archivo = document.getElementById("archivo");

  if (grupo.value === "") {
    Swal.fire({
      title: "Elige un grupo en el que publicar tu post",
      icon: "error",
      timer: 2200,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return false;
  } else if (contenido.value.trim() === "") {
    Swal.fire({
      title: "Escribe algo para publicar",
      icon: "error",
      timer: 1200,
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
      //crearNuevoPost
      var formData = new FormData();
      formData.append("foto", foto.files[0]);
      formData.append("grupo", grupo.value);
      formData.append("contenido", contenido.value);
      if (archivo) {
        formData.append("archivo", archivo.files[0]);
      }
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", crearpostRespuesta, true);
      xhr.open("POST", "/crearNuevoPost");
      xhr.send(formData);
      fotoElegida = false;
    }
  }
}

function crearpostRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Post publicado",
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

function ponerFotoGrupo(selectGrupos) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener(
    "readystatechange",
    function (event) {
      var fotoG = document.getElementById("fotoGrupo");   
      
      if (event.target.readyState == 4 && event.target.status == 200) {
        if (event.target.responseText != "") {
          fotoG.src = "../fotos/" + event.target.responseText;
          fotoG.style.display = "inline";
        } else {
          document.getElementById("fotoGrupo").src = "";
          fotoG.style.display = "none";
        }
      }
    },
    true
  );
  xhr.open("POST", "/ponerFotoGrupo");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("idGrupo=" + selectGrupos);
}
