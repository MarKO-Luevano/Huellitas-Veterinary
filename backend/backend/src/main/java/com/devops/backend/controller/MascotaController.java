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

import com.devops.backend.model.Mascota;
import com.devops.backend.service.MascotaService;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = "*")
public class MascotaController {

    @Autowired
    private MascotaService mascotaService;

    @GetMapping
    public List<Mascota> getAll() {
        return mascotaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mascota> getById(@PathVariable Integer id) {
        return mascotaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Mascota> getByUsuario(@PathVariable Integer idUsuario) {
        return mascotaService.findByUsuario(idUsuario);
    }

    @GetMapping("/sucursal/{idSucursal}")
    public List<Mascota> getBySucursal(@PathVariable Integer idSucursal) {
        return mascotaService.findBySucursal(idSucursal);
    }

    @GetMapping("/estatus/{estatus}")
    public List<Mascota> getByEstatus(@PathVariable Integer estatus) {
        return mascotaService.findByEstatus(estatus);
    }

    @PostMapping
    public Mascota create(@RequestBody Mascota mascota) {
        return mascotaService.save(mascota);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mascota> update(@PathVariable Integer id, @RequestBody Mascota mascota) {
        if (mascotaService.findById(id).isPresent()) {
            mascota.setIdMascota(id);
            return ResponseEntity.ok(mascotaService.save(mascota));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (mascotaService.findById(id).isPresent()) {
            mascotaService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}