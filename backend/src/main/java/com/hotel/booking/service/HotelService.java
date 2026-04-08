package com.hotel.booking.service;

import com.hotel.booking.entity.Hotel;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.HotelRepository;
import com.hotel.booking.repository.HotelSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    public Hotel addHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> searchHotels(String query) {
        return hotelRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(query, query);
    }

    public List<Hotel> advancedSearch(String query, String location, LocalDate checkIn, LocalDate checkOut, BigDecimal minPrice, BigDecimal maxPrice, List<String> amenities) {
        return hotelRepository.findAll(HotelSpecifications.withFilters(query, location, checkIn, checkOut, minPrice, maxPrice, amenities));
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    public Hotel updateHotel(Long id, Hotel hotelDetails) {
        Hotel hotel = getHotelById(id);
        hotel.setName(hotelDetails.getName());
        hotel.setLocation(hotelDetails.getLocation());
        hotel.setDescription(hotelDetails.getDescription());
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }
}
