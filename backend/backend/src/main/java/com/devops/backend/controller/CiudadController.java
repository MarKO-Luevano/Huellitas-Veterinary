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

import com.devops.backend.model.Ciudad;
import com.devops.backend.service.CiudadService;

@RestController
@RequestMapping("/api/ciudades")
@CrossOrigin(origins = "*")
public class CiudadController {

    @Autowired
    private CiudadService ciudadService;

    @GetMapping
    public List<Ciudad> getAll() {
        return ciudadService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ciudad> getById(@PathVariable Integer id) {
        return ciudadService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{idEstado}")
    public List<Ciudad> getByEstado(@PathVariable Integer idEstado) {
        return ciudadService.findByEstado(idEstado);
    }

    @PostMapping
    public Ciudad create(@RequestBody Ciudad ciudad) {
        return ciudadService.save(ciudad);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ciudad> update(@PathVariable Integer id, @RequestBody Ciudad ciudad) {
        if (ciudadService.findById(id).isPresent()) {
            ciudad.setIdCiudad(id);
            return ResponseEntity.ok(ciudadService.save(ciudad));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (ciudadService.findById(id).isPresent()) {
            ciudadService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}