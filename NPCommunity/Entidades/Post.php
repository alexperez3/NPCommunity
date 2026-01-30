<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'post')]

class Post {
    //ATRIBUTOS
    #[ORM\Id]
    #[ORM\Column(type: 'integer', name: 'id')]
    #[ORM\GeneratedValue]
    private $id;

    
    #[ORM\ManyToOne(targetEntity: 'Usuario')]
    #[ORM\JoinColumn(name: 'id_usuario', referencedColumnName: 'id')]
    private $id_usuario;

    #[ORM\ManyToOne(targetEntity: 'Grupo')]
    #[ORM\JoinColumn(name: 'id_grupo', referencedColumnName: 'id')]
    private $id_grupo;

    #[ORM\Column(type: 'string', name: 'tipo')]
    private $tipo;

    #[ORM\Column(type: 'string', name: 'contenido')]
    private $contenido;

    #[ORM\Column(type: 'datetime', name: 'fecha_hora')]
    private $fecha_hora;

    #[ORM\Column(type: 'string', name: 'foto')]
    private $foto;

    #[ORM\Column(type: 'string', name: 'archivo')]
    private $archivo; 
    
    
    //GETTERS Y SETTERS
    public function getId() {
        return $this->id;
    }
    
    public function getIdUsuario() {
        return $this->id_usuario;
    }
    
    public function setIdUsuario($id_usuario) {
        $this->id_usuario = $id_usuario;
    }
    
    public function getIdGrupo() {
        return $this->id_grupo;
    }
    
    public function setIdGrupo($id_grupo) {
        $this->id_grupo = $id_grupo;
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
    
    public function getFoto() {
        return $this->foto;
    }
    
    public function setFoto($foto) {
        $this->foto = $foto;
    }
    
    public function getArchivo() {
        return $this->archivo;
    }
    
    public function setArchivo($archivo) {
        $this->archivo = $archivo;
    }

}
