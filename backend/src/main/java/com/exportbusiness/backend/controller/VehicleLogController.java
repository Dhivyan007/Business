package com.exportbusiness.backend.controller;

import com.exportbusiness.backend.entity.Vehicle;
import com.exportbusiness.backend.entity.VehicleLog;
import com.exportbusiness.backend.repository.VehicleLogRepository;
import com.exportbusiness.backend.repository.VehicleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicle-logs")
public class VehicleLogController {

    @Autowired
    private VehicleLogRepository vehicleLogRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping
    public Page<VehicleLog> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return vehicleLogRepository.findAll(PageRequest.of(page, size, Sort.by("date").descending()));
    }

    @GetMapping("/by-vehicle/{vehicleId}")
    public List<VehicleLog> getByVehicle(@PathVariable Long vehicleId) {
        return vehicleLogRepository.findByVehicleIdOrderByDateDesc(vehicleId);
    }

    @GetMapping("/by-type")
    public List<VehicleLog> getByTypeAndDateRange(
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return vehicleLogRepository.findByTypeAndDateBetween(type, start, end);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleLog> getById(@PathVariable Long id) {
        return vehicleLogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody @Valid VehicleLog log) {
        if (log.getVehicle() == null || log.getVehicle().getId() == null) {
            return ResponseEntity.badRequest().body("Vehicle is required");
        }
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(log.getVehicle().getId());
        if (vehicleOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Vehicle not found");
        }
        log.setVehicle(vehicleOpt.get());
        vehicleLogRepository.save(log);
        return ResponseEntity.ok("Log saved successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleLog> update(@PathVariable Long id, @RequestBody @Valid VehicleLog log) {
        if (!vehicleLogRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        log.setId(id);
        return ResponseEntity.ok(vehicleLogRepository.save(log));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!vehicleLogRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vehicleLogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
