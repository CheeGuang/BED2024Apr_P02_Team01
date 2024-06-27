-- Drop tables if they exist
IF OBJECT_ID('dbo.Appointment', 'U') IS NOT NULL
    DROP TABLE dbo.Appointment;

IF OBJECT_ID('dbo.PatientMedicine', 'U') IS NOT NULL
    DROP TABLE dbo.PatientMedicine;

IF OBJECT_ID('dbo.Medicine', 'U') IS NOT NULL
    DROP TABLE dbo.Medicine;

IF OBJECT_ID('dbo.Doctor', 'U') IS NOT NULL
    DROP TABLE dbo.Doctor;

IF OBJECT_ID('dbo.Patient', 'U') IS NOT NULL
    DROP TABLE dbo.Patient;

IF OBJECT_ID('dbo.AppointmentMedicine', 'U') IS NOT NULL
    DROP TABLE dbo.AppointmentMedicine;

IF OBJECT_ID('dbo.ChatHistory', 'U') IS NOT NULL
    DROP TABLE dbo.ChatHistory;

-- Create Patient table
CREATE TABLE Patient (
    PatientID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) UNIQUE,
    ContactNumber NVARCHAR(15),
    DOB DATE,
    Gender NVARCHAR(10),
    Address NVARCHAR(255),
    eWalletAmount DECIMAL(10, 2),
    resetPasswordCode NVARCHAR(100),
    PCHI DECIMAL(10, 2), -- Per Capita Household Income
    googleId NVARCHAR(100) UNIQUE,
    givenName NVARCHAR(100),
    familyName NVARCHAR(100),
    profilePicture NVARCHAR(255),
    Cart NVARCHAR(MAX)
);

-- Create Doctor table
CREATE TABLE Doctor (
    DoctorID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) UNIQUE,
    ContactNumber NVARCHAR(15),
    DOB DATE,
    Gender NVARCHAR(10),
    Profession NVARCHAR(100),
    resetPasswordCode NVARCHAR(100),
    googleId NVARCHAR(100) UNIQUE,
    givenName NVARCHAR(100),
    familyName NVARCHAR(100),
    profilePicture NVARCHAR(255)
);

-- Create Medicine table
CREATE TABLE Medicine (
    MedicineID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100),
    Description NVARCHAR(255),
    Price DECIMAL(10, 2),
    RecommendedDosage NVARCHAR(100),
    Image NVARCHAR(255)
);

-- Create Appointment table
CREATE TABLE Appointment (
    AppointmentID INT IDENTITY(1,1) PRIMARY KEY,
    PatientID INT,
    DoctorID INT,
    endDateTime DATETIME,
    PatientURL NVARCHAR(1000),
    HostRoomURL NVARCHAR(1000),
    IllnessDescription NVARCHAR(255),
    Diagnosis NVARCHAR(255),
    MCStartDate DATE,
    MCEndDate DATE,
    DoctorNotes NVARCHAR(MAX),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);

-- Create PatientMedicine junction table
CREATE TABLE PatientMedicine (
    PatientMedicineID INT IDENTITY(1,1) PRIMARY KEY,
    PatientID INT,
    MedicineID INT,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (MedicineID) REFERENCES Medicine(MedicineID)
);

-- Create AppointmentMedicine junction table
CREATE TABLE AppointmentMedicine (
    AppointmentMedicineID INT IDENTITY(1,1) PRIMARY KEY,
    AppointmentID INT,
    MedicineID INT,
    FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID),
    FOREIGN KEY (MedicineID) REFERENCES Medicine(MedicineID)
);

-- Create ChatHistory table
CREATE TABLE ChatHistory (
    ChatSessionID UNIQUEIDENTIFIER,
    PatientID INT,
    Sender VARCHAR(10),
    Message NVARCHAR(MAX),
    Timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID)
);


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
VALUES (1, 1), (1, 2), (1, 3);

-- Insert dummy data into AppointmentMedicine table
INSERT INTO AppointmentMedicine (AppointmentID, MedicineID)
VALUES (1, 1), (1, 2), (1, 3);


-- Select all data from Patient table
SELECT * FROM Patient;

-- Select all data from Doctor table
SELECT * FROM Doctor;

-- Select all data from Medicine table
SELECT * FROM Medicine;

-- Select all data from Appointment table
SELECT * FROM Appointment;

-- Select all data from PatientMedicine table
SELECT * FROM PatientMedicine;

-- Select all data from AppointmentMedicine table
SELECT * FROM AppointmentMedicine;

-- Select all data from ChatHistory table
SELECT * FROM ChatHistory;