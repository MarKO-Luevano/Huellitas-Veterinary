package com.devops.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devops.backend.model.ConsultaTratamiento;
import com.devops.backend.model.ConsultaTratamientoId;
import com.devops.backend.repository.ConsultaTratamientoRepository;

@Service
public class ConsultaTratamientoService {

    @Autowired
    private ConsultaTratamientoRepository consultaTratamientoRepository;

    public List<ConsultaTratamiento> findAll() {
        return consultaTratamientoRepository.findAll();
    }

    public Optional<ConsultaTratamiento> findById(ConsultaTratamientoId id) {
        return consultaTratamientoRepository.findById(id);
    }

    public List<ConsultaTratamiento> findByConsulta(Integer idVisita) {
        return consultaTratamientoRepository.findByConsultaMedicaIdVisita(idVisita);
    }

    public ConsultaTratamiento save(ConsultaTratamiento consultaTratamiento) {
        return consultaTratamientoRepository.save(consultaTratamiento);
    }

    public void deleteById(ConsultaTratamientoId id) {
        consultaTratamientoRepository.deleteById(id);
    }
}