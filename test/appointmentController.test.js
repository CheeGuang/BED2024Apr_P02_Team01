const appointmentController = require("../modules/appointment/controllers/appointmentController");
const { Appointment, appointmentEmitter } = require("../models/appointment");
const fetch = require("node-fetch");
const moment = require("moment-timezone");

jest.mock("node-fetch");
jest.mock("../models/appointment");

describe("Appointment Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllAppointments", () => {
    it("should retrieve all appointments", async () => {
      const mockAppointments = [{ id: 1, name: "Test Appointment" }];
      Appointment.getAllAppointments.mockResolvedValue(mockAppointments);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAllAppointments(req, res);

      expect(Appointment.getAllAppointments).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockAppointments);
    });

    it("should handle errors", async () => {
      Appointment.getAllAppointments.mockRejectedValue(new Error("Error"));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAllAppointments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving appointments");
    });
  });

  describe("createAppointment", () => {
    it("should handle errors", async () => {
      const mockRequest = {
        body: {
          startDate: "2024-07-20T10:00:00+08:00",
          endDate: "2024-07-20T11:00:00+08:00",
          illnessDescription: "Test illness",
          PatientID: 1,
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      fetch.mockRejectedValue(new Error("Error"));

      await appointmentController.createAppointment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "Failed!",
        error: "Unable to create Room.",
      });
    });
  });

  describe("getAppointmentsByPatientId", () => {
    it("should retrieve appointments by patient ID", async () => {
      const mockAppointments = [{ id: 1, PatientID: 1 }];
      Appointment.getAppointmentsByPatientId.mockResolvedValue(
        mockAppointments
      );

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAppointmentsByPatientId(req, res);

      expect(Appointment.getAppointmentsByPatientId).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockAppointments);
    });

    it("should handle errors", async () => {
      Appointment.getAppointmentsByPatientId.mockRejectedValue(
        new Error("Error")
      );

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAppointmentsByPatientId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving appointments");
    });
  });

  describe("getAppointmentsByDoctorId", () => {
    it("should retrieve appointments by doctor ID", async () => {
      const mockAppointments = [{ id: 1, DoctorID: 1 }];
      Appointment.getAppointmentsByDoctorId.mockResolvedValue(mockAppointments);

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAppointmentsByDoctorId(req, res);

      expect(Appointment.getAppointmentsByDoctorId).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockAppointments);
    });

    it("should handle errors", async () => {
      Appointment.getAppointmentsByDoctorId.mockRejectedValue(
        new Error("Error")
      );

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAppointmentsByDoctorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving appointments");
    });
  });

  describe("getAppointmentById", () => {
    it("should retrieve an appointment by ID", async () => {
      const mockAppointment = { id: 1, name: "Test Appointment" };
      Appointment.getAppointmentById.mockResolvedValue(mockAppointment);

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAppointmentById(req, res);

      expect(Appointment.getAppointmentById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockAppointment);
    });

    it("should handle errors", async () => {
      Appointment.getAppointmentById.mockRejectedValue(new Error("Error"));

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAppointmentById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving appointment");
    });
  });

  describe("updateAppointment", () => {
    it("should update an appointment", async () => {
      const mockAppointment = { id: 1, name: "Updated Appointment" };
      Appointment.updateAppointment.mockResolvedValue(mockAppointment);

      const req = {
        params: { id: 1 },
        body: { name: "Updated Appointment" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.updateAppointment(req, res);

      expect(Appointment.updateAppointment).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith(mockAppointment);
    });

    it("should handle errors", async () => {
      Appointment.updateAppointment.mockRejectedValue(new Error("Error"));

      const req = {
        params: { id: 1 },
        body: { name: "Updated Appointment" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.updateAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating appointment");
    });
  });

  describe("deleteAppointment", () => {
    it("should delete an appointment", async () => {
      Appointment.deleteAppointment.mockResolvedValue(true);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.deleteAppointment(req, res);

      expect(Appointment.deleteAppointment).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      Appointment.deleteAppointment.mockRejectedValue(new Error("Error"));

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.deleteAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error deleting appointment");
    });
  });

  describe("updateDoctorId", () => {
    it("should update the doctor ID for an appointment", async () => {
      const mockAppointment = { id: 1, DoctorID: 1 };
      Appointment.updateDoctorId.mockResolvedValue(mockAppointment);

      const req = {
        params: { id: 1 },
        body: { DoctorID: 1 },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.updateDoctorId(req, res);

      expect(Appointment.updateDoctorId).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith(mockAppointment);
    });

    it("should handle errors", async () => {
      Appointment.updateDoctorId.mockRejectedValue(new Error("Error"));

      const req = {
        params: { id: 1 },
        body: { DoctorID: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.updateDoctorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error updating doctor ID for appointment"
      );
    });
  });

  describe("getUnassignedAppointments", () => {
    it("should retrieve unassigned appointments", async () => {
      const mockAppointments = [{ id: 1, DoctorID: null }];
      Appointment.getUnassignedAppointments.mockResolvedValue(mockAppointments);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getUnassignedAppointments(req, res);

      expect(Appointment.getUnassignedAppointments).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockAppointments);
    });

    it("should handle errors", async () => {
      Appointment.getUnassignedAppointments.mockRejectedValue(
        new Error("Error")
      );

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getUnassignedAppointments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving appointments");
    });
  });

  describe("addMedicinesToAppointment", () => {
    it("should add medicines to an appointment", async () => {
      const req = {
        params: { id: 1 },
        body: { MedicineIDs: [1, 2, 3] },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      Appointment.addMedicinesToAppointment.mockResolvedValue(true);

      await appointmentController.addMedicinesToAppointment(req, res);

      expect(Appointment.addMedicinesToAppointment).toHaveBeenCalledWith(
        1,
        [1, 2, 3]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Medicines added successfully to the appointment",
      });
    });

    it("should return 400 if MedicineIDs is not an array", async () => {
      const req = {
        params: { id: 1 },
        body: { MedicineIDs: "not-an-array" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await appointmentController.addMedicinesToAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "MedicineIDs must be an array",
      });
    });

    it("should handle errors", async () => {
      const req = {
        params: { id: 1 },
        body: { MedicineIDs: [1, 2, 3] },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Appointment.addMedicinesToAppointment.mockRejectedValue(
        new Error("Error")
      );

      await appointmentController.addMedicinesToAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error adding medicines to appointment"
      );
    });
  });

  describe("updateMedicinesForAppointment", () => {
    it("should update medicines for an appointment", async () => {
      const req = {
        params: { id: 1 },
        body: { MedicineIDs: [1, 2, 3] },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      Appointment.updateMedicinesForAppointment.mockResolvedValue(true);

      await appointmentController.updateMedicinesForAppointment(req, res);

      expect(Appointment.updateMedicinesForAppointment).toHaveBeenCalledWith(
        1,
        [1, 2, 3]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Medicines updated successfully for the appointment",
      });
    });

    it("should return 400 if MedicineIDs is not an array", async () => {
      const req = {
        params: { id: 1 },
        body: { MedicineIDs: "not-an-array" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await appointmentController.updateMedicinesForAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "MedicineIDs must be an array",
      });
    });

    it("should handle errors", async () => {
      const req = {
        params: { id: 1 },
        body: { MedicineIDs: [1, 2, 3] },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Appointment.updateMedicinesForAppointment.mockRejectedValue(
        new Error("Error")
      );

      await appointmentController.updateMedicinesForAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error updating medicines for appointment"
      );
    });
  });

  describe("getMedicinesForAppointment", () => {
    it("should retrieve medicines for an appointment", async () => {
      const mockMedicines = [{ id: 1, name: "Aspirin" }];
      Appointment.getMedicinesForAppointment.mockResolvedValue(mockMedicines);

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getMedicinesForAppointment(req, res);

      expect(Appointment.getMedicinesForAppointment).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockMedicines);
    });

    it("should handle errors", async () => {
      Appointment.getMedicinesForAppointment.mockRejectedValue(
        new Error("Error")
      );

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getMedicinesForAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error retrieving medicines for appointment"
      );
    });
  });

  describe("updateAppointmentWithMedicines", () => {
    it("should update an appointment with medicines", async () => {
      const req = {
        params: { id: 1 },
        body: {
          Diagnosis: "Test Diagnosis",
          MCStartDate: "2024-07-20",
          MCEndDate: "2024-07-21",
          DoctorNotes: "Test Notes",
          MedicineIDs: [1, 2, 3],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      Appointment.updateAppointmentWithMedicines.mockResolvedValue(true);

      await appointmentController.updateAppointmentWithMedicines(req, res);

      expect(Appointment.updateAppointmentWithMedicines).toHaveBeenCalledWith(
        1,
        {
          Diagnosis: "Test Diagnosis",
          MCStartDate: "2024-07-20",
          MCEndDate: "2024-07-21",
          DoctorNotes: "Test Notes",
        },
        [1, 2, 3]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Appointment and medicines updated successfully",
      });
    });

    it("should return 400 if MedicineIDs is not an array", async () => {
      const req = {
        params: { id: 1 },
        body: {
          Diagnosis: "Test Diagnosis",
          MCStartDate: "2024-07-20",
          MCEndDate: "2024-07-21",
          DoctorNotes: "Test Notes",
          MedicineIDs: "not-an-array",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await appointmentController.updateAppointmentWithMedicines(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "MedicineIDs must be an array",
      });
    });

    it("should handle errors", async () => {
      const req = {
        params: { id: 1 },
        body: {
          Diagnosis: "Test Diagnosis",
          MCStartDate: "2024-07-20",
          MCEndDate: "2024-07-21",
          DoctorNotes: "Test Notes",
          MedicineIDs: [1, 2, 3],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Appointment.updateAppointmentWithMedicines.mockRejectedValue(
        new Error("Error")
      );

      await appointmentController.updateAppointmentWithMedicines(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error updating appointment with medicines"
      );
    });
  });

  describe("getAppointmentDetailsById", () => {
    it("should retrieve appointment details by ID", async () => {
      const mockAppointmentDetails = { id: 1, name: "Test Appointment" };
      Appointment.getAppointmentDetailsById.mockResolvedValue(
        mockAppointmentDetails
      );

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAppointmentDetailsById(req, res);

      expect(Appointment.getAppointmentDetailsById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockAppointmentDetails);
    });

    it("should handle errors", async () => {
      Appointment.getAppointmentDetailsById.mockRejectedValue(
        new Error("Error")
      );

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.getAppointmentDetailsById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error retrieving appointment details"
      );
    });
  });

  describe("generateMedicalCertificate", () => {
    it("should generate a medical certificate", async () => {
      const mockPdfBuffer = Buffer.from("PDF content");
      Appointment.generateMedicalCertificate.mockResolvedValue(mockPdfBuffer);

      const req = { params: { id: 1 } };
      const res = {
        setHeader: jest.fn(),
        send: jest.fn(),
      };

      await appointmentController.generateMedicalCertificate(req, res);

      expect(Appointment.generateMedicalCertificate).toHaveBeenCalledWith(1);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        "attachment; filename=SyncHealth-Medical-Certificate.pdf"
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/pdf"
      );
      expect(res.send).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it("should handle errors", async () => {
      Appointment.generateMedicalCertificate.mockRejectedValue(
        new Error("Error")
      );

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await appointmentController.generateMedicalCertificate(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error generating medical certificate"
      );
    });
  });
});
