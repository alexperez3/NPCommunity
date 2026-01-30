<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'comentario')]
class Comentario {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;

    #[ORM\ManyToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usuario', referencedColumnName: 'id')]
    private $id_usuario;

    #[ORM\ManyToOne(targetEntity: 'Post')]
    #[ORM\JoinColumn(name: 'id_post', referencedColumnName: 'id')]
    private $id_post;

    #[ORM\Column(type: 'string', name: 'tipo')]
    private $tipo;

    #[ORM\Column(type: 'string', name: 'contenido')]
    private $contenido;

    #[ORM\Column(type: 'datetime', name: 'fecha_hora')]
    private $fecha_hora;


    //GETTERS Y SETTERS
    public function getId() {
        return $this->id;
    }

    public function getIdUsuario()  {
        return $this->id_usuario;
    }

    public function setIdUsuario($id_usuario) {
        $this->id_usuario = $id_usuario;
    }

    public function getIdPost() {
        return $this->id_post;
    }

    public function setIdPost($id_post) {
        $this->id_post = $id_post;
    }

    public function getTipo() {
        return $this->tipo;
    }

    public function setTipo($tipo) {
        $this->tipo = $tipo;
    }

    public function getContenido() {
        return $this->contenido;
    }

    public function setContenido($contenido) {
        $this->contenido = $contenido;
    }

    public function getFechaHora() {
        return $this->fecha_hora;
    }

    public function setFechaHora($fecha_hora) {
        $this->fecha_hora = $fecha_hora;
    }
}
