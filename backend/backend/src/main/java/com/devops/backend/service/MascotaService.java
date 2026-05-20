package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.Mascota;
import com.devops.backend.repository.MascotaRepository;

@Service
public class MascotaService {

    @Autowired
    private MascotaRepository mascotaRepository;

    public List<Mascota> findAll() {
        return mascotaRepository.findAll();
    }

    public Optional<Mascota> findById(Integer id) {
        return mascotaRepository.findById(id);
    }

    public List<Mascota> findByUsuario(Integer idUsuario) {
        return mascotaRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public List<Mascota> findBySucursal(Integer idSucursal) {
        return mascotaRepository.findBySucursalIdSucursal(idSucursal);
    }

    public List<Mascota> findByEstatus(Integer estatus) {
        return mascotaRepository.findByEstatus(estatus);
    }

    public Mascota save(Mascota mascota) {
        return mascotaRepository.save(mascota);
    }

    public void deleteById(Integer id) {
        mascotaRepository.deleteById(id);
    }
}