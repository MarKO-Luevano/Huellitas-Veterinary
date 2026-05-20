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

import com.devops.backend.model.Pais;
import com.devops.backend.service.PaisService;

@RestController
@RequestMapping("/api/paises")
@CrossOrigin(origins = "*")
public class PaisController {

    @Autowired
    private PaisService paisService;

    @GetMapping
    public List<Pais> getAll() {
        return paisService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pais> getById(@PathVariable Integer id) {
        return paisService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pais create(@RequestBody Pais pais) {
        return paisService.save(pais);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pais> update(@PathVariable Integer id, @RequestBody Pais pais) {
        if (paisService.findById(id).isPresent()) {
            pais.setIdPais(id);
            return ResponseEntity.ok(paisService.save(pais));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (paisService.findById(id).isPresent()) {
            paisService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}