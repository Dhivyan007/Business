package com.exportbusiness.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Vehicle name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Registration number is required")
    @Column(name = "registration_number", nullable = false, unique = true)
    private String registrationNumber;

    // Type: TRUCK, VAN, CAR, BIKE, OTHER
    @Column(nullable = false)
    private String type;

    private String model;

    private Integer year;

    // Status: ACTIVE, MAINTENANCE, INACTIVE
    @Column(nullable = false)
    private String status = "ACTIVE";

    private String notes;
}
