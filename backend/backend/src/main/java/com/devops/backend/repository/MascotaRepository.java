package com.devops.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devops.backend.model.Mascota;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Integer> {
    List<Mascota> findByUsuarioIdUsuario(Integer idUsuario);
    List<Mascota> findBySucursalIdSucursal(Integer idSucursal);
    List<Mascota> findByEstatus(Integer estatus);
}