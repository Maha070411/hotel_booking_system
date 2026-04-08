package com.hotel.booking.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, UserRequestInfo> requestCounts = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 100; // per minute
    private static final long TIME_WINDOW_MS = 60000;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String clientIp = request.getRemoteAddr();
        long currentTime = System.currentTimeMillis();

        UserRequestInfo info = requestCounts.compute(clientIp, (ip, details) -> {
            if (details == null || (currentTime - details.startTime) > TIME_WINDOW_MS) {
                return new UserRequestInfo(currentTime, new AtomicInteger(1));
            }
            details.count.incrementAndGet();
            return details;
        });

        if (info.count.get() > MAX_REQUESTS) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Please try again after a minute.");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private static class UserRequestInfo {
        long startTime;
        AtomicInteger count;

        UserRequestInfo(long startTime, AtomicInteger count) {
            this.startTime = startTime;
            this.count = count;
        }
    }
}
