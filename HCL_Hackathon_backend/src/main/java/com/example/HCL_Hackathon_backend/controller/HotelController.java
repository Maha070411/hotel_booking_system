package com.example.HCL_Hackathon_backend.controller;
import com.example.HCL_Hackathon_backend.entity.Hotel;
import com.example.HCL_Hackathon_backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Hotel Management", description = "Endpoints for searching and managing hotels")
public class HotelController {

    private final HotelService hotelService;

    @GetMapping("/hotels")
    @Operation(summary = "Get all hotels or search with filters")
    public ResponseEntity<List<Hotel>> getHotels(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) LocalDate checkIn,
            @RequestParam(required = false) LocalDate checkOut,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<String> amenities) {

        if (query != null || checkIn != null || checkOut != null || minPrice != null || maxPrice != null || (amenities != null && !amenities.isEmpty())) {
            return ResponseEntity.ok(hotelService.advancedSearch(query, checkIn, checkOut, minPrice, maxPrice, amenities));
        }
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/hotels/{id}")
    @Operation(summary = "Get hotel details by ID")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/hotels")
    public ResponseEntity<Hotel> addHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.addHotel(hotel));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/hotels/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotel));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }
}
