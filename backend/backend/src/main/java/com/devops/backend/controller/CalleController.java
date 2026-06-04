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

import com.devops.backend.model.Calle;
import com.devops.backend.service.CalleService;

@RestController
@RequestMapping("/api/calles")
@CrossOrigin(origins = "*")
public class CalleController {

    @Autowired
    private CalleService calleService;
 
    //xd
    @GetMapping
    public List<Calle> getAll() {
        return calleService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Calle> getById(@PathVariable Integer id) {
        return calleService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/colonia/{idColonia}")
    public List<Calle> getByColonia(@PathVariable Integer idColonia) {
        return calleService.findByColonia(idColonia);
    }

    @PostMapping
    public Calle create(@RequestBody Calle calle) {
        return calleService.save(calle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Calle> update(@PathVariable Integer id, @RequestBody Calle calle) {
        if (calleService.findById(id).isPresent()) {
            calle.setIdCalle(id);
            return ResponseEntity.ok(calleService.save(calle));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (calleService.findById(id).isPresent()) {
            calleService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}