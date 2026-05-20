package com.devops.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.Gestor;

@Repository
public interface GestorRepository extends JpaRepository<Gestor, Integer> {
    Optional<Gestor> findByUsuarioIdUsuario(Integer idUsuario);
}
