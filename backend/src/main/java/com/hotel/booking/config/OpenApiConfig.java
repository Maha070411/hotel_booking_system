package com.hotel.booking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hotel Booking System API")
                        .version("1.0")
                        .description("API documentation for the Hotel Booking System backend.")
                        .contact(new Contact()
                                .name("API Support")
                                .email("support@hotelbooking.com")));
    }
}
