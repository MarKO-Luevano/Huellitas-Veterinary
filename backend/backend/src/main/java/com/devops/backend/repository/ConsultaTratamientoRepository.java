package com.devops.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.ConsultaTratamiento;
import com.devops.backend.model.ConsultaTratamientoId;

@Repository
public interface ConsultaTratamientoRepository extends JpaRepository<ConsultaTratamiento, ConsultaTratamientoId> {
    List<ConsultaTratamiento> findByConsultaMedicaIdVisita(Integer idVisita);
}