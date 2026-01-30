<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Usuario;
use App\Entity\Amistad;
use App\Entity\Comentario;
use App\Entity\Mensaje;
use App\Entity\Post;
use DateTime;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Form\PublicacionType;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Config\Framework\HttpClient\DefaultOptions\RetryFailedConfig;


class Registro extends AbstractController
{
    #[Route('/registro', name: "registro")]
    public function registro()
    {
        return $this->render('registro.html.twig');
    }

    #[Route('/control_registro', name: "control_registro")]
    public function control_registro(EntityManagerInterface $entityManager, Request $request, MailerInterface $mailer, UserPasswordHasherInterface $passwordEncoder)
    {
        if (trim($request->request->get("usuario")) && trim($request->request->get("correo")) && trim($request->request->get("clave"))) {
            if (trim($request->request->get("idFotoPerfil"))) {
                if (!$entityManager->getRepository(Usuario::class)->findBy(['nom_usuario' => $request->request->get("usuario")])) {
                    if (!$entityManager->getRepository(Usuario::class)->findBy(['correo' => $request->request->get("correo")])) {
                        //INSERTAR USU//
                        $nuevo = new Usuario();
                        $nuevo->setNomUsuario($request->request->get('usuario'));
                        $nuevo->setCorreo($request->request->get('correo'));
                        $nuevo->setClave($request->request->get('clave'));
                        ////////////////////////////////////////////////
                        $nuevo->setNombre("");
                        $nuevo->setRol("");
                        $nuevo->setApellidos("");
                        ///////////////////////////////////////////////
                        $nuevo->setEmailValidado(0);
                        $nuevo->setCodigoRecuperacion("");
                        $nuevo->setBaneado(0);
                        //Api pokemon
                        $ch = curl_init();
                        curl_setopt($ch, CURLOPT_URL, "https://pokeapi.co/api/v2/pokemon/" . $request->request->get("idFotoPerfil"));
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        $respuesta = curl_exec($ch);
                        curl_close($ch);
                        $valores = json_decode($respuesta, true);
                        $url_imagen = $valores["sprites"]["front_default"];
                        $directorio_destino = 'fotos/';
                        $curl = curl_init($url_imagen);
                        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                        $contenido_imagen = curl_exec($curl);
                        $nombre_archivo_destino = $directorio_destino . $valores["name"] . ".png";
                        file_put_contents($nombre_archivo_destino, $contenido_imagen);
                        curl_close($curl);
                        $nuevo->setFotoPerfil($valores["name"] . ".png");
                        //

                        $entityManager->persist($nuevo);
                        $entityManager->flush();
                        //INSERTAR USU//

                        //CORREO//
                        $mensaje = "<body style='font-family: Arial, sans-serif; background-color: #08c4c2; padding: 0; margin-bottom: 150px;'>
                        <div style='max-width: 600px; margin: 50px auto 0; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 1px 20px 10px #000;'>
                            <h1 style='color: #333;text-align: center;'>Bienvenido a NPCommunity</h1>
                            <p style='color: #666;'>¡Gracias por registrarte en nuestro sitio! Para activar tu cuenta, simplemente haz clic en el siguiente enlace:</p>
                            <a href='http://localhost:8000/validarEmail/" . $request->request->get('usuario') . "' style='display: inline-block; padding: 10px 20px; background-color: #FF8552; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 10px;'>Activar mi cuenta</a>
                            <p style='color: #666;'>Si no has creado una cuenta en NPCommunity, puedes ignorar este correo.</p>
                            <p style='color: #666;'>¡Esperamos verte pronto en nuestra plataforma!</p>
                        </div></body>";
                        $email = (new Email())
                            ->from('NPCommunity@email.com')
                            ->to($request->request->get("correo"))
                            ->subject('Activacion de cuenta en NPCommunity')
                            ->html($mensaje);
                        $mailer->send($email);
                        //CORREO//

                        return $this->redirectToRoute('login');
                    }
                    return new Response("correo ya existe");
                }
                return new Response("nombre ya existe");
            }
            return new Response("Foto de perfil");
        }
        return new Response("Campos vacios");
    }

