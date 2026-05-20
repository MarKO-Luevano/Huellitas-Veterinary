package com.devops.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.Cita;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {
    List<Cita> findByUsuarioIdUsuario(Integer idUsuario);
    List<Cita> findByMascotaIdMascota(Integer idMascota);
    List<Cita> findBySucursalIdSucursal(Integer idSucursal);
    List<Cita> findByEstadoCita(String estadoCita);
}