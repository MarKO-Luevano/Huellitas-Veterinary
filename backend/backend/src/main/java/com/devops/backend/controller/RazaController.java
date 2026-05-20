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

import com.devops.backend.model.Raza;
import com.devops.backend.service.RazaService;

@RestController
@RequestMapping("/api/razas")
@CrossOrigin(origins = "*")
public class RazaController {

    @Autowired
    private RazaService razaService;

    @GetMapping
    public List<Raza> getAll() {
        return razaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Raza> getById(@PathVariable Integer id) {
        return razaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/especie/{idEspecie}")
    public List<Raza> getByEspecie(@PathVariable Integer idEspecie) {
        return razaService.findByEspecie(idEspecie);
    }

    @PostMapping
    public Raza create(@RequestBody Raza raza) {
        return razaService.save(raza);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Raza> update(@PathVariable Integer id, @RequestBody Raza raza) {
        if (razaService.findById(id).isPresent()) {
            raza.setIdRaza(id);
            return ResponseEntity.ok(razaService.save(raza));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (razaService.findById(id).isPresent()) {
            razaService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}