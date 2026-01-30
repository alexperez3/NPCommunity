<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Entity\Mensaje;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Usuario;
use App\Entity\Grupo;
use App\Entity\Post;
use App\Entity\Comentario;
use App\Entity\Producto;
use App\Entity\Grupo_seguido;

class Principal extends AbstractController
{
    #[Route('/principal', name: 'principal')]
    public function principal()
    {
        return $this->render('principal.html.twig');
    }

    #[Route('/busqueda', name: 'busqueda', methods: ['POST'])]
    public function busqueda(EntityManagerInterface $entityManager, Request $request)
    {
        $respuestaFinal = [];
        $respuestaUsuarios = [];
        $respuestaGrupos = [];
        $respuestaProductos = [];
        $producto = [];

        $usuario_busqueda = $request->request->get('usuario_busqueda');

        $arrUsuarios = $entityManager->getRepository(Usuario::class)->findBy(['emailValidado' => 1, 'baneado' => 0]);
        $arrGrupos = $entityManager->getRepository(Grupo::class)->findAll();
        $arrProductos = $entityManager->getRepository(Producto::class)->findAll();

        for ($i = 0; $i < count($arrUsuarios); $i++) {
            if ((str_starts_with(strtolower($arrUsuarios[$i]->getNomUsuario()), $usuario_busqueda) || str_starts_with(strtolower($arrUsuarios[$i]->getCorreo()), $usuario_busqueda)) && $usuario_busqueda != "") {
                array_push($respuestaUsuarios, $arrUsuarios[$i]->getNomUsuario());
            }
        }

        for ($i = 0; $i < count($arrGrupos); $i++) {
            if (str_starts_with(strtolower($arrGrupos[$i]->getNombre()), $usuario_busqueda) && $usuario_busqueda != "") {
                array_push($respuestaGrupos, $arrGrupos[$i]->getNombre());
            }
        }

        for ($i = 0; $i < count($arrProductos); $i++) {
            if (str_starts_with(strtolower($arrProductos[$i]->getNombre()), $usuario_busqueda) && $usuario_busqueda != "") {
                $producto = [
                    'id' => $arrProductos[$i]->getId(),
                    'nombre' => $arrProductos[$i]->getNombre(),
                    'nom_usuario' => $arrProductos[$i]->getIdUsuario()->getNomUsuario(),
                ];
                array_push($respuestaProductos, $producto);
            }
        }

        $respuestaFinal = [
            'usuarios' => $respuestaUsuarios,
            'grupos' => $respuestaGrupos,
            'productos' => $respuestaProductos,
        ];

        $json_respuesta = json_encode($respuestaFinal);
        return new Response($json_respuesta);
    }

    #[Route('/listarGrupos', name: 'ListarGrupos')]
    public function listarGrupos(EntityManagerInterface $entityManager)
    {
        $usuarioLogueado = $this->getUser();
        $arrGrupos = $entityManager->getRepository(Grupo::class)->findAll();
        $respuesta = [];

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

    #[Route('/infoGrupo/{nom_grupo?}', name: 'infoGrupo')]
    public function infoGrupo(EntityManagerInterface $entityManager, $nom_grupo)
    {
        $usuarioLogueado = $this->getUser();

        if ($nom_grupo == "" || $nom_grupo == null) {
            return $this->render('infoGrupo.html.twig', ['siguiendo' => 0, 'arrPosts' => 0, 'grupo' => 0, 'mensaje' => 2]);
        } else {
            $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['nombre' => $nom_grupo]);

            if ($grupo != null) {
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

                $arrPosts = $entityManager->getRepository(Post::class)->findBy(['id_grupo' => $grupo->getId()], ['fecha_hora' => 'desc']);
                $comentarios = $entityManager->getRepository(Comentario::class)->findAll();

                return $this->render('infoGrupo.html.twig', ['siguiendo' => $leSigue, 'arrPosts' => $arrPosts, 'grupo' => $grupo, 'mensaje' => 0, 'comentarios' => $comentarios]);
            } else {
                return $this->render('infoGrupo.html.twig', ['siguiendo' => 0, 'arrPosts' => 0, 'grupo' => 0, 'mensaje' => 1]);
            }
        }
    }

    #[Route('/listarProductos', name: 'listarProductos')]
    public function listarProductos(EntityManagerInterface $entityManager)
    {
        $arrProductos = $entityManager->getRepository(Producto::class)->findAll();

        if ($arrProductos != null) {
            $respuesta = [];

            foreach ($arrProductos as $producto) {
                if ($producto->getIdUsuario() == $this->getUser()) {
                    $respuesta[] = [
                        'id' => $producto->getId(),
                        'nombre' => $producto->getNombre(),
                        'precio' => $producto->getPrecio(),
                        'foto' => $producto->getFoto(),
                        'mio' => 1
                    ];
                } else {
                    $respuesta[] = [
                        'id' => $producto->getId(),
                        'nombre' => $producto->getNombre(),
                        'precio' => $producto->getPrecio(),
                        'foto' => $producto->getFoto(),
                        'mio' => 0
                    ];
                }
            }

            $jsonResponse = json_encode($respuesta);
        } else {
            $jsonResponse = null;
        }
        return new Response($jsonResponse);
    }

