package com.hotel.booking.controller;

import com.hotel.booking.entity.Room;
import com.hotel.booking.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getRoomsByHotel(@RequestParam Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotel(hotelId));
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/rooms")
    public ResponseEntity<Room> addRoom(@RequestParam Long hotelId, @RequestBody Room room) {
        return ResponseEntity.ok(roomService.addRoom(hotelId, room));
    }
}
