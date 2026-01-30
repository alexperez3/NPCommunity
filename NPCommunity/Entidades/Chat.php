<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'chat')]

class Chat {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;
    
    #[ORM\OneToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usuario_1', referencedColumnName: 'id')]
    private $id_usuario_1;
    
    #[ORM\OneToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usuario_2', referencedColumnName: 'id')]
    private $id_usuario_2;

    #[ORM\OneToOne(targetEntity: 'Producto')]
    #[ORM\JoinColumn(name: 'id_producto', referencedColumnName: 'id')]
    private $id_producto;


    //GETTERS Y SETTERS
    public function getId() {
        return $this->id;
    }

    public function getIdUsuario1() {
        return $this->id_usuario_1;
    }
    public function setIdUsuario1($id_usuario_1) {
        $this->id_usuario_1 = $id_usuario_1;
    }
    
    public function getIdUsuario2() {
        return $this->id_usuario_2;
    }
    
    public function setIdUsuario2($id_usuario_2) {
        $this->id_usuario_2 = $id_usuario_2;
    }
    
    public function getIdProducto() {
        return $this->id_producto;
    }
    
    public function setIdProducto($id_producto) {
        $this->id_producto = $id_producto;
    }
}

