package com.devops.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "consulta_tratamiento")
@IdClass(ConsultaTratamientoId.class)
@Data
public class ConsultaTratamiento {

    @Id
    @ManyToOne
    @JoinColumn(name = "consulta_medica_id_visita")
    private ConsultaMedica consultaMedica;

    @Id
    @ManyToOne
    @JoinColumn(name = "tratamiento_id_tratamiento")
    private Tratamiento tratamiento;
}