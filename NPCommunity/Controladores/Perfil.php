<?php

namespace App\Controller;

use App\Entity\Grupo_seguido;
use Proxies\__CG__\App\Entity\Producto;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Usuario;
use App\Entity\Grupo;

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

class Perfil extends AbstractController
{
    #[Route('/perfil', name: 'perfil')]
    public function perfil()
    {
        return $this->render('perfil.html.twig');
    }

    #[Route('/editarPerfil', name: 'editarPerfil')]
    public function editarPerfil()
    {
        return $this->render('editarPerfil.html.twig');
    }

    #[Route('/cambiarNombre', name: 'cambiarNombre')]
    public function cambiarNombre(EntityManagerInterface $entityManager, Request $request)
    {
        $entityManager->persist($this->getUser()->setNombre($request->request->get("nuevoNombre")));
        $entityManager->flush();
        return new Response("");
    }

    #[Route('/cambiarApellidos', name: 'cambiarApellidos')]
    public function cambiarApellidos(EntityManagerInterface $entityManager, Request $request)
    {
        $entityManager->persist($this->getUser()->setApellidos($request->request->get("nuevoApellido")));
        $entityManager->flush();
        return new Response("");
    }

    #[Route('/cambiarBio', name: 'cambiarBio')]
    public function cambiarBio(EntityManagerInterface $entityManager, Request $request)
    {
        $entityManager->persist($this->getUser()->setBio($request->request->get("nuevoBio")));
        $entityManager->flush();
        return new Response("");
    }

    #[Route('/cambiarCorreo', name: 'cambiarCorreo')]
    public function cambiarCorreo(EntityManagerInterface $entityManager, Request $request)
    {
        $entityManager->persist($this->getUser()->setCorreo($request->request->get("nuevoCorreo")));
        $entityManager->flush();
        return new Response("");
    }

    #[Route('/comprobarCorreo', name: 'comprobarCorreo')]
    public function comprobarCorreo(EntityManagerInterface $entityManager, Request $request)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['correo' => $request->request->get("nuevoCorreo")]);
        if ($usuario) {
            return new Response(true);
        } else {
            return new Response(false);
        }
    }

    #[Route('/cambiarNomUsuario', name: 'cambiarNomUsuario')]
    public function cambiarNomUsuario(EntityManagerInterface $entityManager, Request $request)
    {
        $entityManager->persist($this->getUser()->setNomUsuario($request->request->get("nuevoNomUsuario")));
        $entityManager->flush();
        return new Response("");
    }

    #[Route('/comprobarNomUsuario', name: 'comprobarNomUsuario')]
    public function comprobarNomUsuario(EntityManagerInterface $entityManager, Request $request)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $request->request->get("nuevoNomUsuario")]);
        if ($usuario) {
            return new Response(true);
        } else {
            return new Response(false);
        }
    }


    #[Route('/cambiarFotoPerfil', name: 'cambiarFotoPerfil')]
    public function cambiarFotoPerfil(EntityManagerInterface $entityManager, Request $request)
    {
        $archivo = $request->files->get('archivo');

        // Guardar el archivo en la carpeta deseada
        $directorioDestino = $this->getParameter('kernel.project_dir') . '/public/fotos';
        $nombreArchivo = $archivo->getClientOriginalName();
        $archivo->move($directorioDestino, $nombreArchivo);

        // Guardar la ruta del archivo en la base de datos
        $rutaArchivo = $nombreArchivo;
        $user = $this->getUser();
        $user->setFotoPerfil($rutaArchivo);

        $entityManager->persist($user);
        $entityManager->flush();
        return new Response($rutaArchivo);
    }

    #[Route('/guardar-archivo', name: 'guardar-archivo')]
    public function guardarArchivo(EntityManagerInterface $entityManager, Request $request): Response
    {
        $archivo = $request->files->get('archivo');

        // Guardar el archivo en la carpeta deseada
        $directorioDestino = $this->getParameter('kernel.project_dir') . '/public/fotos';
        $nombreArchivo = $archivo->getClientOriginalName();
        $archivo->move($directorioDestino, $nombreArchivo);

        // Guardar la ruta del archivo en la base de datos
        $rutaArchivo = $nombreArchivo;
        $user = $this->getUser();
        $user->setFotoPerfil($rutaArchivo);

        $entityManager->persist($user);
        $entityManager->flush();
        return new Response($rutaArchivo);
    }

    #[Route('/misGrupos', name: 'misGrupos')]
    public function misGrupos(EntityManagerInterface $entityManager)
    {
        $arrGrupos = $entityManager->getRepository(Grupo::class)->findAll();
        $respuesta = [];
        $usuario = $this->getUser();
        foreach ($arrGrupos as $grupo) {
            if ($usuario == $grupo->getIdUsuCreador()) {
                $respuesta[] = [
                    'id' => $grupo->getId(),
                    'nombre' => $grupo->getNombre(),
                    'foto_perfil' => $grupo->getFotoPerfil(),
                    'descripcion' => $grupo->getDescripcion()
                ];
            }
        }
        $jsonResponse = json_encode($respuesta);
        return new Response($jsonResponse);
    }

    #[Route('/misProductos', name: 'misProductos')]
    public function misProductos(EntityManagerInterface $entityManager)
    {
        $arrProductos = $entityManager->getRepository(Producto::class)->findAll();
        $respuesta = [];
        $usuario = $this->getUser();
        foreach ($arrProductos as $producto) {
            if ($usuario == $producto->getIdUsuario()) {

                $respuesta[] = [
                    'id' => $producto->getId(),
                    'nombre' => $producto->getNombre(),
                    'precio' => $producto->getPrecio(),
                    'foto' => $producto->getFoto()
                ];
            }
        }
        $jsonResponse = json_encode($respuesta);
        return new Response($jsonResponse);
    }

    #[Route('/misPosts', name: 'misPosts')]
    public function misPosts(EntityManagerInterface $entityManager)
    {

        $arrPosts = $entityManager->getRepository(Post::class)->findBy(['id_usuario' => $this->getUser()], ['fecha_hora' => 'DESC']);
        $respuesta = [];

        foreach ($arrPosts as $post) {
            $respuesta[] = [
                'id' => $post->getId(),
                'contenido' => $post->getContenido(),
                'fechaHora' => $post->getFechaHora()->format('H:i:s d-m-Y'),
                'nomUsuario' => $post->getIdUsuario()->getNomUsuario(),
                'fotoPerfilUsu' => $post->getIdUsuario()->getFotoPerfil(),
                'nomGrupo' => $post->getIdGrupo()->getNombre(),
                'fotoGrupo' => $post->getIdGrupo()->getFotoPerfil(),
                'foto' => $post->getFoto(),
                'archivo' => $post->getArchivo(),
            ];

        }
        $jsonResponse = json_encode($respuesta);
        return new Response($jsonResponse);
    }
}
