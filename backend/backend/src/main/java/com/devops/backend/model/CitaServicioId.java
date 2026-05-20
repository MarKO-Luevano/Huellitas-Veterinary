package com.devops.backend.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class CitaServicioId implements Serializable {
    private Integer cita;
    private Integer servicio;
}