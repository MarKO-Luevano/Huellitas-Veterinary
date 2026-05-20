package com.devops.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "calle")
@Data
public class Calle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calle")
    private Integer idCalle;

    @Column(name = "nombre")
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "colonia_id_colonia")
    private Colonia colonia;
}