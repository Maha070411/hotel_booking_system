package com.hotel.booking.repository;

import com.hotel.booking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long>, JpaSpecificationExecutor<Hotel> {
    List<Hotel> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(String name, String location);
}
