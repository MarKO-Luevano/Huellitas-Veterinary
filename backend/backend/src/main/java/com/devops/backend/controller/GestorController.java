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

import com.devops.backend.model.Gestor;
import com.devops.backend.service.GestorService;

@RestController
@RequestMapping("/api/gestores")
@CrossOrigin(origins = "*")
public class GestorController {

    @Autowired
    private GestorService gestorService;

    @GetMapping
    public List<Gestor> getAll() {
        return gestorService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gestor> getById(@PathVariable Integer id) {
        return gestorService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Gestor> getByUsuario(@PathVariable Integer idUsuario) {
        return gestorService.findByUsuario(idUsuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Gestor create(@RequestBody Gestor gestor) {
        return gestorService.save(gestor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gestor> update(@PathVariable Integer id, @RequestBody Gestor gestor) {
        if (gestorService.findById(id).isPresent()) {
            gestor.setIdGestor(id);
            return ResponseEntity.ok(gestorService.save(gestor));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (gestorService.findById(id).isPresent()) {
            gestorService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}