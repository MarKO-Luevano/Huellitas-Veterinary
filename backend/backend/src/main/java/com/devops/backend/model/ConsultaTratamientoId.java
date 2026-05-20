package com.devops.backend.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class ConsultaTratamientoId implements Serializable {
    private Integer consultaMedica;
    private Integer tratamiento;
}