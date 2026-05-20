package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.Calle;
import com.devops.backend.repository.CalleRepository;

@Service
public class CalleService {

    @Autowired
    private CalleRepository calleRepository;

    public List<Calle> findAll() {
        return calleRepository.findAll();
    }

    public Optional<Calle> findById(Integer id) {
        return calleRepository.findById(id);
    }

    public List<Calle> findByColonia(Integer idColonia) {
        return calleRepository.findByColoniaIdColonia(idColonia);
    }

    public Calle save(Calle calle) {
        return calleRepository.save(calle);
    }

    public void deleteById(Integer id) {
        calleRepository.deleteById(id);
    }
}