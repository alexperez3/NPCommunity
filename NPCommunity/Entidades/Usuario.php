<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\PasswordHasher\PasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity]
#[ORM\Table(name: 'usuario')]

class Usuario implements UserInterface, PasswordAuthenticatedUserInterface {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;

    
    #[ORM\Column(type: 'string', name: 'nom_usuario')]
    private $nom_usuario;

    #[ORM\Column(type: 'string', name: 'nombre')]
    private $nombre;

    #[ORM\Column(type: 'string', name: 'apellidos')]
    private $apellidos;

    #[ORM\Column(type: 'string', name: 'correo')]
    private $correo;

    #[ORM\Column(type: 'string', name: 'clave')]
    private $clave;

    #[ORM\Column(type: 'integer', name: 'emailValidado')]
    private $emailValidado;

    #[ORM\Column(type: 'integer', name: 'rol')]
    private $rol;

    #[ORM\Column(type: 'string', name: 'foto_perfil')]
    private $foto_perfil;

    #[ORM\Column(type: 'string', name: 'bio')]
    private $bio;

    #[ORM\Column(type: 'string', name: 'codigoRecuperacion')]
    private $codigoRecuperacion;

    #[ORM\Column(type: 'integer', name: 'baneado')]
    private $baneado;

    // #[ORM\Column(type: 'date', name: 'fecha')]
    // private $fecha;

    // #[ORM\Column(type: 'integer', name: 'codigoEliminarCuenta')]
    // private $codigoEliminarCuenta;



    //GETTERS Y SETTERS
    public function getRoles(): array {
        // admin
        if ($this->rol)
            return ['ROLE_USER', 'ROLE_ADMIN'];
        else
            return ['ROLE_USER'];
    }

    public function getPassword(): string {
        return $this->clave;
    }

    public function getUserIdentifier(): string {
        return $this->getNomUsuario();
    }

    public function getSalt(): ?string {
        return null;
    }

    public function eraseCredentials(): void {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
    //-------------------------------------------------------------

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    public function getNomUsuario() {
        return $this->nom_usuario;
    }

    public function setNomUsuario($nom_usuario) {
        $this->nom_usuario = $nom_usuario;
        return $this;
    }

    public function getNombre() {
        return $this->nombre;
    }

    public function setNombre($nombre) {
        $this->nombre = $nombre;
        return $this;
    }

    public function getApellidos() {
        return $this->apellidos;
    }

    public function setApellidos($apellidos) {
        $this->apellidos = $apellidos;
        return $this;
    }

    public function getCorreo() {
        return $this->correo;
    }

    public function setCorreo($correo) {
        $this->correo = $correo;
        return $this;
    }

    public function getClave() {
        return $this->clave;
    }

    public function setClave($clave) {
        $this->clave = $clave;
        return $this;
    }

    public function getEmailValidado() {
        return $this->emailValidado;
    }

    public function setEmailValidado($emailValidado) {
        $this->emailValidado = $emailValidado;
        return $this;
    }

    public function getRol() {
        return $this->rol;
    }

    public function setRol($rol) {
        $this->rol = $rol;
        return $this;
    }

    public function getFotoPerfil() {
        return $this->foto_perfil;
    }

    public function setFotoPerfil($foto_perfil) {
        $this->foto_perfil = $foto_perfil;
        return $this;
    }

    public function getBio() {
        return $this->bio;
    }

    public function setBio($bio) {
        $this->bio = $bio;
        return $this;
    }

    public function getCodigoRecuperacion() {
        return $this->codigoRecuperacion;
    }

    public function setCodigoRecuperacion($codigoRecuperacion) {
        $this->codigoRecuperacion = $codigoRecuperacion;
        return $this;
    }

    public function getBaneado() {
        return $this->baneado;
    }

    public function setBaneado($baneado) {
        $this->baneado = $baneado;
        return $this;
    }
}