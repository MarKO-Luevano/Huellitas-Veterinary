package com.devops.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devops.backend.model.ConsultaMedica;
import com.devops.backend.service.ConsultaMedicaService;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultaMedicaController {

    @Autowired
    private ConsultaMedicaService consultaMedicaService;

    @GetMapping
    public List<ConsultaMedica> getAll() {
        return consultaMedicaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaMedica> getById(@PathVariable Integer id) {
        return consultaMedicaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cita/{idCita}")
public List<ConsultaMedica> getByCita(@PathVariable Integer idCita) {
    return consultaMedicaService.findByCita(idCita);
}

    @PostMapping
    public ConsultaMedica create(@RequestBody ConsultaMedica consultaMedica) {
        return consultaMedicaService.save(consultaMedica);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultaMedica> update(@PathVariable Integer id, @RequestBody ConsultaMedica consultaMedica) {
        if (consultaMedicaService.findById(id).isPresent()) {
            consultaMedica.setIdVisita(id);
            return ResponseEntity.ok(consultaMedicaService.save(consultaMedica));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (consultaMedicaService.findById(id).isPresent()) {
            consultaMedicaService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}