-- Insert dummy data into Patient table
INSERT INTO Patient (Name, Email, Password, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI)
VALUES 
('John Doe', 'john.doe@example.com', 'password123', '1234567890', '1980-01-01', 'Male', '123 Main St', 100.00, 'reset123', 5000.00),
('Jane Smith', 'jane.smith@example.com', 'password123', '0987654321', '1990-02-02', 'Female', '456 Elm St', 150.00, 'reset456', 6000.00),
('Jim Brown', 'jim.brown@example.com', 'password123', '1122334455', '1975-03-03', 'Male', '789 Oak St', 200.00, 'reset789', 7000.00);

-- Insert dummy data into Doctor table
INSERT INTO Doctor (Name, Email, Password, ContactNumber, DOB, Gender, Profession, resetPasswordCode)
VALUES 
('Dr. Alice Johnson', 'alice.johnson@hospital.com', 'password123', '1231231234', '1970-04-04', 'Female', 'Cardiologist', 'reset321'),
('Dr. Bob White', 'bob.white@clinic.com', 'password123', '2342342345', '1985-05-05', 'Male', 'Dermatologist', 'reset654'),
('Dr. Carol Green', 'carol.green@hospital.com', 'password123', '3453453456', '1995-06-06', 'Female', 'Neurologist', 'reset987');

-- Insert dummy data into Medicine table
INSERT INTO Medicine (Name, Description, Price, RecommendedDosage, Image)
VALUES 
('Paracetamol', 'Used to treat fever and mild to moderate pain.', 3.00, '2 pills/day', 'paracetamol.jpg'),
('Vitamin C', 'Maintains the health of skin, teeth, and blood vessels.', 5.00, '1 pill/day', 'vitamin_c.jpg'),
('Iron Tablets', 'Used to treat iron deficiency and anemia.', 8.00, '1 pill/day', 'iron_tablets.jpg');

-- Insert dummy data into Appointment table
INSERT INTO Appointment (PatientID, DoctorID, endDateTime, PatientURL, HostRoomURL, IllnessDescription)
VALUES 
(1, 1, '2024-07-01 10:00:00', 'http://patient1.com', 'http://hostroom1.com', 'Fever and headache'),
(2, 2, '2024-07-02 11:00:00', 'http://patient2.com', 'http://hostroom2.com', 'Skin rash'),
(3, 3, '2024-07-03 12:00:00', 'http://patient3.com', 'http://hostroom3.com', 'Migraine');

-- Insert dummy data into PatientMedicine table
INSERT INTO PatientMedicine (PatientID, MedicineID)
VALUES 
(1, 1),
(1, 2),
(2, 3),
(3, 1),
(3, 2);
