<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'notificacion')]

class Notificacion {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;

    #[ORM\Column(type: 'string', name: 'tipo')]
    private $tipo;

    #[ORM\Column(type: 'integer', name: 'id_tipo_not')]
    private $id_tipo_not;

    #[ORM\OneToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_emisor', referencedColumnName: 'id')]
    private $id_emisor;

    #[ORM\OneToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_receptor', referencedColumnName: 'id')]
    private $id_receptor;

    #[ORM\Column(type: 'datetime', name: 'fecha_hora')]
    private $fecha_hora;
    

    //GETTERS Y SETTERS
    public function getId() {
        return $this->id;
    }

    public function getTipo() {
        return $this->tipo;
    }

    public function setTipo($tipo) {
        $this->tipo = $tipo;
    }

    public function getIdTipoNot() {
        return $this->id_tipo_not;
    }
    
    public function setIdTipoNot($id_tipo_not) {
        $this->id_tipo_not = $id_tipo_not;
    }
    
    public function getIdEmisor() {
        return $this->id_emisor;
    }

    public function setIdEmisor($id_emisor) {
        $this->id_emisor = $id_emisor;
    }

    public function getIdReceptor() {
        return $this->id_receptor;
    }

    public function setIdReceptor($id_receptor) {
        $this->id_receptor = $id_receptor;
    }

    public function getFechaHora() {
        return $this->fecha_hora;
    }
    
    public function setFechaHora($fecha_hora) {
        $this->fecha_hora = $fecha_hora;
    }
}