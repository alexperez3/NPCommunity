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

class Mensajes extends AbstractController
{
    #[Route('/mensajes', name: 'mensajes')]
    public function mensajes(EntityManagerInterface $entityManager)
    {
        $chats = $entityManager->getRepository(Usuario::class)->findBy(['emailValidado' => 1, 'baneado' => 0]);

        return $this->render('mensajes.html.twig', ['chats' => $chats]);
    }



    #[Route('/chat/{chatCon}', name: 'chat')]
    public function chat(EntityManagerInterface $entityManager, $chatCon)
    {

        $usuario = $this->getUser();
        $receptor = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $chatCon, 'baneado' => 0, 'emailValidado' => 1]);
        if ($receptor && $usuario->getNomUsuario() != $chatCon) {

            $chat = $entityManager->getRepository(Chat::class)->findOneBy(['id_usuario_1' => $receptor->getId(), 'id_usuario_2' => $usuario->getId(), 'id_producto' => null]);
            if (!$chat) {
                $chat = $entityManager->getRepository(Chat::class)->findOneBy(['id_usuario_1' => $usuario->getId(), 'id_usuario_2' => $receptor->getId(), 'id_producto' => null]);
            }
            $usuarioReceptor = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $chatCon]);
            if ($chat) {
                $mensajes = $entityManager->getRepository(Mensaje::class)->findBy(['id_chat' => $chat->getId()], ['fecha_hora' => 'ASC']);
                return $this->render('chat.html.twig', ['receptor' => $usuarioReceptor, 'chat' => $chat, 'mensajes' => $mensajes]);
            } else {
                return $this->render('chat.html.twig', ['receptor' => $usuarioReceptor, 'chat' => $chat, 'mensajes' => []]);
            }
        } else {
            return $this->redirectToRoute('mensajes');
        }
    }


    #[Route('/enviarMensaje', name: 'enviarMensaje')]
    public function enviarMensaje(EntityManagerInterface $entityManager, Request $request)
    {
        $texto = $request->request->get('texto');
        $receptor = $entityManager->getRepository(Usuario::class)->findOneBy(['nom_usuario' => $request->request->get('receptor')]);
        $emisor = $this->getUser();

        $chat = $entityManager->getRepository(Chat::class)->findOneBy(['id_usuario_1' => $receptor->getId(), 'id_usuario_2' => $emisor->getId(), 'id_producto' => null]);
        if (!$chat) {
            $chat = $entityManager->getRepository(Chat::class)->findOneBy(['id_usuario_1' => $emisor->getId(), 'id_usuario_2' => $receptor->getId(), 'id_producto' => null]);
        }

        if ($chat) {
            $nuevoMensaje = new Mensaje();
            $nuevoMensaje->setIdChat($chat);
            $nuevoMensaje->setIdEmisor($emisor);
            $nuevoMensaje->setIdReceptor($receptor);
            $nuevoMensaje->setContenido($texto);

            $entityManager->persist($nuevoMensaje);
            $entityManager->flush();
            return new Response($texto . "-" . $emisor->getFotoPerfil());
        } else {
            $nuevoChat = new Chat();
            $nuevoChat->setIdUsuario1($emisor);
            $nuevoChat->setIdUsuario2($receptor);
            $nuevoChat->setIdProducto(null);

            $entityManager->persist($nuevoChat);
            $entityManager->flush();

            $nuevoMensaje = new Mensaje();
            $nuevoMensaje->setIdChat($nuevoChat);
            $nuevoMensaje->setIdEmisor($emisor);
            $nuevoMensaje->setIdReceptor($receptor);
            $nuevoMensaje->setContenido($texto);

            $entityManager->persist($nuevoMensaje);
            $entityManager->flush();
            return new Response($texto . "-" . $emisor->getFotoPerfil());
        }
    }

    #[Route('/escribirMensajeProd', name: 'escribirMensajeProd')]
    public function escribirMensajeProd(EntityManagerInterface $entityManager, Request $request)
    {
        $idChat = $request->request->get('idChat');
        $mensajes = $entityManager->getRepository(Mensaje::class)->findBy(["id_chat" => $idChat], ['fecha_hora' => 'ASC']);
        $chat = $entityManager->getRepository(Chat::class)->findOneBy(["id" => $idChat]);
        $respuesta = [];

        foreach ($mensajes as $mensaje) {
            $respuesta[] = [
                'contenido' => $mensaje->getContenido(),
                'fotoPerfil' => $mensaje->getIdEmisor()->getFotoPerfil(),
                'emisor' => $mensaje->getIdEmisor()->getNomUsuario(),
                'propietario' => $this->getUser()->getNomUsuario(),
                'comprador' => $chat->getIdUsuario1()->getNomUsuario()
            ];
        }

        $json_respuesta = json_encode($respuesta);
        return new Response($json_respuesta);
    }

    #[Route('/enviarMensajeProd', name: 'enviarMensajeProd')]
    public function enviarMensajeProd(EntityManagerInterface $entityManager, Request $request)
    {
        $idChat = $request->request->get('idChat');
        $contenido = $request->request->get('contenido');
        $emisorNom = $request->request->get('emisor');
        $receptorNom = $request->request->get('receptor');


        $chat = $entityManager->getRepository(Chat::class)->findOneBy(["id" => $idChat]);
        $emisor = $entityManager->getRepository(Usuario::class)->findOneBy(["nom_usuario" => $emisorNom]);
        $receptor = $entityManager->getRepository(Usuario::class)->findOneBy(["nom_usuario" => $receptorNom]);

        if (!$chat) {

            $producto = $entityManager->getRepository(Producto::class)->findOneBy(["id" => $request->request->get('idProducto')]);

            $chat = new Chat();
            $chat->setIdUsuario1($emisor);
            $chat->setIdUsuario2($receptor);
            $chat->setIdProducto($producto);

            $entityManager->persist($chat);
            $entityManager->flush();
        }

        $nuevoMensaje = new Mensaje();
        $nuevoMensaje->setIdChat($chat);
        $nuevoMensaje->setIdEmisor($emisor);
        $nuevoMensaje->setIdReceptor($receptor);
        $nuevoMensaje->setContenido($contenido);

        $entityManager->persist($nuevoMensaje);
        $entityManager->flush();


        $respuesta[] = [
            'contenido' => $contenido,
            'fotoPerfil' => $emisor->getFotoPerfil(),
            'idChat' => $chat->getId()
        ];


        $json_respuesta = json_encode($respuesta);
        return new Response($json_respuesta);
    }

    #[Route('/obtenerDatosDelChat', name: 'obtenerDatosDelChat')]
    public function obtenerDatosDelChat(EntityManagerInterface $entityManager, Request $request)
    {
        $idProducto = $request->request->get('idProducto');
        $compradorNom = $request->request->get('comprador');
        $propietarioNom = $request->request->get('propietario');

        $producto = $entityManager->getRepository(Producto::class)->findOneBy(["id" => $idProducto]);
        $comprador = $entityManager->getRepository(Usuario::class)->findOneBy(["nom_usuario" => $compradorNom]);
        $propietario = $entityManager->getRepository(Usuario::class)->findOneBy(["nom_usuario" => $propietarioNom]);

        $chat = $entityManager->getRepository(Chat::class)->findOneBy(["id_usuario_1" => $comprador, 'id_usuario_2' => $propietario, 'id_producto' => $producto]);

        if ($chat) {
            $respuesta[] = [
                'comprador' => $compradorNom,
                'propietario' => $propietarioNom,
                'idChat' => $chat->getId(),
                'correoComprador' => $this->getUser()->getCorreo(),
                'producto' => $producto->getNombre(),
                'precio' => $producto->getPrecio(),
                'nombreComprador' => $this->getUser()->getNomUsuario(),

            ];
        } else {
            $respuesta[] = [
                'comprador' => $compradorNom,
                'propietario' => $propietarioNom,
                'idChat' => null,
                'correoComprador' => $this->getUser()->getCorreo(),
                'producto' => $producto->getNombre(),
                'precio' => $producto->getPrecio(),
                'nombreComprador' => $this->getUser()->getNomUsuario(),
            ];
        }
        $json_respuesta = json_encode($respuesta);
        return new Response($json_respuesta);
    }

    #[Route('/cambiarPrecio', name: 'cambiarPrecio')]
    public function cambiarPrecio(EntityManagerInterface $entityManager, Request $request)
    {
        $idProducto = $request->request->get('idProducto');
        $nuevoPrecio = $request->request->get('precio');

        $producto = $entityManager->getRepository(Producto::class)->findOneBy(["id" => $idProducto]);
        $producto->setPrecio($nuevoPrecio);

        $entityManager->persist($producto);
        $entityManager->flush();


        return new Response($nuevoPrecio);
    }

    #[Route('/mandarCorreoComprar', name: 'mandarCorreoComprar')]
    public function mandarCorreoComprar(EntityManagerInterface $entityManager,      Request $request, MailerInterface $mailer)
    {
        $correo = $request->request->get('correo');
        $precio = $request->request->get('precio');
        $tarjeta = $request->request->get('tarjeta');
        $comprador = $request->request->get('nombreComprador');
        $producto = $request->request->get('producto');

        $mensaje = '<body style="font-family: Arial, sans-serif; background-color: #08c4c2; padding: 0; margin-bottom: 150px;">
            <div style="max-width: 600px; margin: 50px auto 0; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 1px 20px 10px #000;">
                <h1 style="color: #333; text-align: center;">Detalles de la compra en NPCommunity</h1>
                <p style="color: #666; line-height: 1.5;">Estimado/a ' . $comprador . ',</p>
                <p style="color: #666; line-height: 1.5;">¡Gracias por tu compra en NPCommunity! Hemos recibido tu orden y estamos procesando los detalles de tu pedido.</p>
                <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin-top: 20px;">
                    <p style="color: #666; line-height: 1.5; margin-bottom: 10px;"><span style="font-weight: bold;">Nombre del Producto:</span> ' . $producto . '</p>
                    <p style="color: #666; line-height: 1.5; margin-bottom: 10px;"><span style="font-weight: bold;">Precio: </span>' . $precio . '€</p>
                    <p style="color: #666; line-height: 1.5; margin-bottom: 10px;"><span style="font-weight: bold;">Número de Tarjeta de Crédito:</span> ' . $tarjeta . '</p>
                </div>
                <p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
            </div>
            </body>';
        $email = (new Email())
            ->from('NPCommunity@email.com')
            ->to($correo)
            ->subject('Compra de un producto')
            ->html($mensaje);
        $mailer->send($email);

        $idProducto = $request->request->get("idProd");
        $producto = $entityManager->getRepository(Producto::class)->findOneBy(['id' => $idProducto]);
        $entityManager->remove($producto);
        $entityManager->flush();
        return new Response();

    }
}
