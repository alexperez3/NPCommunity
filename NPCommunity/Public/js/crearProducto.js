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

function validarProducto() {
  var nombre = document.getElementById("nom_prod");
  var descripcion = document.getElementById("descripcion");
  var precio = document.getElementById("precio");
  var foto = document.getElementById("foto");
  if (
    nombre.value.trim() === "" ||
    descripcion.value.trim() === "" ||
    precio.value.trim() === ""
  ) {
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
      //publicarProducto
      fotoElegida = false;
      var formData = new FormData();
      formData.append("foto", foto.files[0]);
      formData.append("nombre", nombre.value);
      formData.append("descripcion", descripcion.value);
      var cambiarDecimal = precio.value.indexOf(".");
      if (cambiarDecimal != -1) {
        nuevoPrecio = precio.value.replace(/\./g, ",");
        formData.append("precio", nuevoPrecio);
      } else {
        formData.append("precio", precio.value);
      }
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", publicarProductoRespuesta, true);
      xhr.open("POST", "/publicarProducto");
      xhr.send(formData);
    }
  }
}

function publicarProductoRespuesta(event) {
  if (event.target.readyState == 4 && event.target.status == 200) {
    Swal.fire({
      title: "Producto publicado",
      icon: "success",
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    //formulario para enviar al usu dentro del producto
    setTimeout(function () {
      window.location.href = "/infoProducto/" + event.target.responseText;    

    }, 800);
  }
}

function validarPrecio() {
  var input = document.getElementById("precio");
  if (
    !input.value ||
    isNaN(parseFloat(input.value)) ||
    parseFloat(input.value) <= 0
  ) {
    input.classList.add("is-invalid");
    input.value="";
  } else {
    // Si el input cumple con los criterios, se remueve la clase is-invalid
    input.classList.remove("is-invalid");
  }
}
