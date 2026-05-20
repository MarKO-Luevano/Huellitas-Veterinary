package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.ConsultaMedica;
import com.devops.backend.repository.ConsultaMedicaRepository;

@Service
public class ConsultaMedicaService {

    @Autowired
    private ConsultaMedicaRepository consultaMedicaRepository;

    public List<ConsultaMedica> findAll() {
        return consultaMedicaRepository.findAll();
    }

    public Optional<ConsultaMedica> findById(Integer id) {
        return consultaMedicaRepository.findById(id);
    }

    public List<ConsultaMedica> findByCita(Integer idCita) {
    return consultaMedicaRepository.findByCitaIdCita(idCita);
    }

    public ConsultaMedica save(ConsultaMedica consultaMedica) {
        return consultaMedicaRepository.save(consultaMedica);
    }

    public void deleteById(Integer id) {
        consultaMedicaRepository.deleteById(id);
    }
}