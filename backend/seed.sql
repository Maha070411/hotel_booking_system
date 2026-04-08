USE hotel_booking;

-- Create tables if they don't exist (Hibernate will handle DDL, but users can be seeded directly)
-- Seed users (BCrypt hash of "password123")
INSERT INTO users (name, email, password, role) VALUES 
  ('System Admin', 'admin@hotel.com', '$2a$10$N.kJGGNMCWOaWuW.sXv5/.DT5G/6zzl/z.WMmUX96lezFN8TrP7bq', 'ROLE_ADMIN'),
  ('srmaha07', 'srmaha07@gmail.com', '$2a$10$N.kJGGNMCWOaWuW.sXv5/.DT5G/6zzl/z.WMmUX96lezFN8TrP7bq', 'ROLE_USER'),
  ('sivaparthiban21', 'sivaparthiban21@gmail.com', '$2a$10$N.kJGGNMCWOaWuW.sXv5/.DT5G/6zzl/z.WMmUX96lezFN8TrP7bq', 'ROLE_USER'),
  ('chaithravtht', 'chaithravtht@gmail.com', '$2a$10$N.kJGGNMCWOaWuW.sXv5/.DT5G/6zzl/z.WMmUX96lezFN8TrP7bq', 'ROLE_USER'),
  ('sattiyugendrareddy', 'sattiyugendrareddy@gmail.com', '$2a$10$N.kJGGNMCWOaWuW.sXv5/.DT5G/6zzl/z.WMmUX96lezFN8TrP7bq', 'ROLE_USER')
ON DUPLICATE KEY UPDATE 
  password='$2a$10$N.kJGGNMCWOaWuW.sXv5/.DT5G/6zzl/z.WMmUX96lezFN8TrP7bq',
  role=VALUES(role);
