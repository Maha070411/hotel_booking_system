package com.hotel.booking.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private Long roomId;
    private Long userId;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private Double totalPrice;
}
