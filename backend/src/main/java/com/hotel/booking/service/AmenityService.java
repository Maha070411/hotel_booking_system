package com.hotel.booking.service;

import com.hotel.booking.entity.Amenity;
import com.hotel.booking.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;

    public List<Amenity> getAllAmenities() {
        return amenityRepository.findAll();
    }
}
