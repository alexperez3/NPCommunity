<?php

namespace App\Controller;

use App\Entity\Grupo_seguido;
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
use App\Entity\Producto;
use DateTime;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class Publicar extends AbstractController
{

    #[Route('/crearGrupo', name: 'crearGrupo')]
    public function crearGrupo(EntityManagerInterface $entityManager)
    {
        return $this->render('crearGrupo.html.twig');
    }

    #[Route('/crearProducto', name: 'crearProducto')]
    public function crearProducto(EntityManagerInterface $entityManager)
    {
        return $this->render('crearProducto.html.twig');
    }

    #[Route('/crearPost', name: 'crearPost')]
    public function crearPost(EntityManagerInterface $entityManager)
    {
        $gruposSeguidos = $entityManager->getRepository(Grupo_seguido::class)->findBy(['id_usuario' => $this->getUser()]);
        $gruposMios = $entityManager->getRepository(Grupo::class)->findBy(['id_usu_creador' => $this->getUser()]);
        $grupos=[];
        
        foreach ($gruposSeguidos as $grup) {
            $grupos[] = [
                'id' => $grup->getIdGrupo()->getId(),
                'nombre' => $grup->getIdGrupo()->getNombre(),
            ];
        }
        foreach ($gruposMios as $grup) {
            $grupos[] = [
                'id' => $grup->getId(),
                'nombre' => $grup->getNombre(),
            ];
        }

        return $this->render('crearPost.html.twig', ["gruposSeguidos" => $grupos]);
    }

    #[Route('/publicarProducto', name: 'publicarProducto')]
    public function publicarProducto(EntityManagerInterface $entityManager, Request $request)
    {

        $archivo = $request->files->get('foto');
        $nombre = $request->request->get('nombre');
        $descripcion = $request->request->get('descripcion');
        $precio = $request->request->get('precio');

        // guardar el archivo en la carpeta deseada
        $directorioDestino = $this->getParameter('kernel.project_dir') . '/public/fotos';
        $nombreArchivo = $archivo->getClientOriginalName();
        $archivo->move($directorioDestino, $nombreArchivo);

        // guardar la ruta del archivo en la base de datos
        $rutaArchivo = $nombreArchivo;
        $usuario = $this->getUser();

        $nuevoProducto = new Producto();
        $nuevoProducto->setIdUsuario($usuario);
        $nuevoProducto->setNombre($nombre);
        $nuevoProducto->setDescripcion($descripcion);
        $nuevoProducto->setPrecio($precio);
        $nuevoProducto->setFoto($rutaArchivo);

        $entityManager->persist($nuevoProducto);
        $entityManager->flush();
        return new Response($nuevoProducto->getId());
    }

    #[Route('/publicar_comentario', name: 'publicar_comentario', methods: ['POST'])]
    public function publicar_comentario(EntityManagerInterface $entityManager, Request $request)
    {
        $id_post = $request->request->get('id_post');
        $contenido_comentario = $request->request->get('comen');

        $post = $entityManager->getRepository(Post::class)->findOneBy(['id' => $id_post]);

        if (trim($contenido_comentario)) {
            $usuario = $this->getUser();
            $fechaActual = new DateTime();
            $nuevoComentario = new Comentario();
            $nuevoComentario->setContenido($contenido_comentario);
            $nuevoComentario->setIdPost($post);
            $nuevoComentario->setIdUsuario($usuario);
            $nuevoComentario->setFechaHora($fechaActual);
            $entityManager->persist($nuevoComentario);
            $entityManager->flush();
        }
        $respuesta[] = [
            'contenido' => $contenido_comentario,
            'fechaActual' => $fechaActual,
            'nomUsuario' => $usuario->getNomUsuario(),
            'fotoPerfil' => $usuario->getFotoPerfil(),
        ];
        $json_respuesta = json_encode($respuesta);
        return new Response($json_respuesta);
    }

    #[Route('/crearNuevoGrupo', name: 'crearNuevoGrupo')]
    public function crearNuevoGrupo(EntityManagerInterface $entityManager, Request $request)
    {
        $archivo = $request->files->get('foto');
        $nombre = $request->request->get('nombre');
        $descripcion = $request->request->get('descripcion');

        // guardar el archivo en la carpeta deseada
        $directorioDestino = $this->getParameter('kernel.project_dir') . '/public/fotos';
        $nombreArchivo = $archivo->getClientOriginalName();
        $archivo->move($directorioDestino, $nombreArchivo);

        // guardar la ruta del archivo en la base de datos
        $rutaArchivo = $nombreArchivo;
        $usuario = $this->getUser();

        $nuevoGrupo = new Grupo();
        $nuevoGrupo->setIdUsuCreador($usuario);
        $nuevoGrupo->setNombre($nombre);
        //Añadir cuando se ponga descripcion en la base de datos
        $nuevoGrupo->setDescripcion($descripcion);
        $nuevoGrupo->setFotoPerfil($rutaArchivo);

        $entityManager->persist($nuevoGrupo);
        $entityManager->flush();
        return new Response($nombre);
    }

    #[Route('/comprobarNombreGrupoNoExistente', name: 'comprobarNombreGrupoNoExistente')]
    public function comprobarNombreGrupoNoExistente(EntityManagerInterface $entityManager, Request $request)
    {

        $nombre = $request->request->get('nombre');
        $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['nombre' => $nombre]);

        if ($grupo) {
            return new Response("true");
        } else {
            return new Response("false");
        }
    }

    #[Route('/ponerFotoGrupo', name: 'ponerFotoGrupo')]
    public function ponerFotoGrupo(EntityManagerInterface $entityManager, Request $request)
    {
        $idGrupo = $request->request->get('idGrupo');
        $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['id' => $idGrupo]);
        if ($grupo) {
            return new Response($grupo->getFotoPerfil());
        } else {
            return new Response("");
        }
    }

    #[Route('/crearNuevoPost', name: 'crearNuevoPost')]
    public function crearNuevoPost(EntityManagerInterface $entityManager, Request $request)
    {

        $foto = $request->files->get('foto');
        $grupoID = $request->request->get('grupo');
        $contenido = $request->request->get('contenido');
        $archivo = $request->files->get('archivo');
        $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['id' => $grupoID]);

        if (isset($archivo)) {
            // guardar el archivo en la carpeta deseada
            $directorioDestino = $this->getParameter('kernel.project_dir') . '/public/fotos';
            $nombreArchivo = $archivo->getClientOriginalName();
            $archivo->move($directorioDestino, $nombreArchivo);

            // guardar la ruta del archivo en la base de datos
            $rutaArchivo = $nombreArchivo;
        } else {
            $rutaArchivo = "";
        }

        // guardar el archivo en la carpeta deseada
        $directorioDestino = $this->getParameter('kernel.project_dir') . '/public/fotos';
        $nombrefoto = $foto->getClientOriginalName();
        $foto->move($directorioDestino, $nombrefoto);

        // guardar la ruta del archivo en la base de datos
        $rutafoto = $nombrefoto;
        $usuario = $this->getUser();

        $nuevoPost = new Post();
        $nuevoPost->setIdUsuario($usuario);
        $nuevoPost->setIdGrupo($grupo);
        $nuevoPost->setContenido($contenido);
        $nuevoPost->setFoto($rutafoto);
        $nuevoPost->setArchivo($rutaArchivo);


        $entityManager->persist($nuevoPost);
        $entityManager->flush();
        return new Response($grupo->getNombre());
    }

    #[Route('/borrarGrupo/{id_grupo}', name: 'borrarGrupo')]
    public function borrarGrupo(EntityManagerInterface $entityManager, $id_grupo)
    {
        $grupo = $entityManager->getRepository(Grupo::class)->findOneBy(['id' => $id_grupo]);
        $entityManager->remove($grupo);
        $entityManager->flush();
        return new Response();
    }

    #[Route('/borrarProducto/{id_producto}', name: 'borrarProducto')]
    public function borrarProducto(EntityManagerInterface $entityManager, $id_producto)
    {
        $producto = $entityManager->getRepository(Producto::class)->findOneBy(['id' => $id_producto]);
        $entityManager->remove($producto);
        $entityManager->flush();
        return new Response();
    }
}
