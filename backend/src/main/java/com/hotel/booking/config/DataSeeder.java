package com.hotel.booking.config;

import com.hotel.booking.entity.*;
import com.hotel.booking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedAmenities();
        seedHotelsAndRooms();
    }

    private void seedUsers() {
        User admin = userRepository.findByEmail("admin@hotel.com").orElse(new User());
        admin.setName("System Admin");
        admin.setEmail("admin@hotel.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        System.out.println("Seeded/Updated admin user: admin@hotel.com / admin123");

        List<String> userEmails = Arrays.asList(
            "srmaha07@gmail.com", 
            "sivaparthiban21@gmail.com", 
            "chaithravtht@gmail.com", 
            "sattiyugendrareddy@gmail.com"
        );

        for (String email : userEmails) {
            User user = userRepository.findByEmail(email).orElse(new User());
            String username = email.substring(0, email.indexOf('@'));
            user.setName(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(Role.USER);
            userRepository.save(user);
            System.out.println("Seeded/Updated user: " + email + " / password123");
        }
    }

    private void seedAmenities() {
        List<String> amenityNames = Arrays.asList(
            "Free WiFi", "Swimming Pool", "Fitness Center", "Restaurant", 
            "Room Service", "Free Parking", "Spa", "Mini Bar", "Air Conditioning"
        );

        for (String name : amenityNames) {
            if (amenityRepository.findByName(name).isEmpty()) {
                Amenity amenity = new Amenity();
                amenity.setName(name);
                amenityRepository.save(amenity);
            }
        }
    }

    private void seedHotelsAndRooms() {
        if (hotelRepository.count() == 0) {
            // Hotel 1: The Grand Plaza
            Hotel hotel1 = createHotel("The Grand Plaza", "New York, USA", 
                "A luxurious 5-star hotel in the heart of Manhattan with stunning city views.",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945");
            hotelRepository.save(hotel1);

            createRoom(hotel1, "Deluxe King Room", new BigDecimal("350.00"), 
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
                Arrays.asList("Free WiFi", "Air Conditioning", "Mini Bar", "Room Service"));
            
            createRoom(hotel1, "Executive Suite", new BigDecimal("650.00"), 
                "https://images.unsplash.com/photo-1590490360182-c33d57733427",
                Arrays.asList("Free WiFi", "Air Conditioning", "Mini Bar", "Room Service", "Spa", "Restaurant"));

            // Hotel 2: Seaside Resort & Spa
            Hotel hotel2 = createHotel("Seaside Resort & Spa", "Miami, Florida", 
                "A beautiful beachfront resort offering full spa services and private beach access.",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4");
            hotelRepository.save(hotel2);

            createRoom(hotel2, "Ocean View Queen", new BigDecimal("275.00"), 
                "https://images.unsplash.com/photo-1595576508898-0ad5c879a061",
                Arrays.asList("Free WiFi", "Air Conditioning", "Swimming Pool", "Free Parking"));
            
            createRoom(hotel2, "Beachfront Bungalow", new BigDecimal("450.00"), 
                "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
                Arrays.asList("Free WiFi", "Air Conditioning", "Swimming Pool", "Spa", "Restaurant", "Room Service"));

            // Hotel 3: Mountain View Lodge
            Hotel hotel3 = createHotel("Mountain View Lodge", "Aspen, Colorado", 
                "Cozy mountain retreat with direct ski-in/ski-out access and a warm fireplace in every lobby.",
                "https://images.unsplash.com/photo-1518732714860-b62714ce0c59");
            hotelRepository.save(hotel3);

            createRoom(hotel3, "Standard Double Room", new BigDecimal("180.00"), 
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
                Arrays.asList("Free WiFi", "Free Parking", "Fitness Center"));
            
            createRoom(hotel3, "Mountain Vista Suite", new BigDecimal("320.00"), 
                "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",
                Arrays.asList("Free WiFi", "Free Parking", "Fitness Center", "Restaurant", "Room Service", "Air Conditioning"));

            // Hotel 4: Urban Loft Hotel
            Hotel hotel4 = createHotel("Urban Loft Hotel", "London, UK", 
                "Modern, industrial-style boutique hotel located in the trendy Shoreditch area.",
                "https://images.unsplash.com/photo-1544124499-583bb5dddd6b");
            hotelRepository.save(hotel4);

            createRoom(hotel4, "Studio Loft", new BigDecimal("220.00"), 
                "https://images.unsplash.com/photo-1536376074432-cd424369ff19",
                Arrays.asList("Free WiFi", "Air Conditioning", "Fitness Center", "Mini Bar"));
            
            createRoom(hotel4, "Penthouse Loft", new BigDecimal("500.00"), 
                "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
                Arrays.asList("Free WiFi", "Air Conditioning", "Fitness Center", "Mini Bar", "Room Service", "Restaurant"));

            // Hotel 5: Zen Garden Retreat
            Hotel hotel5 = createHotel("Zen Garden Retreat", "Kyoto, Japan", 
                "A peaceful retreat featuring traditional architecture, serene gardens, and authentic tea ceremonies.",
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e");
            hotelRepository.save(hotel5);

            createRoom(hotel5, "Traditional Tatami Room", new BigDecimal("280.00"), 
                "https://images.unsplash.com/photo-1503174971373-b1f69850bded",
                Arrays.asList("Free WiFi", "Spa", "Restaurant", "Room Service"));
            
            createRoom(hotel5, "Deluxe Garden Suite", new BigDecimal("420.00"), 
                "https://images.unsplash.com/photo-1574643132329-315212fab2ff",
                Arrays.asList("Free WiFi", "Spa", "Restaurant", "Room Service", "Air Conditioning", "Swimming Pool"));

            System.out.println("Seeded 5 sample hotels and their respective rooms.");
        }
    }

    private Hotel createHotel(String name, String location, String description, String imageUrl) {
        Hotel hotel = new Hotel();
        hotel.setName(name);
        hotel.setLocation(location);
        hotel.setDescription(description);
        hotel.setImageUrl(imageUrl);
        return hotel;
    }

    private Room createRoom(Hotel hotel, String type, BigDecimal price, String imageUrl, List<String> amenityNames) {
        Room room = new Room();
        room.setHotel(hotel);
        room.setType(type);
        room.setPrice(price);
        room.setImageUrl(imageUrl);
        
        List<Amenity> amenities = new ArrayList<>();
        for (String aName : amenityNames) {
            amenityRepository.findByName(aName).ifPresent(amenities::add);
        }
        room.setAmenities(amenities);
        
        return roomRepository.save(room);
    }
}
