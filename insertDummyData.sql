-- Insert dummy data into Patient table
INSERT INTO Patient (Name, Email, Password, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI)
VALUES 
('John Tan', 'john.tan@example.com', 'password123', '91234567', '1985-05-15', 'Male', '123 Orchard Road, Singapore', 100.50, NULL, 2000.00),
('Sarah Lim', 'sarah.lim@example.com', 'password123', '98765432', '1990-08-25', 'Female', '456 Bukit Timah Road, Singapore', 50.00, NULL, 1800.00);

-- Insert dummy data into Doctor table
INSERT INTO Doctor (Name, Email, Password, ContactNumber, DOB, Gender, Profession, resetPasswordCode)
VALUES 
('Dr. Lee Wei Ming', 'lee.weiming@example.com', 'password123', '92345678', '1975-03-10', 'Male', 'General Practitioner', NULL),
('Dr. Ng Mei Ling', 'ng.meiling@example.com', 'password123', '93456789', '1980-12-20', 'Female', 'Pediatrician', NULL);

-- Insert dummy data into Medicine table
INSERT INTO Medicine (Name, Description, Price, RecommendedDosage, Image)
VALUES 
('Paracetamol', 'Used to treat mild to moderate pain and reduce fever.', 5.00, '500mg every 4-6 hours', 'paracetamol.jpg'),
('Cough Syrup', 'Used to relieve cough and cold symptoms.', 8.50, '10ml every 6-8 hours', 'cough_syrup.jpg');

-- Insert dummy data into Appointment table
INSERT INTO Appointment (PatientID, DoctorID, endDateTime, PatientURL, HostRoomURL, illnessDescription)
VALUES 
(1, 1, '2024-06-15 14:00:00', 'http://example.com/patient1', 'http://example.com/hostroom1', 'Fever and headache'),
(2, 2, '2024-06-16 10:00:00', 'http://example.com/patient2', 'http://example.com/hostroom2', 'Cough and sore throat');

-- Select all rows from Patient table
SELECT * FROM Patient;

-- Select all rows from Doctor table
SELECT * FROM Doctor;

-- Select all rows from Medicine table
SELECT * FROM Medicine;

-- Select all rows from Appointment table
SELECT * FROM Appointment;