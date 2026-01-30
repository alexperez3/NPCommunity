<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Entity\Producto;
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
use App\Entity\Notificacion;
use App\Entity\Grupo_seguido;
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

class Notificaciones extends AbstractController {
    #[Route('/notificaciones', name: 'notificaciones')]
    public function notificaciones(EntityManagerInterface $entityManager) {
        return $this->render('notificaciones.html.twig');
    }

    #[Route('/nuevosMensajes', name:'nuevosMensajes', methods:['POST'])]
    public function nuevosMensajes(EntityManagerInterface $entityManager) {
        $usuarioLogueado = $this->getUser();
        $resultado = null;

        $notiMensNoLeidos = $entityManager->getRepository(Notificacion::class)->findBy(['tipo' => 'mensaje', 'id_receptor' => $usuarioLogueado]);

        foreach ($notiMensNoLeidos as $notiMens) {
            $infoMensaje = $entityManager->getRepository(Mensaje::class)->findOneBy(['id' => $notiMens->getIdTipoNot(), 'id_usu_receptor' => $usuarioLogueado]);
            $comprobarChat = $entityManager->getRepository(Chat::class)->findOneBy(['id' => $infoMensaje->getIdChat()]);

            if ($comprobarChat->getIdProducto() == null) {
                $resultado[] = [
                    'tipo' => $notiMens->getTipo(),
                    'idMensaje' => $infoMensaje->getId(),
                    'id_usu_receptor' => $notiMens->getIdReceptor()->getId(),
                    'nom_usu_receptor' => $notiMens->getIdReceptor()->getNomUsuario(),
                    'id_usu_emisor' => $infoMensaje->getIdEmisor()->getId(),
                    'nom_usu_emisor' => $infoMensaje->getIdEmisor()->getNomUsuario(),
                    'foto_perfil_emisor' => $infoMensaje->getIdEmisor()->getFotoPerfil(),
                    'fecha_hora' => $infoMensaje->getFechaHora()->format('Y-m-d H:i:s'),
                ];
            }
        }
        return new Response(json_encode($resultado));
    }

    #[Route('/nuevosSeguidores', name:'nuevosSeguidores', methods:['POST'])]
    public function nuevosSeguidores(EntityManagerInterface $entityManager) {
        $usuarioLogueado = $this->getUser();
        $resultado = [];

        $notiNuevoSeguidorGrupo = $entityManager->getRepository(Notificacion::class)->findBy(['tipo' =>'seguidor', 'id_receptor' => $usuarioLogueado]);

        foreach ($notiNuevoSeguidorGrupo as $notiNuevoSeguidor) {
            $infoGrupoSeguido = $entityManager->getRepository(Grupo_seguido::class)->findOneBy(['id' => $notiNuevoSeguidor->getIdTipoNot()]);

            $resultado[] = [
                'tipo' => $notiNuevoSeguidor->getTipo(),
                'idSeguimiento' => $infoGrupoSeguido->getId(),
                'nom_grupo_seguido' => $infoGrupoSeguido->getIdGrupo()->getNombre(),
                'id_seguidor' => $infoGrupoSeguido->getIdUsuario()->getId(),
                'nom_usu_seguidor' => $infoGrupoSeguido->getIdUsuario()->getNomUsuario(),
                'foto_perfil_seguidor' => $infoGrupoSeguido->getIdUsuario()->getFotoPerfil(),
                'fecha_hora' => $notiNuevoSeguidor->getFechaHora()->format('Y-m-d H:i:s'),
            ];
        }
        return new Response(json_encode($resultado));
    }

    #[Route('/nuevasRespuestas', name:'nuevasRespuestas', methods:['POST'])]
    public function nuevasRespuestas(EntityManagerInterface $entityManager) {
        $usuarioLogueado = $this->getUser();
        $resultado = [];

        $notiComentarioNoLeido = $entityManager->getRepository(Notificacion::class)->findBy(['tipo' => 'respuesta', 'id_receptor' => $usuarioLogueado]);

        foreach ($notiComentarioNoLeido as $notiComentario) {
            $infoComentario = $entityManager->getRepository(Comentario::class)->findOneBy(['id' => $notiComentario->getIdTipoNot()]);

            $resultado[] = [
                'tipo' => $notiComentario->getTipo(),
                'idComentario' => $infoComentario->getId(),
                'id_usu_comentador' => $infoComentario->getIdUsuario()->getId(),
                'nom_usu_comentador' => $infoComentario->getIdUsuario()->getNomUsuario(),
                'id_post_comentado' => $infoComentario->getIdPost()->getId(),
                'id_grupo_post_comentado' => $infoComentario->getIdPost()->getIdGrupo()->getId(),
                'nom_grupo_post_comentado' => $infoComentario->getIdPost()->getIdGrupo()->getNombre(),
                'foto_perfil_comentador' => $infoComentario->getIdUsuario()->getFotoPerfil(),
                'fecha_hora' => $infoComentario->getFechaHora()->format('Y-m-d H:i:s'),
            ];
        }
        return new Response(json_encode($resultado));
    }

    #[Route('/nuevasPublicaciones', name:'nuevasPublicaciones', methods:['POST'])]
    public function nuevasPublicaciones(EntityManagerInterface $entityManager) {
        $usuarioLogueado = $this->getUser();
        $resultado = [];

        $notiPubliNuevaNoLeida = $entityManager->getRepository(Notificacion::class)->findBy(['tipo' => 'publicacion', 'id_receptor' => $usuarioLogueado]);

        foreach ($notiPubliNuevaNoLeida as $notiPubliNueva) {
            $infoPublicacion = $entityManager->getRepository(Post::class)->findOneBy(['id' => $notiPubliNueva->getIdTipoNot()]);
            
            $resultado[] = [
                'tipo' => $notiPubliNueva->getTipo(),
                'idPublicacion' => $infoPublicacion->getId(),
                'id_usu_publicador' => $infoPublicacion->getIdUsuario()->getId(),
                'nom_usu_publicador' => $infoPublicacion->getIdUsuario()->getNomUsuario(),
                'id_grupo_post_publicado' => $infoPublicacion->getIdGrupo()->getId(),
                'nom_grupo_post_publicado' => $infoPublicacion->getIdGrupo()->getNombre(),
                'foto_perfil_publicador' => $infoPublicacion->getIdUsuario()->getFotoPerfil(),
                'fecha_hora' => $infoPublicacion->getFechaHora()->format('Y-m-d H:i:s'),
            ];
        }
        return new Response(json_encode($resultado));
    }
}