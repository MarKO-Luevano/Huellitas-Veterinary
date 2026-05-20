package com.devops.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.Raza;

@Repository
public interface RazaRepository extends JpaRepository<Raza, Integer> {
    List<Raza> findByEspecieIdEspecie(Integer idEspecie);
}