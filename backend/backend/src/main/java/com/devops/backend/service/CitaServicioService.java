package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.CitaServicio;
import com.devops.backend.model.CitaServicioId;
import com.devops.backend.repository.CitaServicioRepository;

@Service
public class CitaServicioService {

    @Autowired
    private CitaServicioRepository citaServicioRepository;

    public List<CitaServicio> findAll() {
        return citaServicioRepository.findAll();
    }

    public Optional<CitaServicio> findById(CitaServicioId id) {
        return citaServicioRepository.findById(id);
    }

    public List<CitaServicio> findByCita(Integer idCita) {
        return citaServicioRepository.findByCitaIdCita(idCita);
    }

    public CitaServicio save(CitaServicio citaServicio) {
        return citaServicioRepository.save(citaServicio);
    }

    public void deleteById(CitaServicioId id) {
        citaServicioRepository.deleteById(id);
    }
}