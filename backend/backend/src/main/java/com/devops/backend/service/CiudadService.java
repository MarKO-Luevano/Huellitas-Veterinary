package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.Ciudad;
import com.devops.backend.repository.CiudadRepository;

@Service
public class CiudadService {

    @Autowired
    private CiudadRepository ciudadRepository;

    public List<Ciudad> findAll() {
        return ciudadRepository.findAll();
    }

    public Optional<Ciudad> findById(Integer id) {
        return ciudadRepository.findById(id);
    }

    public List<Ciudad> findByEstado(Integer idEstado) {
        return ciudadRepository.findByEstadoIdEstado(idEstado);
    }

    public Ciudad save(Ciudad ciudad) {
        return ciudadRepository.save(ciudad);
    }

    public void deleteById(Integer id) {
        ciudadRepository.deleteById(id);
    }
}