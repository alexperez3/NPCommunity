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

class PerfilUsu extends AbstractController
{

    #[Route('/usuGrupos/{usuarioBuscado?}', name: 'usuGrupos')]
    public function usuGrupos(EntityManagerInterface $entityManager, $usuarioBuscado)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $usuarioBuscado]);
        $arrGrupos = $entityManager->getRepository(Grupo::class)->findBy(['id_usu_creador' => $usuario]);
        $respuesta = [];
        $usuarioLogueado = $this->getUser();
        foreach ($arrGrupos as $grupo) {
            if ($grupo->getIdUsuCreador() == $usuarioLogueado) {
                $leSigue = 2;
            } else {
                $siguiendo = $entityManager->getRepository(Grupo_seguido::class)->findOneBy(['id_grupo' => $grupo->getId(), 'id_usuario' => $usuarioLogueado]);
                if ($siguiendo !== null) {
                    $leSigue = 1;
                } else {
                    $leSigue = 0;
                }
            }

            $respuesta[] = [
                'id' => $grupo->getId(),
                'nombre' => $grupo->getNombre(),
                'foto_perfil' => $grupo->getFotoPerfil(),
                'descripcion' => $grupo->getDescripcion(),
                'leSigue' => $leSigue,
            ];
        }

        $jsonResponse = json_encode($respuesta);
        return new Response($jsonResponse);
    }

    #[Route('/usuProductos/{usuarioBuscado?}', name: 'usuProductos')]
    public function usuProductos(EntityManagerInterface $entityManager, $usuarioBuscado)
    {

        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $usuarioBuscado]);
        $arrProductos = $entityManager->getRepository(Producto::class)->findBy(['id_usuario' => $usuario]);
        $respuesta = [];


        foreach ($arrProductos as $producto) {
            $respuesta[] = [
                'id' => $producto->getId(),
                'nombre' => $producto->getNombre(),
                'precio' => $producto->getPrecio(),
                'foto' => $producto->getFoto()
            ];
        }

        $jsonResponse = json_encode($respuesta);

        return new Response($jsonResponse);
    }

    #[Route('/usuPosts/{usuarioBuscado?}', name: 'usuPosts')]
    public function usuPosts(EntityManagerInterface $entityManager,$usuarioBuscado)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $usuarioBuscado]);

        $arrPosts = $entityManager->getRepository(Post::class)->findBy(['id_usuario' => $usuario], ['fecha_hora' => 'DESC']);
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