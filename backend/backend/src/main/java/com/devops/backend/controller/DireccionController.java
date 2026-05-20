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

import com.devops.backend.model.Direccion;
import com.devops.backend.service.DireccionService;

@RestController
@RequestMapping("/api/direcciones")
@CrossOrigin(origins = "*")
public class DireccionController {

    @Autowired
    private DireccionService direccionService;

    @GetMapping
    public List<Direccion> getAll() {
        return direccionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Direccion> getById(@PathVariable Integer id) {
        return direccionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Direccion create(@RequestBody Direccion direccion) {
        return direccionService.save(direccion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Direccion> update(@PathVariable Integer id, @RequestBody Direccion direccion) {
        if (direccionService.findById(id).isPresent()) {
            direccion.setIdDireccion(id);
            return ResponseEntity.ok(direccionService.save(direccion));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (direccionService.findById(id).isPresent()) {
            direccionService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}