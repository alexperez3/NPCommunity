<?php

namespace App\Controller;

use App\Entity\Producto;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Usuario;
use App\Entity\Comentario;
use App\Entity\Post;
use App\Entity\Grupo;
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


class ZonaAdmin extends AbstractController
{
    #[Route('/zonaAdmin', name: "zonaAdmin")]
    public function zonaAdmin(EntityManagerInterface $entityManager)
    {
        if ($this->getUser()) {
            if ($this->getUser()->getRol() == 1) {
                $usuarios = $entityManager->getRepository(Usuario::class)->findBy(['emailValidado' => 1, 'baneado' => 0, 'rol' => 0]);
                $usuariosBan = $entityManager->getRepository(Usuario::class)->findBy(['emailValidado' => 1, 'baneado' => 1, 'rol' => 0]);
                return $this->render('zonaAdmin.html.twig', ['usuarios' => $usuarios, "usuariosBan" => $usuariosBan]);
            } else {
                return $this->redirectToRoute('principal');
            }
        } else {
            return $this->redirectToRoute('login');
        }
    }

    #[Route('/mostrarUsuarios', name: "mostrarUsuarios")]
    public function mostrarUsuarios(EntityManagerInterface $entityManager, Request $request)
    {
        $usuarios = $entityManager->getRepository(Usuario::class)->findBy(['emailValidado' => 1, 'baneado' => 0, 'rol' => 0]);

        foreach ($usuarios as $usuario) {
            $respuesta[] = [
                'nombre' => $usuario->getNomUsuario(),
                'foto_perfil' => $usuario->getFotoPerfil(),
            ];
        }
        $jsonResponse = json_encode($respuesta);
        return new Response($jsonResponse);
    }

    #[Route('/banearUsuario', name: 'banearUsuario', methods: ['POST'])]
    public function banearUsuario(EntityManagerInterface $entityManager, Request $request)
    {
        $nomUsuario = $request->request->get('usuario');
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $nomUsuario]);
        $usuario->setBaneado("1");
        $entityManager->persist($usuario);
        $entityManager->flush();
        return new Response($nomUsuario);
    }

    #[Route('/desbanearUsuario', name: 'desbanearUsuario', methods: ['POST'])]
    public function desbanearUsuario(EntityManagerInterface $entityManager, Request $request)
    {
        $nomUsuario = $request->request->get('usuario');
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $nomUsuario]);
        $usuario->setBaneado("0");
        $entityManager->persist($usuario);
        $entityManager->flush();
        return new Response($nomUsuario);
    }

    #[Route('/eliminarUsuario', name: 'eliminarUsuario', methods: ['POST'])]
    public function eliminarUsuario(EntityManagerInterface $entityManager, Request $request)
    {
        $nomUsuario = $request->request->get('usuario');
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $nomUsuario]);
        $entityManager->remove($usuario);
        $entityManager->flush();
        return new Response($nomUsuario);
    }

    #[Route('/mostrarGrupos', name: "mostrarGrupos")]
    public function mostrarGrupos(EntityManagerInterface $entityManager)
    {
        $grupos = $entityManager->getRepository(Grupo::class)->findAll();
        $respuesta = [];

        foreach ($grupos as $grupo) {
            $respuesta[] = [
                'id' => $grupo->getId(),
                'nombre' => $grupo->getNombre(),
                'creador' => $grupo->getIdUsuCreador()->getNomUsuario(),
                'descripcion' => $grupo->getDescripcion(),
                'foto_perfil' => $grupo->getFotoPerfil(),
            ];
        }
        $jsonResponse = json_encode($respuesta);
        return new Response($jsonResponse);
    }

    #[Route('/eliminarGrupo', name: "eliminarGrupo")]
    public function eliminarGrupo(EntityManagerInterface $entityManager, Request $request)
    {
        $nombreGrupo = $request->request->get("grupo");
        $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['nombre' => $nombreGrupo]);
        $entityManager->remove($grupo);
        $entityManager->flush();
        return new Response($nombreGrupo);
    }

    #[Route('/mostrarPosts', name: "mostrarPosts")]
    public function mostrarPosts(EntityManagerInterface $entityManager)
    {
        $posts = $entityManager->getRepository(Post::class)->findBy([], ['fecha_hora' => 'DESC']);
        $respuesta = [];

        foreach ($posts as $post) {
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


    #[Route('/eliminarPost', name: "eliminarPost")]
    public function eliminarPost(EntityManagerInterface $entityManager, Request $request)
    {
        $idPost = $request->request->get("post");
        $post = $entityManager->getRepository(Post::class)->findOneBy(['id' => $idPost]);
        $entityManager->remove($post);
        $entityManager->flush();
        return new Response();
    }


    #[Route('/mostrarComentarios', name: "mostrarComentarios")]
    public function mostrarComentarios(EntityManagerInterface $entityManager)
    {
        $comentarios = $entityManager->getRepository(Comentario::class)->findBy([], ['fecha_hora' => 'DESC']);
        $respuesta = [];

        foreach ($comentarios as $comentario) {
            $respuesta[] = [
                'id' => $comentario->getId(),
                'contenido' => $comentario->getContenido(),
                'fechaActual' => $comentario->getFechaHora(),
                'nomUsuario' => $comentario->getIdUsuario()->getNomUsuario(),
                'fotoPerfil' => $comentario->getIdUsuario()->getFotoPerfil(),
            ];
        }
        $jsonResponse = json_encode($respuesta);
        return new Response($jsonResponse);
    }

    #[Route('/eliminarComentario', name: "eliminarComentario")]
    public function eliminarComentario(EntityManagerInterface $entityManager, Request $request)
    {
        $idComentario = $request->request->get("comentario");
        $comentario = $entityManager->getRepository(Comentario::class)->findOneBy(['id' => $idComentario]);
        $entityManager->remove($comentario);
        $entityManager->flush();
        return new Response();
    }

    #[Route('/mostrarProductos', name: "mostrarProductos")]
    public function mostrarProductos(EntityManagerInterface $entityManager)
    {
        $productos = $entityManager->getRepository(Producto::class)->findAll();
        $respuesta = [];

        foreach ($productos as $producto) {
            $respuesta[] = [
                'id' => $producto->getId(),
                'nombre' => $producto->getNombre(),
                'precio' => $producto->getPrecio(),
                'foto' => $producto->getFoto(),
            ];
        }
        $jsonResponse = json_encode($respuesta);
        return new Response($jsonResponse);
    }

    #[Route('/eliminarProducto', name: "eliminarProducto")]
    public function eliminarProducto(EntityManagerInterface $entityManager, Request $request)
    {
        $idProducto = $request->request->get("producto");
        $producto = $entityManager->getRepository(Producto::class)->findOneBy(['id' => $idProducto]);
        $entityManager->remove($producto);
        $entityManager->flush();
        return new Response();
    }
}
