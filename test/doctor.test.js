const sql = require("mssql");
const dbConfig = require("../dbConfig");
const Doctor = require("../models/doctor"); // Adjust the path as necessary

jest.mock("mssql");

describe("Doctor Model", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("getAllDoctors", () => {
    it("should retrieve all doctors from the database", async () => {
      const mockDoctors = [
        {
          DoctorID: 1,
          Email: "dr.jane.smith@example.com",
          ContactNumber: "0987654321",
          DOB: "1975-05-20",
          Gender: "Female",
          Profession: "General Practitioner",
          resetPasswordCode: "resetCode456",
          googleId: "googleId456",
          givenName: "Jane",
          familyName: "Smith",
          profilePicture: "./images/LoginIconLight.png",
        },
      ];

      sql.connect.mockResolvedValue({
        request: () => ({
          query: jest.fn().mockResolvedValue({ recordset: mockDoctors }),
        }),
        close: jest.fn(),
      });

      const doctors = await Doctor.getAllDoctors();

      expect(doctors).toHaveLength(1);
      expect(doctors[0]).toBeInstanceOf(Doctor);
      expect(doctors[0].Email).toBe("dr.jane.smith@example.com");
    });
  });

  describe("getDoctorById", () => {
    it("should retrieve a doctor by ID from the database", async () => {
      const mockDoctor = {
        DoctorID: 1,
        Email: "dr.jane.smith@example.com",
        ContactNumber: "0987654321",
        DOB: "1975-05-20",
        Gender: "Female",
        Profession: "General Practitioner",
        resetPasswordCode: "resetCode456",
        googleId: "googleId456",
        givenName: "Jane",
        familyName: "Smith",
        profilePicture: "./images/LoginIconLight.png",
      };

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: [mockDoctor] }),
        }),
        close: jest.fn(),
      });

      const doctor = await Doctor.getDoctorById(1);

      expect(doctor).toBeInstanceOf(Doctor);
      expect(doctor.Email).toBe("dr.jane.smith@example.com");
    });

    it("should return null if no doctor is found by ID", async () => {
      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: [] }),
        }),
        close: jest.fn(),
      });

      const doctor = await Doctor.getDoctorById(1);

      expect(doctor).toBeNull();
    });
  });

  describe("createDoctor", () => {
    it("should create a new doctor and return the created doctor", async () => {
      const newDoctorData = {
        Email: "dr.john.doe@example.com",
        ContactNumber: "1234567890",
        DOB: "1980-01-01",
        Gender: "Male",
        Profession: "Cardiologist",
        resetPasswordCode: "resetCode789",
        googleId: "googleId789",
        givenName: "John",
        familyName: "Doe",
        profilePicture: "./images/LoginIconLight.png",
      };

      const createdDoctorId = 2;

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest
            .fn()
            .mockResolvedValue({ recordset: [{ DoctorID: createdDoctorId }] }),
        }),
        close: jest.fn(),
      });

      jest
        .spyOn(Doctor, "getDoctorById")
        .mockResolvedValue(
          new Doctor(
            createdDoctorId,
            newDoctorData.Email,
            newDoctorData.ContactNumber,
            newDoctorData.DOB,
            newDoctorData.Gender,
            newDoctorData.Profession,
            newDoctorData.resetPasswordCode,
            newDoctorData.googleId,
            newDoctorData.givenName,
            newDoctorData.familyName,
            newDoctorData.profilePicture
          )
        );

      const newDoctor = await Doctor.createDoctor(newDoctorData);

      expect(newDoctor).toBeInstanceOf(Doctor);
      expect(newDoctor.Email).toBe(newDoctorData.Email);
    });
  });

  describe("updateDoctor", () => {
    it("should update an existing doctor and return the updated doctor", async () => {
      const updatedDoctorData = {
        Email: "dr.john.doe@newexample.com",
        ContactNumber: "9876543210",
        DOB: "1980-01-01",
        Gender: "Male",
        Profession: "Cardiologist",
        resetPasswordCode: "resetCode789",
        googleId: "googleId789",
        givenName: "John",
        familyName: "Doe",
        profilePicture: "./images/LoginIconLight.png",
      };

      const updatedDoctorId = 1;

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({}),
        }),
        close: jest.fn(),
      });

      jest
        .spyOn(Doctor, "getDoctorById")
        .mockResolvedValue(
          new Doctor(
            updatedDoctorId,
            updatedDoctorData.Email,
            updatedDoctorData.ContactNumber,
            updatedDoctorData.DOB,
            updatedDoctorData.Gender,
            updatedDoctorData.Profession,
            updatedDoctorData.resetPasswordCode,
            updatedDoctorData.googleId,
            updatedDoctorData.givenName,
            updatedDoctorData.familyName,
            updatedDoctorData.profilePicture
          )
        );

      const updatedDoctor = await Doctor.updateDoctor(
        updatedDoctorId,
        updatedDoctorData
      );

      expect(updatedDoctor).toBeInstanceOf(Doctor);
      expect(updatedDoctor.Email).toBe(updatedDoctorData.Email);
    });
  });

  describe("deleteDoctor", () => {
    it("should delete a doctor and return true if successful", async () => {
      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
        }),
        close: jest.fn(),
      });

      const result = await Doctor.deleteDoctor(1);

      expect(result).toBe(true);
    });

    it("should return false if no rows were affected", async () => {
      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ rowsAffected: [0] }),
        }),
        close: jest.fn(),
      });

      const result = await Doctor.deleteDoctor(1);

      expect(result).toBe(false);
    });
  });

  describe("findOrCreateGoogleUser", () => {
    it("should find an existing doctor by Google ID", async () => {
      const googleUserData = {
        Email: "dr.jane.smith@example.com",
        ContactNumber: "0987654321",
        DOB: "1975-05-20",
        Gender: "Female",
        Profession: "General Practitioner",
        resetPasswordCode: "resetCode456",
        googleId: "googleId456",
        givenName: "Jane",
        familyName: "Smith",
        profilePicture: "./images/LoginIconLight.png",
      };

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: [googleUserData] }),
        }),
        close: jest.fn(),
      });

      const doctor = await Doctor.findOrCreateGoogleUser(googleUserData);

      expect(doctor).toBeInstanceOf(Object); // Adjust based on the exact return type
      expect(doctor.googleId).toBe("googleId456");
    });
  });

  describe("updateDocAccountName", () => {
    it("should update the doctor's name and return the updated doctor", async () => {
      const updatedNameData = {
        givenName: "John",
        familyName: "Doe",
      };

      const updatedDoctorId = 1;

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({}),
        }),
        close: jest.fn(),
      });

      jest
        .spyOn(Doctor, "getDoctorById")
        .mockResolvedValue(
          new Doctor(
            updatedDoctorId,
            "dr.john.doe@example.com",
            "1234567890",
            "1980-01-01",
            "Male",
            "Cardiologist",
            "resetCode789",
            "googleId789",
            updatedNameData.givenName,
            updatedNameData.familyName,
            "./images/LoginIconLight.png"
          )
        );

      const updatedDoctor = await Doctor.updateDocAccountName(
        updatedDoctorId,
        updatedNameData
      );

      expect(updatedDoctor).toBeInstanceOf(Doctor);
      expect(updatedDoctor.givenName).toBe(updatedNameData.givenName);
      expect(updatedDoctor.familyName).toBe(updatedNameData.familyName);
    });
  });

  describe("updateDocAccountContact", () => {
    it("should update the doctor's contact information and return the updated doctor", async () => {
      const updatedContactData = {
        ContactNumber: "9876543210",
      };

      const updatedDoctorId = 1;

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({}),
        }),
        close: jest.fn(),
      });

      jest
        .spyOn(Doctor, "getDoctorById")
        .mockResolvedValue(
          new Doctor(
            updatedDoctorId,
            "dr.john.doe@example.com",
            updatedContactData.ContactNumber,
            "1980-01-01",
            "Male",
            "Cardiologist",
            "resetCode789",
            "googleId789",
            "John",
            "Doe",
            "./images/LoginIconLight.png"
          )
        );

      const updatedDoctor = await Doctor.updateDocAccountContact(
        updatedDoctorId,
        updatedContactData
      );

      expect(updatedDoctor).toBeInstanceOf(Doctor);
      expect(updatedDoctor.ContactNumber).toBe(
        updatedContactData.ContactNumber
      );
    });
  });

  describe("updateDocAccountDOB", () => {
    it("should update the doctor's date of birth and return the updated doctor", async () => {
      const updatedDOBData = {
        DOB: "1990-01-01",
      };

      const updatedDoctorId = 1;

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({}),
        }),
        close: jest.fn(),
      });

      jest
        .spyOn(Doctor, "getDoctorById")
        .mockResolvedValue(
          new Doctor(
            updatedDoctorId,
            "dr.john.doe@example.com",
            "1234567890",
            updatedDOBData.DOB,
            "Male",
            "Cardiologist",
            "resetCode789",
            "googleId789",
            "John",
            "Doe",
            "./images/LoginIconLight.png"
          )
        );

      const updatedDoctor = await Doctor.updateDocAccountDOB(
        updatedDoctorId,
        updatedDOBData
      );

      expect(updatedDoctor).toBeInstanceOf(Doctor);
      expect(updatedDoctor.DOB).toBe(updatedDOBData.DOB);
    });
  });

  describe("updateDocAccountProfession", () => {
    it("should update the doctor's profession and return the updated doctor", async () => {
      const updatedProfessionData = {
        Profession: "Neurologist",
      };

      const updatedDoctorId = 1;

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({}),
        }),
        close: jest.fn(),
      });

      jest
        .spyOn(Doctor, "getDoctorById")
        .mockResolvedValue(
          new Doctor(
            updatedDoctorId,
            "dr.john.doe@example.com",
            "1234567890",
            "1980-01-01",
            "Male",
            updatedProfessionData.Profession,
            "resetCode789",
            "googleId789",
            "John",
            "Doe",
            "./images/LoginIconLight.png"
          )
        );

      const updatedDoctor = await Doctor.updateDocAccountProfession(
        updatedDoctorId,
        updatedProfessionData
      );

      expect(updatedDoctor).toBeInstanceOf(Doctor);
      expect(updatedDoctor.Profession).toBe(updatedProfessionData.Profession);
    });
  });
});
