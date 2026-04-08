package com.hotel.booking.repository;

import com.hotel.booking.entity.Amenity;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.Hotel;
import com.hotel.booking.entity.Room;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class HotelSpecifications {

    public static Specification<Hotel> withFilters(String query, String location, LocalDate checkIn, LocalDate checkOut, BigDecimal minPrice, BigDecimal maxPrice, List<String> amenityNames) {
        return (Root<Hotel> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder cb) -> {
            Predicate predicate = cb.conjunction();
            Join<Hotel, Room> roomJoin = root.join("rooms", JoinType.INNER);

            if (query != null && !query.isEmpty()) {    
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%"));
            }

            if (location != null && !location.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(roomJoin.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(roomJoin.get("price"), maxPrice));
            }

            if (checkIn != null && checkOut != null) {
                Subquery<Long> subquery = criteriaQuery.subquery(Long.class);
                Root<Booking> bookingRoot = subquery.from(Booking.class);
                subquery.select(bookingRoot.get("room").get("id"));
                subquery.where(
                    cb.and(
                        cb.equal(bookingRoot.get("room").get("id"), roomJoin.get("id")),
                        cb.and(
                            cb.lessThan(bookingRoot.get("checkIn"), checkOut),
                            cb.greaterThan(bookingRoot.get("checkOut"), checkIn)
                        )
                    )
                );
                predicate = cb.and(predicate, cb.not(cb.exists(subquery)));
            }

            if (amenityNames != null && !amenityNames.isEmpty()) {
                Join<Room, Amenity> amenityJoin = roomJoin.join("amenities", JoinType.INNER);
                predicate = cb.and(predicate, amenityJoin.get("name").in(amenityNames));
            }

            criteriaQuery.distinct(true);
            return predicate;
        };
    }
}
