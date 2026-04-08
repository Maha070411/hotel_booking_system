package com.hotel.booking.service;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.Room;
import com.hotel.booking.entity.User;
import com.hotel.booking.exception.BadRequestException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.RoomRepository;
import com.hotel.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public Booking bookRoom(BookingRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        if (!bookingRepository.findOverlappingBookings(room.getId(), request.getCheckIn(), request.getCheckOut()).isEmpty()) {
            throw new BadRequestException("Room is not available for the selected dates!");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        long hours = java.time.Duration.between(request.getCheckIn(), request.getCheckOut()).toHours();
        double multiplier = Math.ceil(hours / 24.0);
        if (multiplier == 0) multiplier = 1;

        double basePrice = room.getPrice().doubleValue() * multiplier;
        List<Booking> existingBookings = bookingRepository.findByUserId(user.getId());
        double finalPrice = existingBookings.isEmpty() ? basePrice * 0.90 : basePrice;

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setUser(user);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setStatus("CONFIRMED");
        booking.setTotalPrice(finalPrice);

        Booking savedBooking = bookingRepository.save(booking);

        emailService.sendBookingConfirmation(user.getEmail(), user.getName(), room.getHotel().getName(), 
                savedBooking.getCheckIn().toString(), savedBooking.getCheckOut().toString());

        return savedBooking;
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
