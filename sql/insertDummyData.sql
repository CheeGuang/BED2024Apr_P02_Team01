-- Insert dummy data into Patient table
INSERT INTO Patient (Email, ContactNumber, DOB, Gender, Address, eWalletAmount, resetPasswordCode, PCHI, googleId, givenName, familyName, profilePicture, Cart)
VALUES ('john.doe@example.com', '1234567890', '1980-01-01', 'Male', '123 Main St', 100.00, 'resetCode123', 1000.00, 'googleId123', 'John', 'Doe', 'profile.jpg', NULL);

-- Insert dummy data into Doctor table
INSERT INTO Doctor (Email, ContactNumber, DOB, Gender, Profession, resetPasswordCode, googleId, givenName, familyName, profilePicture)
VALUES ('dr.jane.smith@example.com', '0987654321', '1975-05-20', 'Female', 'General Practitioner', 'resetCode456', 'googleId456', 'Jane', 'Smith', 'profile.jpg');

-- Insert provided data into Medicine table
INSERT INTO Medicine (Name, Description, Price, RecommendedDosage, Image)
VALUES 
('Aspirin', 'Pain reliever and fever reducer.', 5.00, 'Take 1-2 tablets after meals, up to 4 times a day.', 'aspirin.jpg'),
('Ibuprofen', 'Nonsteroidal anti-inflammatory drug.', 10.00, 'Take 1 tablet after meals, up to 3 times a day.', 'ibuprofen.jpg'),
('Paracetamol', 'Pain reliever and fever reducer.', 8.00, 'Take 1-2 tablets after meals, up to 4 times a day.', 'paracetamol.jpg'),
('Acetaminophen', 'Pain reliever and fever reducer.', 6.00, 'Take 1-2 tablets after meals, up to 4 times a day.', 'acetaminophen.jpg'),
('Amoxicillin', 'Antibiotic.', 12.00, 'Take 1 tablet before meals, up to 3 times a day.', 'amoxicillin.jpg'),
('Metformin', 'Diabetes medication.', 15.00, 'Take 1 tablet before meals, up to 2 times a day.', 'metformin.jpg'),
('Lisinopril', 'Blood pressure medication.', 10.00, 'Take 1 tablet before meals, up to 1 time a day.', 'lisinopril.jpg'),
('Atorvastatin', 'Cholesterol-lowering medication.', 18.00, 'Take 1 tablet before meals, up to 1 time a day.', 'atorvastatin.jpg'),
('Sertraline', 'Antidepressant.', 20.00, 'Take 1 tablet after meals, up to 1 time a day.', 'sertraline.jpg'),
('Cetirizine', 'Antihistamine for allergy relief.', 7.00, 'Take 1 tablet after meals, up to 1 time a day.', 'cetirizine.jpg');

-- Insert dummy data into Appointment table
INSERT INTO Appointment (PatientID, DoctorID, endDateTime, PatientURL, HostRoomURL, IllnessDescription, Diagnosis, MCStartDate, MCEndDate, DoctorNotes)
VALUES (1, 1, '2024-06-25 09:00:00', 'http://patienturl.com', 'http://hostroomurl.com', 'Fever and headache', 'Common cold', '2024-06-25', '2024-06-27', 'Rest and stay hydrated.');

-- Insert dummy data into PatientMedicine table
INSERT INTO PatientMedicine (PatientID, MedicineID)
VALUES (1, 1);

-- Insert dummy data into AppointmentMedicine table
INSERT INTO AppointmentMedicine (AppointmentID, MedicineID)
VALUES (1, 1);