    #[Route('/validarEmail/{nombre}', name: "validarEmail")]
    public function validarEmail(EntityManagerInterface $entityManager, $nombre)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $nombre]);
        $usuario->setEmailValidado(1);
        $entityManager->persist($usuario);
        $entityManager->flush();
        return $this->render('login.html.twig', ["error" => null]);
    }

    #[Route('/recuperarContraseña', name: 'recuperarContraseña')]
    public function recuperarContraseña()
    {
        return $this->render('recuperarContraseña.html.twig');
    }

    #[Route('/buscarCorreo', name: 'buscarCorreo')]
    public function buscarCorreo(EntityManagerInterface $entityManager, Request $request,)
    {
        $correo = $request->request->get('correo');
        if ($entityManager->getRepository(Usuario::class)->findBy(['correo' => $correo])) {
            return new Response(true);
        } else {
            return new Response(false);
        }
    }

    #[Route('/enviarCorreo', name: 'enviarCorreo')]
    public function enviarCorreo(EntityManagerInterface $entityManager, Request $request, MailerInterface $mailer)
    {
        $correo = $request->request->get("correo");
        $colores = "";
        $codColores = "";
        for ($i = 1; $i <= 3; $i++) {
            $color = rand(1, 3);
            switch ($color) {
                case '1':
                    $colores = $colores . "a";
                    $codColores = $codColores . " 🟦 ";
                    break;
                case '2':
                    $colores = $colores . "v";
                    $codColores = $codColores . " 🟩 ";
                    break;
                case '3':
                    $colores = $colores . "r";
                    $codColores = $codColores . " 🟥 ";
                    break;
            }
        }
        $codigoRand = rand(100, 999) . rand(100, 999);

        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['correo' => $correo]);
        $usuario->setCodigoRecuperacion($colores . $codigoRand);
        $entityManager->persist($usuario);
        $entityManager->flush();

        $mensaje = "<body style='font-family: Arial, sans-serif; background-color: #08c4c2; padding: 0; margin-bottom: 150px;height:450px'>
        <div style='max-width: 600px; margin: 50px auto 0; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 1px 20px 10px #000;'>
            <h1 style='color: #333; text-align: center;'>Cambio de Contraseña</h1>
            <p style='color: #666;'>Hola, @".$usuario->getNomUsuario()."</p>
            <p style='color: #666;'>Has solicitado cambiar tu contraseña para tu cuenta en NPCommunity. Para proceder, por favor introduce el siguiente número y la secuencia de colores en el enlace proporcionado:</p>
            <p style='font-size: 18px; font-weight: bold; color: #333; text-align: center;'>Introduce este número: <span style='color: #d9534f;'>" . $codigoRand . "</span></p>
            <p style='font-size: 18px; font-weight: bold; color: #333; text-align: center;'>y este código de colores: <span style='font-size: 24px;'>" . $codColores . "</span></p>
            <p style='text-align: center; margin-top: 20px;'><a href='http://localhost:8000/cambiarContraseña/" . $request->request->get('usuario') . "' style='display: inline-block; padding: 10px 20px; background-color: #FF8552; color: #ffffff; text-decoration: none; border-radius: 5px;'>Cambiar Contraseña</a></p>
            <p style='color: #666;'>Si no solicitaste este cambio, por favor ignora este correo.</p>
            <p style='color: #666;'>Gracias,</p>
            <p style='color: #666;'>El equipo de NPCommunity</p>
        </div>
    </body>";
    
        $email = (new Email())
            ->from('NPCommunity@email.com')
            ->to($correo)
            ->subject('Recuperacion de contraseña')
            ->html($mensaje);
        $mailer->send($email);

        return $this->redirectToRoute('login');
    }

    #[Route('/cambiarContraseña', name: 'cambiarContraseña')]
    public function cambiarContraseña()
    {
        return $this->render('cambiarContraseña.html.twig');
    }

    #[Route('/ctrl_cambiarContraseña', name: 'ctrl_cambiarContraseña')]
    public function ctrl_cambiarContraseña(EntityManagerInterface $entityManager, Request $request, UserPasswordHasherInterface $passwordEncoder)
    {

        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['id' => $request->request->get("idUsuario")]);

        $hashedPassword = $passwordEncoder->hashPassword($usuario, $request->request->get("nuevaClave"));
        $usuario->setClave($hashedPassword);
        $usuario->setCodigoRecuperacion("");
        $entityManager->persist($usuario);
        $entityManager->flush();
        return new Response("si");
    }

    #[Route('/compruebaCodigos', name: 'compruebaCodigos', methods: ['POST'])]
    public function compruebaCodigos(EntityManagerInterface $entityManager, Request $request)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['codigoRecuperacion' => $request->request->get("codigo")]);
        if ($usuario) {
            return new Response($usuario->getId());
        } else {
            return new Response("Errorazo");
        }
    }


    #[Route('/validarNomUsuario', name: 'validarNomUsuario', methods: ['POST'])]
    public function validarNomUsuario(EntityManagerInterface $entityManager, Request $request)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $request->request->get("usuario")]);
        if ($usuario) {
            return new Response(true);
        } else {
            return new Response(false);
        }
    }

    #[Route('/comprobarCorreoRegistrado', name: 'comprobarCorreoRegistrado', methods: ['POST'])]
    public function comprobarCorreoRegistrado(EntityManagerInterface $entityManager, Request $request)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['correo' => $request->request->get("correo")]);
        if ($usuario) {
            return new Response(true);
        } else {
            return new Response(false);
        }
    }
}
