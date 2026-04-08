package com.example.HCL_Hackathon_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.HCL_Hackathon_backend.entity.Hotel;
import com.example.HCL_Hackathon_backend.entity.Room;
import com.example.HCL_Hackathon_backend.exception.ResourceNotFoundException;
import com.example.HCL_Hackathon_backend.repository.HotelRepository;
import com.example.HCL_Hackathon_backend.repository.RoomRepository;


import java.util.List;
@Service
@RequiredArgsConstructor

public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    public Room addRoom(Long hotelId, Room room) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
        room.setHotel(hotel);
        return roomRepository.save(room);
    }

    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }
}
