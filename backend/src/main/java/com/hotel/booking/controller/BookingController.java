package com.hotel.booking.controller;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.User;
import com.hotel.booking.repository.UserRepository;
import com.hotel.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Management", description = "Endpoints for room bookings and history")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    @Operation(summary = "Book a room for the current user")
    public ResponseEntity<Booking> bookRoom(@RequestBody BookingRequest request) {
        request.setUserId(getCurrentUser().getId());
        return ResponseEntity.ok(bookingService.bookRoom(request));
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Retrieve all bookings for the authenticated user")
    public ResponseEntity<List<Booking>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getUserBookings(getCurrentUser().getId()));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an existing booking by ID")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}
