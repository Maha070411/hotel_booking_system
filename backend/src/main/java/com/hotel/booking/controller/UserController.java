package com.hotel.booking.controller;

import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.entity.User;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        return ResponseEntity.ok(new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        ));
    }
}
