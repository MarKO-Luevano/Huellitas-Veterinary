package com.devops.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.Colonia;

@Repository
public interface ColoniaRepository extends JpaRepository<Colonia, Integer> {
    List<Colonia> findByCiudadIdCiudad(Integer idCiudad);
}