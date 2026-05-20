package com.devops.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.Calle;

@Repository
public interface CalleRepository extends JpaRepository<Calle, Integer> {
    List<Calle> findByColoniaIdColonia(Integer idColonia);
}