package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.Raza;
import com.devops.backend.repository.RazaRepository;

@Service
public class RazaService {

    @Autowired
    private RazaRepository razaRepository;

    public List<Raza> findAll() {
        return razaRepository.findAll();
    }

    public Optional<Raza> findById(Integer id) {
        return razaRepository.findById(id);
    }

    public List<Raza> findByEspecie(Integer idEspecie) {
        return razaRepository.findByEspecieIdEspecie(idEspecie);
    }

    public Raza save(Raza raza) {
        return razaRepository.save(raza);
    }

    public void deleteById(Integer id) {
        razaRepository.deleteById(id);
    }
}