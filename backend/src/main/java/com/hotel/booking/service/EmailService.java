package com.hotel.booking.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendBookingConfirmation(String toEmail, String name, String hotelName, String checkIn, String checkOut) {
        // Email sending is disabled. To enable, configure spring.mail.* properties in application.properties.
        System.out.println("=== BOOKING CONFIRMATION ===");
        System.out.println("To:       " + toEmail);
        System.out.println("Guest:    " + name);
        System.out.println("Hotel:    " + hotelName);
        System.out.println("Check-in:  " + checkIn);
        System.out.println("Check-out: " + checkOut);
        System.out.println("============================");
    }
}
