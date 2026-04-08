package com.hotel.booking.controller;

import com.hotel.booking.entity.Room;
import com.hotel.booking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SearchController {
    
    private final RoomRepository roomRepository;

    @GetMapping("/search")
    public ResponseEntity<List<Room>> searchRooms(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) LocalDate checkIn,
            @RequestParam(required = false) LocalDate checkOut,
            @RequestParam(required = false) BigDecimal price) {
        
        List<Room> rooms = roomRepository.findAll();
        
        return ResponseEntity.ok(rooms.stream().filter(r -> {
            boolean match = true;
            if (location != null && !location.isEmpty()) {
                match = r.getHotel().getLocation().toLowerCase().contains(location.toLowerCase());
            }
            if (price != null) {
                match = match && r.getPrice().compareTo(price) <= 0;
            }
            return match;
        }).collect(Collectors.toList()));
    }
}
