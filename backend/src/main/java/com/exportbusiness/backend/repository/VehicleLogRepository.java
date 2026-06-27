package com.exportbusiness.backend.repository;

import com.exportbusiness.backend.entity.VehicleLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehicleLogRepository extends JpaRepository<VehicleLog, Long> {

    List<VehicleLog> findByVehicleIdOrderByDateDesc(Long vehicleId);

    List<VehicleLog> findByTypeAndDateBetween(String type, LocalDate start, LocalDate end);

    @Query("SELECT SUM(vl.amount) FROM VehicleLog vl WHERE vl.vehicle.id = :vehicleId AND vl.date BETWEEN :start AND :end")
    BigDecimal sumCostByVehicleAndDateRange(Long vehicleId, LocalDate start, LocalDate end);

    @Query("SELECT SUM(vl.amount) FROM VehicleLog vl WHERE vl.type = :type AND vl.date BETWEEN :start AND :end")
    BigDecimal sumByTypeAndDateRange(String type, LocalDate start, LocalDate end);
}
