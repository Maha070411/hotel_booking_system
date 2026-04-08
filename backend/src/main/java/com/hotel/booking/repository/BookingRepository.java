package com.hotel.booking.repository;

import com.hotel.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByRoomId(Long roomId);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND " +
           "(b.checkIn < :checkOut AND b.checkOut > :checkIn)")
    List<Booking> findOverlappingBookings(@Param("roomId") Long roomId, 
                                          @Param("checkIn") LocalDateTime checkIn, 
                                          @Param("checkOut") LocalDateTime checkOut);
}
