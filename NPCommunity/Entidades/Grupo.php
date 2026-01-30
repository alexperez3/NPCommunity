<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'grupo')]

class Grupo {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;

    
    #[ORM\Column(type: 'string', name: 'nombre')]
    private $nombre;

    #[ORM\OneToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usu_creador', referencedColumnName: 'id')]
    private $id_usu_creador;
    
    #[ORM\Column(type: 'string', name: 'foto_perfil')]
    private $foto_perfil;

    #[ORM\Column(type: 'string', name: 'descripcion')]
    private $descripcion;


    //GETTERS Y SETTERS


    public function getId() {
        return $this->id;
    }
    
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    public function getNombre() {
        return $this->nombre;
    }

    public function setNombre($nombre) {
        $this->nombre = $nombre;
        return $this;
    }

    public function getIdUsuCreador() {
        return $this->id_usu_creador;
    }

    public function setIdUsuCreador($id_usu_creador) {
        $this->id_usu_creador = $id_usu_creador;
        return $this;
    }

    public function getFotoPerfil() {
        return $this->foto_perfil;
    }

    public function setFotoPerfil($foto_perfil) {
        $this->foto_perfil = $foto_perfil;
        return $this;
    }
     
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;

        return $this;
    }
}

