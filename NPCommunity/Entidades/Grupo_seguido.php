<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'grupo_seguido')]

class Grupo_seguido {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;
    
    #[ORM\ManyToOne(targetEntity: 'Grupo')]
    #[ORM\JoinColumn(name: 'id_grupo', referencedColumnName: 'id')]
    private $id_grupo;

    #[ORM\ManyToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usuario', referencedColumnName: 'id')]
    private $id_usuario;


    //GETTERS Y SETTERS
    public function getIdGrupo() {
        return $this->id_grupo;
    }

    public function setIdGrupo($id_grupo) {
        $this->id_grupo = $id_grupo;
    }
    
    public function getIdUsuario() {
        return $this->id_usuario;
    }

    public function setIdUsuario($id_usuario) {
        $this->id_usuario = $id_usuario;
    }

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }
}