    #[Route('/infoProducto/{id_producto?}', name: 'infoProducto')]
    public function infoProducto(EntityManagerInterface $entityManager, $id_producto)
    {

        if ($id_producto == "" || $id_producto == null) {
            return $this->redirectToRoute('principal');
        } else {
            $producto = $entityManager->getRepository(Producto::class)->findOneBy(['id' => $id_producto]);
            if ($producto == null) {
                return $this->redirectToRoute('principal');
            } else {
                $usuarioLogueado = $this->getUser();
                if ($usuarioLogueado) {
                    $chatObj = $entityManager->getRepository(Chat::class)->findOneBy(['id_producto' => $producto, 'id_usuario_1' => $this->getUser()]);
                    if ($chatObj != null) {
                        $conversacion = $entityManager->getRepository(Mensaje::class)->findBy(['id_chat' => $chatObj]);
                        return $this->render('infoProducto.html.twig', ['producto' => $producto, 'conversacion' => $conversacion, 'error' => 0]);
                    } else {
                        $chatObj = $entityManager->getRepository(Chat::class)->findBy(['id_producto' => $producto]);
                        if ($chatObj != null) {
                            return $this->render('infoProducto.html.twig', ['producto' => $producto, 'todasConver' => $chatObj, 'error' => 0]);
                        }
                    }
                    return $this->render('infoProducto.html.twig', ['producto' => $producto, 'error' => 0]);
                }else{
                    return $this->render('infoProducto.html.twig', ['producto' => $producto, 'error' => 1]);
                }
            }
        }
    }

    #[Route('/gruposBusqueda/{nombre}', name: 'gruposBusqueda')]
    public function gruposBusqueda(EntityManagerInterface $entityManager, $nombre)
    {
        $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['nombre' => $nombre]);

        if ($grupo != null) {
            return $this->redirectToRoute('infoGrupo', ['nom_grupo' => $nombre]);
        }
    }

    #[Route('/perfilesBusqueda/{nombre}', name: 'perfilesBusqueda')]
    public function perfilesBusqueda(EntityManagerInterface $entityManager, $nombre)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $nombre]);


        if ($usuario != null) {
            if ($usuario == $this->getUser()) {
                return $this->redirectToRoute('perfil');
            } else {
                return $this->redirectToRoute('perfilUsuario', ['nom_usuario' => $nombre]);
            }
        }
    }

    #[Route('/perfilUsuario/{nom_usuario?}', name: 'perfilUsuario')]
    public function perfilUsuario(EntityManagerInterface $entityManager, $nom_usuario)
    {
        if ($nom_usuario == "" || $nom_usuario == null) {
            return $this->render('perfil_usuario.html.twig', ['usuario' => 0, 'arrPosts' => 0, 'error' => 2]);
        } else {
            $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $nom_usuario]);
            if ($usuario != null) {
                $arrPosts = $entityManager->getRepository(Post::class)->findBy(['id_usuario' => $usuario->getId()]);
                return $this->render('perfilUsuario.html.twig', ['usuario' => $usuario, 'arrPosts' => $arrPosts, 'error' => 0]);
            } else {
                return $this->render('perfilUsuario.html.twig', ['usuario' => 0, 'arrPosts' => 0, 'error' => 1]);
            }
        }
    }

    #[Route('/comentariosPorPost', name: 'comentariosPorPost', methods: ['POST'])]
    public function comentariosPorPost(EntityManagerInterface $entityManager, Request $request,)
    {
        $id_post = $request->request->get('idPost');

        $post = $entityManager->getRepository(Post::class)->findOneBy(['id' => $id_post]);
        $arrComentarios = $entityManager->getRepository(Comentario::class)->findBy(['id_post' => $id_post], ['fecha_hora' => 'DESC']);


        $sigueOnoSigue = $entityManager->getRepository(Grupo_seguido::class)->findOneBy(['id_usuario' => $this->getUser(), 'id_grupo' => $post->getIdGrupo()]);

        if ($sigueOnoSigue) {
            $sigueOnoSigue = true;
        } else {
            $grupoCreado = $entityManager->getRepository(Grupo::class)->findOneBy(['id_usu_creador' => $this->getUser(), 'id' => $post->getIdGrupo()]);
            if ($grupoCreado) {
                $sigueOnoSigue = true;
            } else {
                $sigueOnoSigue = false;
            }
        }

        if ($arrComentarios != null) {
            return $this->render('comentariosPorPost.html.twig', ['arrComentarios' => $arrComentarios, 'post' => $post, 'error' => 0, 'sigue' => $sigueOnoSigue]);
        } else {
            return $this->render('comentariosPorPost.html.twig', ['arrComentarios' => 0, 'post' => $post, 'error' => 1, 'sigue' => $sigueOnoSigue]);
        }
    }
}
