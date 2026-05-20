package com.devops.backend.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.ConsultaMedica;

@Repository
public interface ConsultaMedicaRepository extends JpaRepository<ConsultaMedica, Integer> {
    List<ConsultaMedica> findByCitaIdCita(Integer idCita);
}