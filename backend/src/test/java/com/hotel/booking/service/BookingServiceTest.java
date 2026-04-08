package com.hotel.booking.service;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.Hotel;
import com.hotel.booking.entity.Room;
import com.hotel.booking.entity.User;
import com.hotel.booking.exception.BadRequestException;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.RoomRepository;
import com.hotel.booking.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testBookRoomSuccess() {
        // Arrange
        BookingRequest request = new BookingRequest();
        request.setRoomId(1L);
        request.setUserId(1L);
        request.setCheckIn(LocalDateTime.now().plusDays(1));
        request.setCheckOut(LocalDateTime.now().plusDays(2));

        Room room = new Room();
        room.setId(1L);
        room.setPrice(new BigDecimal("200.00"));
        
        Hotel hotel = new Hotel();
        hotel.setName("Grand Plaza");
        room.setHotel(hotel);
        
        User user = new User();
        user.setId(1L);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookingRepository.findOverlappingBookings(anyLong(), any(), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Booking booking = bookingService.bookRoom(request);

        // Assert
        assertNotNull(booking);
        assertEquals("CONFIRMED", booking.getStatus());
        verify(bookingRepository, times(1)).save(any());
        verify(emailService, times(1)).sendBookingConfirmation(any(), any(), any(), any(), any());
    }

    @Test
    void testBookRoomOverlappingFails() {
        // Arrange
        BookingRequest request = new BookingRequest();
        request.setRoomId(1L);
        request.setCheckIn(LocalDateTime.now());
        request.setCheckOut(LocalDateTime.now().plusHours(5));

        Room room = new Room();
        room.setId(1L);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(bookingRepository.findOverlappingBookings(anyLong(), any(), any())).thenReturn(Collections.singletonList(new Booking()));

        // Act & Assert
        assertThrows(BadRequestException.class, () -> bookingService.bookRoom(request));
    }

    @Test
    void testGetUserBookings() {
        // Arrange
        when(bookingRepository.findByUserId(1L)).thenReturn(Collections.singletonList(new Booking()));

        // Act
        var bookings = bookingService.getUserBookings(1L);

        // Assert
        assertEquals(1, bookings.size());
        verify(bookingRepository, times(1)).findByUserId(1L);
    }
}
