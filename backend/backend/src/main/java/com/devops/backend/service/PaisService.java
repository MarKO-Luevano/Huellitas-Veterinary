package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.Pais;
import com.devops.backend.repository.PaisRepository;

@Service
public class PaisService {

    @Autowired
    private PaisRepository paisRepository;

    public List<Pais> findAll() {
        return paisRepository.findAll();
    }

    public Optional<Pais> findById(Integer id) {
        return paisRepository.findById(id);
    }

    public Pais save(Pais pais) {
        return paisRepository.save(pais);
    }

    public void deleteById(Integer id) {
        paisRepository.deleteById(id);
    }
}