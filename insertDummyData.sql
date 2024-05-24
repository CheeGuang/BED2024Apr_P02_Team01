-- Insert dummy data into Patient table
INSERT INTO Patient (PatientID, Name, Email, Password, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI)
VALUES 
(1, 'John Doe', 'johndoe@example.com', 'password123', '1234567890', '1980-01-01', 'Male', '123 Elm Street, Springfield', 100.00, 'reset123', 2500.00),
(2, 'Jane Smith', 'janesmith@example.com', 'password456', '0987654321', '1990-02-02', 'Female', '456 Oak Avenue, Metropolis', 150.50, 'reset456', 3000.00),
(3, 'Alice Johnson', 'alicej@example.com', 'password789', '1122334455', '2000-03-03', 'Female', '789 Pine Road, Gotham', 200.75, 'reset789', 3500.00);

-- Insert dummy data into Doctor table
INSERT INTO Doctor (DoctorID, Name, Email, Password, ContactNumber, DOB, Gender, Profession, resetPasswordCode)
VALUES 
(1, 'Dr. Robert Brown', 'robertbrown@example.com', 'doctor123', '2233445566', '1975-04-04', 'Male', 'Cardiologist', 'docreset123'),
(2, 'Dr. Emily Davis', 'emilydavis@example.com', 'doctor456', '3344556677', '1985-05-05', 'Female', 'Neurologist', 'docreset456'),
(3, 'Dr. Michael Wilson', 'michaelwilson@example.com', 'doctor789', '4455667788', '1995-06-06', 'Male', 'Dermatologist', 'docreset789');

-- Insert dummy data into Medicine table
INSERT INTO Medicine (MedicineID, Name, Description, Price, RecommendedDosage, Image)
VALUES 
(1, 'Paracetamol', 'Pain reliever and fever reducer', 5.00, '500 mg every 6 hours', 'paracetamol.png'),
(2, 'Amoxicillin', 'Antibiotic for bacterial infections', 10.00, '250 mg every 8 hours', 'amoxicillin.png'),
(3, 'Lisinopril', 'Treats high blood pressure', 15.00, '10 mg once daily', 'lisinopril.png');

-- Insert dummy data into Appointment table
INSERT INTO Appointment (AppointmentID, PatientID, DoctorID, endDateTime)
VALUES 
(1, 1, 1, '2024-06-01 10:00:00'),
(2, 2, 2, '2024-06-02 11:00:00'),
(3, 3, 3, '2024-06-03 12:00:00');