package com.devops.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "cita_servicio")
@IdClass(CitaServicioId.class)
@Data
public class CitaServicio {

    @Id
    @ManyToOne
    @JoinColumn(name = "cita_id_cita")
    private Cita cita;

    @Id
    @ManyToOne
    @JoinColumn(name = "servicio_id_servicio")
    private Servicio servicio;
}