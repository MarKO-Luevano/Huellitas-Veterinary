package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.Cita;
import com.devops.backend.repository.CitaRepository;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    public List<Cita> findAll() {
        return citaRepository.findAll();
    }

    public Optional<Cita> findById(Integer id) {
        return citaRepository.findById(id);
    }

    public List<Cita> findByUsuario(Integer idUsuario) {
        return citaRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public List<Cita> findByMascota(Integer idMascota) {
        return citaRepository.findByMascotaIdMascota(idMascota);
    }

    public List<Cita> findBySucursal(Integer idSucursal) {
        return citaRepository.findBySucursalIdSucursal(idSucursal);
    }

    public List<Cita> findByEstado(String estadoCita) {
        return citaRepository.findByEstadoCita(estadoCita);
    }

    public Cita save(Cita cita) {
        return citaRepository.save(cita);
    }

    public void deleteById(Integer id) {
        citaRepository.deleteById(id);
    }
}