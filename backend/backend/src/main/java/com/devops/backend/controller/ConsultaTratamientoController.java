package com.devops.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devops.backend.model.ConsultaTratamiento;
import com.devops.backend.model.ConsultaTratamientoId;
import com.devops.backend.service.ConsultaTratamientoService;

@RestController
@RequestMapping("/api/consulta_tratamientos")
@CrossOrigin(origins = "*")
public class ConsultaTratamientoController {

    @Autowired
    private ConsultaTratamientoService consultaTratamientoService;

    @GetMapping
    public List<ConsultaTratamiento> getAll() {
        return consultaTratamientoService.findAll();
    }

    @GetMapping("/consulta/{idVisita}")
    public List<ConsultaTratamiento> getByConsulta(@PathVariable Integer idVisita) {
        return consultaTratamientoService.findByConsulta(idVisita);
    }

    @PostMapping
    public ConsultaTratamiento create(@RequestBody ConsultaTratamiento consultaTratamiento) {
        return consultaTratamientoService.save(consultaTratamiento);
    }

    @DeleteMapping("/consulta/{idVisita}/tratamiento/{idTratamiento}")
    public ResponseEntity<Void> delete(@PathVariable Integer idVisita, @PathVariable Integer idTratamiento) {
        ConsultaTratamientoId id = new ConsultaTratamientoId();
        id.setConsultaMedica(idVisita);
        id.setTratamiento(idTratamiento);
        if (consultaTratamientoService.findById(id).isPresent()) {
            consultaTratamientoService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}