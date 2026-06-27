package com.exportbusiness.backend.controller;

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

@RestController
@RequestMapping("/api/vehicle-logs")
public class VehicleLogController {

    @Autowired
    private VehicleLogRepository vehicleLogRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    // GET all logs (paginated)
    @GetMapping
    public Page<VehicleLog> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return vehicleLogRepository.findAll(PageRequest.of(page, size, Sort.by("date").descending()));
    }

    // GET logs for a specific vehicle
    @GetMapping("/by-vehicle/{vehicleId}")
    public List<VehicleLog> getByVehicle(@PathVariable Long vehicleId) {
        return vehicleLogRepository.findByVehicleIdOrderByDateDesc(vehicleId);
    }

    // GET logs by type and date range (e.g. FUEL for last month)
    @GetMapping("/by-type")
    public List<VehicleLog> getByTypeAndDateRange(
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return vehicleLogRepository.findByTypeAndDateBetween(type, start, end);
    }

    // GET single log
    @GetMapping("/{id}")
    public ResponseEntity<VehicleLog> getById(@PathVariable Long id) {
        return vehicleLogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create log
    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid VehicleLog log) {
        if (log.getVehicle() == null || log.getVehicle().getId() == null) {
            return ResponseEntity.badRequest().body("Vehicle is required");
        }
        return vehicleRepository.findById(log.getVehicle().getId()).map(vehicle -> {
            log.setVehicle(vehicle);
            return ResponseEntity.ok(vehicleLogRepository.save(log));
        }).orElse(ResponseEntity.badRequest().body("Vehicle not found"));
    }

    // PUT update log
    @PutMapping("/{id}")
    public ResponseEntity<VehicleLog> update(@PathVariable Long id, @RequestBody @Valid VehicleLog log) {
        if (!vehicleLogRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        log.setId(id);
        return ResponseEntity.ok(vehicleLogRepository.save(log));
    }

    // DELETE log
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!vehicleLogRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vehicleLogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
