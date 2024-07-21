const patientController = require("../modules/patient/controllers/patientController");
const Patient = require("../models/patient");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

jest.mock("../models/patient");
jest.mock("jsonwebtoken");
jest.mock("google-auth-library");

describe("PatientController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("googleLogin", () => {
    it("should return a JWT token and user data on successful Google login", async () => {
      const mockToken = "mockToken";
      const mockUserPayload = {
        sub: "googleId123",
        email: "john.doe@example.com",
        given_name: "John",
        family_name: "Doe",
        picture: "./images/LoginIconLight.png",
      };

      const mockPatient = {
        PatientID: 1,
        Email: "john.doe@example.com",
      };

      OAuth2Client.prototype.verifyIdToken.mockResolvedValue({
        getPayload: () => mockUserPayload,
      });

      Patient.findOrCreateGoogleUser.mockResolvedValue(mockPatient);
      jwt.sign.mockReturnValue("mockJwtToken");

      const req = { body: { token: mockToken } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await patientController.googleLogin(req, res);

      expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledTimes(1);
      expect(Patient.findOrCreateGoogleUser).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: mockPatient,
        token: "mockJwtToken",
      });
    });

    it("should handle errors during Google login", async () => {
      const errorMessage = "Google authentication failed";
      OAuth2Client.prototype.verifyIdToken.mockRejectedValue(
        new Error(errorMessage)
      );

      const req = { body: { token: "mockToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await patientController.googleLogin(req, res);

      expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Google authentication failed",
      });
    });
  });

  describe("createPatient", () => {
    it("should create a new patient", async () => {
      const newPatient = {
        Email: "jane.doe@example.com",
        ContactNumber: "0987654321",
        DOB: "1990-01-01",
        Gender: "Female",
        Address: "456 Another St",
        eWalletAmount: 50.0,
        resetPasswordCode: "resetCode456",
        PCHI: 1001,
        googleId: "googleId456",
        givenName: "Jane",
        familyName: "Doe",
        profilePicture: "./images/LoginIconLight.png",
      };

      const createdPatient = { id: 2, ...newPatient };

      Patient.createPatient.mockResolvedValue(createdPatient);

      const req = { body: newPatient };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await patientController.createPatient(req, res);

      expect(Patient.createPatient).toHaveBeenCalledWith(newPatient);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdPatient);
    });

    it("should handle errors during patient creation", async () => {
      const errorMessage = "Error creating patient";
      Patient.createPatient.mockRejectedValue(new Error(errorMessage));

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await patientController.createPatient(req, res);

      expect(Patient.createPatient).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error creating patient");
    });
  });

  describe("getPatientById", () => {
    it("should return a patient by ID", async () => {
      const mockPatient = {
        PatientID: 1,
        Email: "john.doe@example.com",
      };

      Patient.getPatientById.mockResolvedValue(mockPatient);

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
      };

      await patientController.getPatientById(req, res);

      expect(Patient.getPatientById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockPatient);
    });

    it("should handle errors when patient is not found", async () => {
      Patient.getPatientById.mockResolvedValue(null);

      const req = { params: { id: 999 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await patientController.getPatientById(req, res);

      expect(Patient.getPatientById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Patient not found");
    });

    it("should handle errors during retrieval", async () => {
      const errorMessage = "Error retrieving patient";
      Patient.getPatientById.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await patientController.getPatientById(req, res);

      expect(Patient.getPatientById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving patient");
    });
  });

  describe("getGuestPatient", () => {
    it("should return a guest patient with a JWT token", async () => {
      const mockPatient = {
        PatientID: 1,
        Email: "guest@example.com",
      };

      Patient.getGuestPatient.mockResolvedValue(mockPatient);
      jwt.sign.mockReturnValue("guestJwtToken");

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await patientController.getGuestPatient(req, res);

      expect(Patient.getGuestPatient).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        user: mockPatient,
        token: "guestJwtToken",
      });
    });

    it("should handle errors when guest patient is not found", async () => {
      Patient.getGuestPatient.mockResolvedValue(null);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await patientController.getGuestPatient(req, res);

      expect(Patient.getGuestPatient).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Patient not found");
    });

    it("should handle errors during retrieval", async () => {
      const errorMessage = "Error retrieving patient";
      Patient.getGuestPatient.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await patientController.getGuestPatient(req, res);

      expect(Patient.getGuestPatient).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving patient");
    });
  });

  describe("updatePatient", () => {
    it("should update a patient by ID", async () => {
      const mockUpdatedPatient = {
        PatientID: 1,
        Email: "john.doe@example.com",
        ContactNumber: "0987654321",
      };
      const mockToken = "mockToken";

      Patient.updatePatient = jest.fn().mockResolvedValue(mockUpdatedPatient);
      jwt.sign = jest.fn().mockReturnValue(mockToken);

      const req = { params: { id: 1 }, body: { ContactNumber: "0987654321" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await patientController.updatePatient(req, res);

      expect(Patient.updatePatient).toHaveBeenCalledWith(1, {
        ContactNumber: "0987654321",
      });

      const expectedResponse = {
        user: mockUpdatedPatient,
        token: mockToken,
      };

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it("should return 404 if patient is not found", async () => {
      Patient.updatePatient = jest.fn().mockResolvedValue(null);

      const req = { params: { id: 1 }, body: { ContactNumber: "0987654321" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await patientController.updatePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Patient not found");
    });

    it("should handle errors during patient update", async () => {
      Patient.updatePatient = jest
        .fn()
        .mockRejectedValue(new Error("Update error"));

      const req = { params: { id: 1 }, body: { ContactNumber: "0987654321" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await patientController.updatePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating patient");
    });

    describe("deletePatient", () => {
      it("should delete a patient by ID", async () => {
        Patient.deletePatient.mockResolvedValue({ affectedRows: 1 });

        const req = { params: { id: 1 } };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };

        await patientController.deletePatient(req, res);

        expect(Patient.deletePatient).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(204);
      });

      it("should handle errors during deletion", async () => {
        const errorMessage = "Error deleting patient";
        Patient.deletePatient.mockRejectedValue(new Error(errorMessage));

        const req = { params: { id: 1 } };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };

        await patientController.deletePatient(req, res);

        expect(Patient.deletePatient).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error deleting patient");
      });
    });
  });
});
