package com.example.HCL_Hackathon_backend.controller;
import com.example.HCL_Hackathon_backend.dto.BookingRequest;
import com.example.HCL_Hackathon_backend.entity.Booking;
import com.example.HCL_Hackathon_backend.entity.User;
import com.example.HCL_Hackathon_backend.repository.UserRepository;
import com.example.HCL_Hackathon_backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<Booking> bookRoom(@RequestBody BookingRequest request) {
        request.setUserId(getCurrentUser().getId());
        return ResponseEntity.ok(bookingService.bookRoom(request));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getUserBookings(getCurrentUser().getId()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}
