package com.hotel.booking.controller;

import com.hotel.booking.entity.Hotel;
import com.hotel.booking.service.HotelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HotelControllerTest {

    @Mock
    private HotelService hotelService;

    @InjectMocks
    private HotelController hotelController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetHotels_All() {
        // Arrange
        Hotel hotel = new Hotel();
        hotel.setName("Grand Plaza");
        when(hotelService.getAllHotels()).thenReturn(Collections.singletonList(hotel));

        // Act
        ResponseEntity<List<Hotel>> response = hotelController.getHotels(null, null, null, null, null, null, null);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals("Grand Plaza", response.getBody().get(0).getName());
    }

    @Test
    void testGetHotelById_Success() {
        // Arrange
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        when(hotelService.getHotelById(1L)).thenReturn(hotel);

        // Act
        ResponseEntity<Hotel> response = hotelController.getHotelById(1L);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testAddHotel_Success() {
        // Arrange
        Hotel hotel = new Hotel();
        hotel.setName("New Inn");
        when(hotelService.addHotel(any())).thenReturn(hotel);

        // Act
        ResponseEntity<Hotel> response = hotelController.addHotel(hotel);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals("New Inn", response.getBody().getName());
        verify(hotelService, times(1)).addHotel(any());
    }
}
