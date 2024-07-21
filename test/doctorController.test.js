const doctorController = require("../modules/doctor/controllers/doctorController.js");
const Doctor = require("../models/doctor.js");
const jwt = require("jsonwebtoken");

jest.mock("../models/doctor.js");

describe("Doctor Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllDoctors", () => {
    it("should return all doctors successfully", async () => {
      const mockDoctors = [{ DoctorID: 1, Email: "dr.jane.smith@example.com" }];
      Doctor.getAllDoctors = jest.fn().mockResolvedValue(mockDoctors);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await doctorController.getAllDoctors(req, res);

      expect(res.json).toHaveBeenCalledWith(mockDoctors);
    });

    it("should handle errors during retrieval", async () => {
      Doctor.getAllDoctors = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.getAllDoctors(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving doctors");
    });
  });

  describe("getDoctorById", () => {
    it("should return doctor by ID successfully", async () => {
      const mockDoctor = { DoctorID: 1, Email: "dr.jane.smith@example.com" };
      Doctor.getDoctorById = jest.fn().mockResolvedValue(mockDoctor);

      const req = { params: { id: "1" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await doctorController.getDoctorById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockDoctor);
    });

    it("should handle doctor not found", async () => {
      Doctor.getDoctorById = jest.fn().mockResolvedValue(null);

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.getDoctorById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Doctor not found");
    });

    it("should handle errors during retrieval", async () => {
      Doctor.getDoctorById = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.getDoctorById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving doctor");
    });
  });

  describe("getGuestDoctor", () => {
    it("should return guest doctor with token", async () => {
      const mockUser = { DoctorID: 1, Email: "dr.jane.smith@example.com" };
      Doctor.getGuestDoctor = jest.fn().mockResolvedValue(mockUser);

      const mockToken = "mockToken";
      jest.spyOn(jwt, "sign").mockReturnValue(mockToken);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await doctorController.getGuestDoctor(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: mockUser,
        token: mockToken,
      });
    });

    it("should handle errors during guest doctor retrieval", async () => {
      Doctor.getGuestDoctor = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.getGuestDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving doctor");
    });
  });

  describe("createDoctor", () => {
    it("should create a new doctor successfully", async () => {
      const newDoctor = { Email: "new.doctor@example.com" };
      const createdDoctor = { DoctorID: 2, ...newDoctor };
      Doctor.createDoctor = jest.fn().mockResolvedValue(createdDoctor);

      const req = { body: newDoctor };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await doctorController.createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdDoctor);
    });

    it("should handle errors during doctor creation", async () => {
      Doctor.createDoctor = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error creating doctor");
    });
  });

  describe("updateDoctor", () => {
    it("should update a doctor's details successfully", async () => {
      const updatedDoctor = { DoctorID: 1, Email: "updated.email@example.com" };
      const updatedResponse = { token: "mockToken", user: updatedDoctor };
      Doctor.updateDoctor = jest.fn().mockResolvedValue(updatedDoctor);
      generateToken = jest.fn().mockReturnValue("mockToken");

      const req = {
        params: { id: "1" },
        body: { Email: "updated.email@example.com" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await doctorController.updateDoctor(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedResponse);
    });

    it("should handle doctor not found during update", async () => {
      Doctor.updateDoctor = jest.fn().mockResolvedValue(null);

      const req = { params: { id: "1" }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.updateDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Doctor not found");
    });

    it("should handle errors during update", async () => {
      Doctor.updateDoctor = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = { params: { id: "1" }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.updateDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating doctor");
    });
  });

  describe("updateDocAccountName", () => {
    it("should update doctor's account name successfully", async () => {
      const updatedName = { givenName: "Jane", familyName: "Doe" };
      Doctor.updateDocAccountName = jest.fn().mockResolvedValue(updatedName);

      const req = {
        params: { id: "1" },
        body: { fname: "Jane", lname: "Doe" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await doctorController.updateDocAccountName(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        FirstName: updatedName.givenName,
        LastName: updatedName.familyName,
      });
    });

    it("should handle doctor not found during name update", async () => {
      Doctor.updateDocAccountName = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: "1" },
        body: { fname: "Jane", lname: "Doe" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.updateDocAccountName(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Doctor not found");
    });

    it("should handle errors during name update", async () => {
      Doctor.updateDocAccountName = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = {
        params: { id: "1" },
        body: { fname: "Jane", lname: "Doe" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.updateDocAccountName(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating doctor's name");
    });
  });

  describe("updateDocAccountContact", () => {
    it("should update doctor's contact number successfully", async () => {
      const updatedContact = { PhoneNumber: "+1234567890" };
      Doctor.updateDocAccountContact = jest
        .fn()
        .mockResolvedValue(updatedContact);

      const req = { params: { id: "1" }, body: { PhoneNumber: "+1234567890" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await doctorController.updateDocAccountContact(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        PhoneNumber: undefined,
      });
    });

    it("should handle doctor not found during contact update", async () => {
      Doctor.updateDocAccountContact = jest.fn().mockResolvedValue(null);

      const req = { params: { id: "1" }, body: { PhoneNumber: "+1234567890" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.updateDocAccountContact(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Doctor not found");
    });

    it("should handle errors during contact update", async () => {
      Doctor.updateDocAccountContact = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = { params: { id: "1" }, body: { PhoneNumber: "+1234567890" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await doctorController.updateDocAccountContact(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating doctor's contact");
    });
  });
});
