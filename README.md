# 🏨 Hotel Booking System

A premium, full-stack web application for seamless hotel discovery and booking. Built during a Hackathon with **Spring Boot** and **React**, featuring a modern UI/UX and robust backend logic.

![Hero Image](https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1440&h=600)

## ✨ Features

### 💻 Frontend (React + Vite)
- **Premium UI**: Modern, glassmorphic design system using Vanilla CSS.
- **Dynamic Search**: Real-time filtering by name, location, price, and amenities.
- **Interactive Map placeholders**: Simulated hotel discovery experience.
- **Booking Management**: View recent bookings and manage your profile.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop.

### ⚙️ Backend (Spring Boot)
- **Secure Authentication**: JWT-based login and registration system.
- **Role-Based Access**: Specialized views for Users and Administrators.
- **Availability Logic**: Intelligent validation to prevent overlapping bookings.
- **Automated Notifications**: Real-time email confirmations via JavaMailSender.
- **RESTful API**: Clean architecture with dedicated controllers, services, and DTOs.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios, Lucide Icons.
- **Backend**: Spring Boot 3.x, Spring Security, Spring Data JPA, Hibernate, MySQL.
- **Database**: MySQL 8.x.
- **Testing**: JUnit 5, Mockito.
- **Communication**: JavaMailSender (SMTP integration).

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js (v18+) & npm
- MySQL Server

### 1. Database Setup
Create a MySQL database named `hotel_booking`:
```sql
CREATE DATABASE hotel_booking;
```

### 2. Backend Configuration
Update `backend/src/main/resources/application.properties` with your credentials:
```properties
spring.datasource.username=YOUR_USER
spring.datasource.password=YOUR_PASSWORD
spring.mail.username=YOUR_GMAIL
spring.mail.password=YOUR_APP_PASSWORD
```

### 3. Run the Backend
```bash
cd backend
./mvnw.cmd spring-boot:run
```

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```text
HotelBookingSystem/
├── backend/            # Spring Boot Application
│   ├── src/main/java/  # Java Source Code
│   └── src/resources/  # Configuration & Assets
├── frontend/           # React Application
│   ├── src/components/ # Reusable UI Components
│   ├── src/pages/      # View Components
│   └── src/services/   # API Integration
└── README.md           # Documentation
```

## 🤝 Contributing
Feel free to fork this project, open issues, or submit pull requests to improve the system.

## 📄 License
This project is licensed under the MIT License.
