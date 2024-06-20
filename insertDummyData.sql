-- Insert dummy data into Patient table
INSERT INTO Patient (Email, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI, googleId, givenName, familyName, profilePicture, Cart)
VALUES 
('john.doe@example.com', '1234567890', '1985-01-15', 'Male', '123 Main St', 50.00, NULL, 2000.00, 'google123', 'John', 'Doe', 'https://example.com/john.jpg', NULL),
('jane.smith@example.com', '0987654321', '1990-05-20', 'Female', '456 Elm St', 75.00, NULL, 3000.00, 'google456', 'Jane', 'Smith', 'https://example.com/jane.jpg', NULL),
('alice.jones@example.com', '1122334455', '1988-09-30', 'Female', '789 Maple St', 100.00, NULL, 2500.00, 'google789', 'Alice', 'Jones', 'https://example.com/alice.jpg', NULL);

-- Insert dummy data into Doctor table
INSERT INTO Doctor (Name, Email, Password, ContactNumber, DOB, Gender, Profession, resetPasswordCode, googleId, givenName, familyName, profilePicture)
VALUES 
('Dr. Gregory House', 'house@example.com', 'password123', '1234567891', '1960-06-11', 'Male', 'Diagnostics', NULL, 'google001', 'Gregory', 'House', 'https://example.com/house.jpg'),
('Dr. Meredith Grey', 'grey@example.com', 'password456', '0987654322', '1978-09-27', 'Female', 'General Surgery', NULL, 'google002', 'Meredith', 'Grey', 'https://example.com/grey.jpg'),
('Dr. John Watson', 'watson@example.com', 'password789', '1122334456', '1980-03-31', 'Male', 'Internal Medicine', NULL, 'google003', 'John', 'Watson', 'https://example.com/watson.jpg');

-- Insert dummy data into Medicine table
INSERT INTO Medicine (Name, Description, Price, RecommendedDosage, Image)
VALUES 
('Aspirin', 'Pain reliever and fever reducer', 5.00, '1-2 tablets every 4-6 hours', 'https://example.com/aspirin.jpg'),
('Ibuprofen', 'Nonsteroidal anti-inflammatory drug', 10.00, '1 tablet every 6-8 hours', 'https://example.com/ibuprofen.jpg'),
('Paracetamol', 'Pain reliever and fever reducer', 8.00, '1-2 tablets every 4-6 hours', 'https://example.com/paracetamol.jpg');

-- Insert dummy data into Appointment table
INSERT INTO Appointment (PatientID, DoctorID, endDateTime, PatientURL, HostRoomURL, IllnessDescription)
VALUES 
(1, 1, '2024-07-01 10:00:00', 'https://example.com/patient1', 'https://example.com/host1', 'Fever and headache'),
(2, 2, '2024-07-02 11:00:00', 'https://example.com/patient2', 'https://example.com/host2', 'Abdominal pain'),
(3, 3, '2024-07-03 12:00:00', 'https://example.com/patient3', 'https://example.com/host3', 'Back pain');

-- Insert dummy data into PatientMedicine table
INSERT INTO PatientMedicine (PatientID, MedicineID)
VALUES 
(1, 1),
(2, 2),
(3, 3);