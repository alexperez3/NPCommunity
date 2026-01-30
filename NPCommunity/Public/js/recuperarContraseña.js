var correo;
var encontrado;
document.addEventListener("DOMContentLoaded", function () {
  correo = document.getElementById("inputCorreo");
  correo.addEventListener("input", buscarCorreoAjax);


  // for (var i = 0; i < document.getElementById("colores").children.length; i++) {
  //   document
  //     .getElementById("colores")
  //     .children[i].addEventListener("click", color);
  // }
});

function buscarCorreoAjax() {
  xhr = new XMLHttpRequest();
  xhr.addEventListener(
    "readystatechange",
    buscarCorreoGestionarRespuesta,
    true
  );
  xhr.open("POST", "/buscarCorreo");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("correo=" + correo.value);
}

function buscarCorreoGestionarRespuesta(evento) {
  if (evento.target.readyState == 4 && evento.target.status == 200) {
    if (evento.target.responseText) {
      document.getElementById("izquierda").src = "../fotos/logoDefinitivoIIAATick.jpg"
      document.getElementById("derecha").src = "../fotos/logoDefinitivoIIAA(reverso)Tick.jpg"

      document.getElementById("correoEncontrado").src = "../fotos/tick.png";
      encontrado = true;
    } else {
      document.getElementById("izquierda").src = "../fotos/logoDefinitivoIIAAEquis.jpg"
      document.getElementById("derecha").src = "../fotos/logoDefinitivoIIAA(reverso)Equis.jpg"
      document.getElementById("correoEncontrado").src = "../fotos/x.png";
      encontrado = false;
    }
    document.getElementById("correoEncontrado").hidden = false;
  }
}

function enviarEmailRecuperacion(event) {
  event.preventDefault(); // evitar el envío del formulario
  if (
    document.getElementById("correoEncontrado").src ==
    "http://localhost:8000/fotos/tick.png"
  ) {
    Swal.fire({
      title: "Correo enviado",
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      event.target.submit();
    });
  } else {
    Swal.fire({
      title: "Correo no encontrado",
      icon: "error",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}

// function color(event) {
//   console.log(event.target.textContent);
// }
