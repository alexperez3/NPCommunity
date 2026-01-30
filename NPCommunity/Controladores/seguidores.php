<?php

namespace App\Controller;

use DateInterval;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Usuario;
use App\Entity\Grupo;
use App\Entity\Post;
use App\Entity\Comentario;
use DateTime;
use App\Entity\Grupo_seguido;

class seguidores extends AbstractController
{
    #[Route('/listarPosts', name: 'listarPosts')]
    public function listarPosts(EntityManagerInterface $entityManager)
    {
        $arrPosts = [];
        $usuarioLogueado = $this->getUser();
        $arrGupos = $entityManager->getRepository(Grupo_seguido::class)->findBy(['id_usuario' => $usuarioLogueado]);

        if ($arrGupos != null) { // yo sigo
            $arrPosts = [];
            $now = new DateTime(); // fecha y hora actual
            $interval = new DateInterval('P5D'); // ultimos 5 días
            $thresholdDate = $now->sub($interval); // fecha límite de hace 5 días

            foreach ($arrGupos as $grupo) {
                $arrPostGrupo = $entityManager->getRepository(Post::class)->findBy(['id_grupo' => $grupo->getIdGrupo()]);
                foreach ($arrPostGrupo as $postGrupo) {
                    $postDate = $postGrupo->getFechaHora();
                    if ($postDate >= $thresholdDate) { // posts de los ultimos 5 dias
                        $arrPosts[] = [
                            'id' => $postGrupo->getId(),
                            'contenido' => $postGrupo->getContenido(),
                            'fechaHora' => $postDate->format('H:i:s d-m-Y'),
                            'nomUsuario' => $postGrupo->getIdUsuario()->getNomUsuario(),
                            'fotoPerfilUsu' => $postGrupo->getIdUsuario()->getFotoPerfil(),
                            'nomGrupo' => $postGrupo->getIdGrupo()->getNombre(),
                            'fotoGrupo' => $postGrupo->getIdGrupo()->getFotoPerfil(),
                            'foto' => $postGrupo->getFoto(),
                            'archivo' => $postGrupo->getArchivo(),
                        ];
                    }
                }
            }
        }

        $arrGuposCreados = $entityManager->getRepository(Grupo::class)->findBy(['id_usu_creador' => $usuarioLogueado]);
        if ($arrGuposCreados != null) { //mis grupos
            foreach ($arrGuposCreados as $grupo) {
                $arrPostGrupo = $entityManager->getRepository(Post::class)->findBy(['id_grupo' => $grupo]);
                foreach ($arrPostGrupo as $postGrupo) {
                    $postDate = $postGrupo->getFechaHora();
                    if ($postDate >= $thresholdDate) { //  posts de los ultimos 5 dias
                        $arrPosts[] = [
                            'id' => $postGrupo->getId(),
                            'contenido' => $postGrupo->getContenido(),
                            'fechaHora' => $postDate->format('H:i:s d-m-Y'),
                            'nomUsuario' => $postGrupo->getIdUsuario()->getNomUsuario(),
                            'fotoPerfilUsu' => $postGrupo->getIdUsuario()->getFotoPerfil(),
                            'nomGrupo' => $postGrupo->getIdGrupo()->getNombre(),
                            'fotoGrupo' => $postGrupo->getIdGrupo()->getFotoPerfil(),

                            'foto' => $postGrupo->getFoto(),
                            'archivo' => $postGrupo->getArchivo(),
                        ];
                    }
                }
            }
        }

        if ($arrPosts != null) {
            usort($arrPosts, function ($a, $b) {
                $dateA = DateTime::createFromFormat('H:i:s d-m-Y', $a['fechaHora']);
                $dateB = DateTime::createFromFormat('H:i:s d-m-Y', $b['fechaHora']);
                return $dateB <=> $dateA; // El más reciente sea el primero
            });
            return new Response(json_encode($arrPosts));
        } else {
            return new Response(json_encode(""));
        }
    }

    #[Route('/comprobarSeguimiento/{idGrupo}', name: 'comprobarSeguimiento')]
    public function comprobarSeguimiento(EntityManagerInterface $entityManager, $idGrupo)
    {
        $usuarioLogueado = $this->getUser();
        $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['id' => $idGrupo]);

        if ($grupo->getIdUsuCreador() == $usuarioLogueado) {
            $leSigue = 3;
        } else {
            $siguiendo = $entityManager->getRepository(Grupo_seguido::class)->findOneBy(['id_grupo' => $grupo->getId(), 'id_usuario' => $usuarioLogueado]);
            if ($siguiendo !== null) {
                $leSigue = 2;
            } else {
                $leSigue = 1;
            }
        }

        return new Response($leSigue);
    }

    #[Route('/seguir/{idGrupo}', name: 'seguir')]
    public function seguir(EntityManagerInterface $entityManager, $idGrupo)
    {
        $usuarioLogueado = $this->getUser();
        if ($usuarioLogueado) {
            $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['id' => $idGrupo]);

            $follow = new Grupo_seguido();
            $follow->setIdUsuario($usuarioLogueado);
            $follow->setIdGrupo($grupo);

            $entityManager->persist($follow);
            $entityManager->flush();

            return new Response(true);
        } else {
            return new Response(false);
        }
    }

    #[Route('/dejarDeSeguir/{idGrupo}', name: 'dejarDeSeguir')]
    public function dejarDeSeguirPorAjax(EntityManagerInterface $entityManager, $idGrupo)
    {
        $usuarioLogueado = $this->getUser();
        $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['id' => $idGrupo]);

        $unfollow = $entityManager->getRepository(Grupo_seguido::class)->findOneBy(['id_usuario' => $usuarioLogueado, 'id_grupo' => $grupo->getId()]);
        $entityManager->remove($unfollow);
        $entityManager->flush();

        return new Response("");
    }
}
