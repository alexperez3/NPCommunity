<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'mensaje')]

class Mensaje {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;
    
    
    #[ORM\ManyToOne(targetEntity: 'Chat')]
    #[ORM\JoinColumn(name: 'id_chat', referencedColumnName: 'id')]
    private $id_chat;
    
    #[ORM\OneToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usu_emisor', referencedColumnName: 'id')]
    private $id_usu_emisor;

    #[ORM\OneToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usu_receptor', referencedColumnName: 'id')]
    private $id_usu_receptor;

    #[ORM\Column(type: 'text', name: 'contenido')]
    private $contenido;

    #[ORM\Column(type: 'datetime', name: 'fecha_hora')]
    private $fecha_hora;


    //GETTERS Y SETTERS
    public function getId() {
        return $this->id;
    }

    public function getIdChat()  {
        return $this->id_chat;
    }

    public function setIdChat($id_chat) {
        $this->id_chat = $id_chat;
    }

    public function getIdEmisor() {
        return $this->id_usu_emisor;
    }

    public function setIdEmisor($id_usu_emisor) {
        $this->id_usu_emisor = $id_usu_emisor;
    }

    public function getIdReceptor() {
        return $this->id_usu_receptor;
    }

    public function setIdReceptor($id_usu_receptor) {
        $this->id_usu_receptor = $id_usu_receptor;
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

