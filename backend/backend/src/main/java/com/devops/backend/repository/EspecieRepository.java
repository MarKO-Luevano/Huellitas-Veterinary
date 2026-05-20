package com.devops.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.Especie;

@Repository
public interface EspecieRepository extends JpaRepository<Especie, Integer> {
}