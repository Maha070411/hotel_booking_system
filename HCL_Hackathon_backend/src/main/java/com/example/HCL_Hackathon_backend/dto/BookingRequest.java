package com.example.HCL_Hackathon_backend.dto;
import lombok.Data;
import java.time.LocalDate;
public class BookingRequest {
    private Long roomId;
    private Long userId;
    private LocalDate checkIn;
    private LocalDate checkOut;
}
