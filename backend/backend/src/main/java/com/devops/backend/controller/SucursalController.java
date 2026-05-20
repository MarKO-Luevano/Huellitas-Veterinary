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

import com.devops.backend.model.Sucursal;
import com.devops.backend.service.SucursalService;

@RestController
@RequestMapping("/api/sucursales")
@CrossOrigin(origins = "*")
public class SucursalController {

    @Autowired
    private SucursalService sucursalService;

    @GetMapping
    public List<Sucursal> getAll() {
        return sucursalService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sucursal> getById(@PathVariable Integer id) {
        return sucursalService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/gestor/{idGestor}")
    public ResponseEntity<Sucursal> getByGestor(@PathVariable Integer idGestor) {
        return sucursalService.findByGestor(idGestor)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Sucursal create(@RequestBody Sucursal sucursal) {
        return sucursalService.save(sucursal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sucursal> update(@PathVariable Integer id, @RequestBody Sucursal sucursal) {
        if (sucursalService.findById(id).isPresent()) {
            sucursal.setIdSucursal(id);
            return ResponseEntity.ok(sucursalService.save(sucursal));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (sucursalService.findById(id).isPresent()) {
            sucursalService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}