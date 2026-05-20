package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.Colonia;
import com.devops.backend.repository.ColoniaRepository;

@Service
public class ColoniaService {

    @Autowired
    private ColoniaRepository coloniaRepository;

    public List<Colonia> findAll() {
        return coloniaRepository.findAll();
    }

    public Optional<Colonia> findById(Integer id) {
        return coloniaRepository.findById(id);
    }

    public List<Colonia> findByCiudad(Integer idCiudad) {
        return coloniaRepository.findByCiudadIdCiudad(idCiudad);
    }

    public Colonia save(Colonia colonia) {
        return coloniaRepository.save(colonia);
    }

    public void deleteById(Integer id) {
        coloniaRepository.deleteById(id);
    }
}