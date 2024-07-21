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

-- Drop MedicineRecognitionHistory table if it exists
IF OBJECT_ID('dbo.MedicineRecognitionHistory', 'U') IS NOT NULL
    DROP TABLE dbo.MedicineRecognitionHistory;

IF OBJECT_ID('dbo.Voucher', 'U') IS NOT NULL
    DROP TABLE dbo.Voucher;

IF OBJECT_ID('dbo.HealthcareIcons', 'U') IS NOT NULL
    DROP TABLE dbo.HealthcareIcons;

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
    Cart NVARCHAR(MAX) -- New attribute for cart
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
    googleId NVARCHAR(100) UNIQUE, -- New attribute for Google ID
    givenName NVARCHAR(100), -- New attribute for Google given name
    familyName NVARCHAR(100), -- New attribute for Google family name
    profilePicture NVARCHAR(255) -- New attribute for Google profile picture
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

-- Create Appointment table with medical certificate details
CREATE TABLE Appointment (
    AppointmentID INT IDENTITY(1,1) PRIMARY KEY,
    PatientID INT,
    DoctorID INT,
    endDateTime DATETIME,
    PatientURL NVARCHAR(1000),
    HostRoomURL NVARCHAR(1000),
    IllnessDescription NVARCHAR(255),
    Diagnosis NVARCHAR(255), -- New attribute for diagnosis
    MCStartDate DATE, -- Renamed attribute for medical certificate start date
    MCEndDate DATE, -- Renamed attribute for medical certificate end date
    DoctorNotes NVARCHAR(MAX), -- New attribute for additional doctor notes
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


-- Create MedicineRecognitionHistory table
CREATE TABLE MedicineRecognitionHistory (
    PromptID UNIQUEIDENTIFIER PRIMARY KEY,
    PatientID INT,
    MedicineName NVARCHAR(MAX),
    MainPurpose NVARCHAR(MAX),
    SideEffects NVARCHAR(MAX),
    RecommendedDosage NVARCHAR(MAX),
    OtherRemarks NVARCHAR(MAX),
    Timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID)
);

-- Create Voucher table
CREATE TABLE Voucher (
    VoucherID INT IDENTITY(1,1) PRIMARY KEY,
    Code VARCHAR(8),
    Discount DECIMAL(10, 2)
);

-- Create HealthcareIcons table
CREATE TABLE HealthcareIcons (
    IconID INT IDENTITY(1,1) PRIMARY KEY,
    IconName NVARCHAR(50) NOT NULL,
    IconClass NVARCHAR(100) NOT NULL
);