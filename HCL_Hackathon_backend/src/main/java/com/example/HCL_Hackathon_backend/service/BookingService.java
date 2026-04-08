package com.example.HCL_Hackathon_backend.service;

import com.example.HCL_Hackathon_backend.repository.RoomRepository;
import com.example.HCL_Hackathon_backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.HCL_Hackathon_backend.dto.BookingRequest;
import com.example.HCL_Hackathon_backend.entity.Room;
import com.example.HCL_Hackathon_backend.entity.User;
import org.springfraework.stereotype.Service;


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

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setUser(user);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setStatus("CONFIRMED");

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
}
