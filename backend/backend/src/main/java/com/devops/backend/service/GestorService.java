package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.Gestor;
import com.devops.backend.repository.GestorRepository;

@Service
public class GestorService {

    @Autowired
    private GestorRepository gestorRepository;

    public List<Gestor> findAll() {
        return gestorRepository.findAll();
    }

    public Optional<Gestor> findById(Integer id) {
        return gestorRepository.findById(id);
    }

    public Optional<Gestor> findByUsuario(Integer idUsuario) {
        return gestorRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public Gestor save(Gestor gestor) {
        return gestorRepository.save(gestor);
    }

    public void deleteById(Integer id) {
        gestorRepository.deleteById(id);
    }
}