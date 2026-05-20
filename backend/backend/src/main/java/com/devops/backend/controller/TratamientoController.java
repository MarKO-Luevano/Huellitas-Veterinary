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

import com.devops.backend.model.Tratamiento;
import com.devops.backend.service.TratamientoService;

@RestController
@RequestMapping("/api/tratamientos")
@CrossOrigin(origins = "*")
public class TratamientoController {

    @Autowired
    private TratamientoService tratamientoService;

    @GetMapping
    public List<Tratamiento> getAll() {
        return tratamientoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tratamiento> getById(@PathVariable Integer id) {
        return tratamientoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tratamiento create(@RequestBody Tratamiento tratamiento) {
        return tratamientoService.save(tratamiento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tratamiento> update(@PathVariable Integer id, @RequestBody Tratamiento tratamiento) {
        if (tratamientoService.findById(id).isPresent()) {
            tratamiento.setIdTratamiento(id);
            return ResponseEntity.ok(tratamientoService.save(tratamiento));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (tratamientoService.findById(id).isPresent()) {
            tratamientoService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}