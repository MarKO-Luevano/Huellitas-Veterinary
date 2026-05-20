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

import com.devops.backend.model.Cita;
import com.devops.backend.service.CitaService;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @GetMapping
    public List<Cita> getAll() {
        return citaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cita> getById(@PathVariable Integer id) {
        return citaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Cita> getByUsuario(@PathVariable Integer idUsuario) {
        return citaService.findByUsuario(idUsuario);
    }

    @GetMapping("/mascota/{idMascota}")
    public List<Cita> getByMascota(@PathVariable Integer idMascota) {
        return citaService.findByMascota(idMascota);
    }

    @GetMapping("/sucursal/{idSucursal}")
    public List<Cita> getBySucursal(@PathVariable Integer idSucursal) {
        return citaService.findBySucursal(idSucursal);
    }

    @GetMapping("/estado/{estadoCita}")
    public List<Cita> getByEstado(@PathVariable String estadoCita) {
        return citaService.findByEstado(estadoCita);
    }

    @PostMapping
    public Cita create(@RequestBody Cita cita) {
        return citaService.save(cita);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cita> update(@PathVariable Integer id, @RequestBody Cita cita) {
        if (citaService.findById(id).isPresent()) {
            cita.setIdCita(id);
            return ResponseEntity.ok(citaService.save(cita));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (citaService.findById(id).isPresent()) {
            citaService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}