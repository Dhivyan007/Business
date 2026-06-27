package com.exportbusiness.backend.controller;

import com.exportbusiness.backend.entity.Vehicle;
import com.exportbusiness.backend.repository.VehicleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    // GET all vehicles (paginated)
    @GetMapping
    public Page<Vehicle> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return vehicleRepository.findAll(PageRequest.of(page, size, Sort.by("name").ascending()));
    }

    // GET single vehicle
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getById(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET all active vehicles (for dropdowns)
    @GetMapping("/active")
    public List<Vehicle> getActive() {
        return vehicleRepository.findByStatus("ACTIVE");
    }

    // GET by type
    @GetMapping("/by-type/{type}")
    public List<Vehicle> getByType(@PathVariable String type) {
        return vehicleRepository.findByType(type);
    }

    // POST create vehicle
    @PostMapping
    public Vehicle create(@RequestBody @Valid Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    // PUT update vehicle
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@PathVariable Long id, @RequestBody @Valid Vehicle vehicle) {
        if (!vehicleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vehicle.setId(id);
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    // PATCH update status only
    @PatchMapping("/{id}/status")
    public ResponseEntity<Vehicle> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setStatus(status);
            return ResponseEntity.ok(vehicleRepository.save(vehicle));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!vehicleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vehicleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
