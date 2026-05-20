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

import com.devops.backend.model.Especie;
import com.devops.backend.service.EspecieService;

@RestController
@RequestMapping("/api/especies")
@CrossOrigin(origins = "*")
public class EspecieController {

    @Autowired
    private EspecieService especieService;

    @GetMapping
    public List<Especie> getAll() {
        return especieService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Especie> getById(@PathVariable Integer id) {
        return especieService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Especie create(@RequestBody Especie especie) {
        return especieService.save(especie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Especie> update(@PathVariable Integer id, @RequestBody Especie especie) {
        if (especieService.findById(id).isPresent()) {
            especie.setIdEspecie(id);
            return ResponseEntity.ok(especieService.save(especie));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (especieService.findById(id).isPresent()) {
            especieService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}