<?php

namespace App\Controller;

use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class Login extends AbstractController
{
    #[Route('/login', name: 'login')]
    public function index(AuthenticationUtils $authenticationUtils): Response
    {

        // Comprueba si hubo algún error
        $error = $authenticationUtils->getLastAuthenticationError();

        // Recupera el último nombre de usuario que se probó
        $lastUsername = $authenticationUtils->getLastUsername();
        // Renderizar el formulario de login


        return $this->render('login.html.twig', ['error' => $error, "last_username" => $lastUsername]);
    }

    #[Route('/logout', name: 'logout')]
    public function logout()
    {
        return new Response();
    }

    #[Route('/comprueba', name: "comprueba")]
    public function comprueba()
    {
        if ($this->getUser()->getEmailValidado() == 1) {
            return $this->redirectToRoute('principal');
        } else {
            return $this->redirectToRoute('logout', ["validarEmail" => true]);
        }
    }

}
