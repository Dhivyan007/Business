package com.exportbusiness.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle_logs")
@Data
public class VehicleLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    // Type: FUEL, MAINTENANCE, INSURANCE, TAX, OTHER
    @NotBlank(message = "Log type is required")
    @Column(nullable = false)
    private String type;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;

    // For fuel logs
    private BigDecimal litres;
    private Integer odometer;

    // For maintenance logs
    private String maintenanceType;

    private String notes;
}
