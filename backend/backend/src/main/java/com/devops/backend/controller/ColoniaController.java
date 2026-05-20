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

import com.devops.backend.model.Colonia;
import com.devops.backend.service.ColoniaService;

@RestController
@RequestMapping("/api/colonias")
@CrossOrigin(origins = "*")
public class ColoniaController {

    @Autowired
    private ColoniaService coloniaService;

    @GetMapping
    public List<Colonia> getAll() {
        return coloniaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Colonia> getById(@PathVariable Integer id) {
        return coloniaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ciudad/{idCiudad}")
    public List<Colonia> getByCiudad(@PathVariable Integer idCiudad) {
        return coloniaService.findByCiudad(idCiudad);
    }

    @PostMapping
    public Colonia create(@RequestBody Colonia colonia) {
        return coloniaService.save(colonia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Colonia> update(@PathVariable Integer id, @RequestBody Colonia colonia) {
        if (coloniaService.findById(id).isPresent()) {
            colonia.setIdColonia(id);
            return ResponseEntity.ok(coloniaService.save(colonia));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (coloniaService.findById(id).isPresent()) {
            coloniaService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}