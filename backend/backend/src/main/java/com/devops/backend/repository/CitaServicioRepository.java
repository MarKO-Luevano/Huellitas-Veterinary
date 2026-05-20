package com.devops.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.CitaServicio;
import com.devops.backend.model.CitaServicioId;

@Repository
public interface CitaServicioRepository extends JpaRepository<CitaServicio, CitaServicioId> {
    List<CitaServicio> findByCitaIdCita(Integer idCita);
}