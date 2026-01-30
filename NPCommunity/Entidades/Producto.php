<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'producto')]

class Producto {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;

    
    #[ORM\Column(type: 'string', name: 'nombre')]
    private $nombre;

    #[ORM\ManyToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usuario', referencedColumnName: 'id')]
    private $id_usuario;

    #[ORM\Column(type: 'string', name: 'descripcion')]
    private $descripcion;

    #[ORM\Column(type: 'string', name: 'precio')]
    private $precio;

    #[ORM\Column(type: 'string', name: 'foto')]
    private $foto;
    

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

    public function getIdUsuario() {
        return $this->id_usuario;
    }

    public function setIdUsuario($id_usuario) {
        $this->id_usuario = $id_usuario;
        return $this;
    }

    public function getDescripcion() {
        return $this->descripcion;
    }

    public function setDescripcion($descripcion) {
        $this->descripcion = $descripcion;
        return $this;
    }

    public function getPrecio() {
        return $this->precio;
    }

    public function setPrecio($precio) {
        $this->precio = $precio;
        return $this;
    }

    public function getFoto() {
        return $this->foto;
    }

    public function setFoto($foto){
        $this->foto = $foto;
        return $this;
    }
}
