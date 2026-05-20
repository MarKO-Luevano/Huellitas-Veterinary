package com.devops.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devops.backend.model.CitaServicio;
import com.devops.backend.model.CitaServicioId;
import com.devops.backend.service.CitaServicioService;

@RestController
@RequestMapping("/api/cita-servicios")
@CrossOrigin(origins = "*")
public class CitaServicioController {

    @Autowired
    private CitaServicioService citaServicioService;

    @GetMapping
    public List<CitaServicio> getAll() {
        return citaServicioService.findAll();
    }

    @GetMapping("/cita/{idCita}")
    public List<CitaServicio> getByCita(@PathVariable Integer idCita) {
        return citaServicioService.findByCita(idCita);
    }

    @PostMapping
    public CitaServicio create(@RequestBody CitaServicio citaServicio) {
        return citaServicioService.save(citaServicio);
    }

    @DeleteMapping("/cita/{idCita}/servicio/{idServicio}")
    public ResponseEntity<Void> delete(@PathVariable Integer idCita, @PathVariable Integer idServicio) {
        CitaServicioId id = new CitaServicioId();
        id.setCita(idCita);
        id.setServicio(idServicio);
        if (citaServicioService.findById(id).isPresent()) {
            citaServicioService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }
        return ResponseEntity.notFound().build();
    }
}