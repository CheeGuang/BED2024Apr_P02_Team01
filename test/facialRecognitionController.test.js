const facialRecognitionController = require("../modules/facialRecognition/controllers/facialRecognitionController.js");
const FacialRecognition = require("../models/facialRecognition");

jest.mock("../models/facialRecognition");

describe("Facial Recognition Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new face descriptor successfully", async () => {
      const mockDescriptor = {
        PatientID: "1",
        DoctorID: "2",
        name: "John Doe",
        descriptor: [0.1, 0.2, 0.3],
      };
      FacialRecognition.addDescriptor = jest.fn().mockResolvedValue();

      const req = { body: mockDescriptor };
      const res = {
        sendStatus: jest.fn(),
      };

      await facialRecognitionController.register(req, res);

      expect(FacialRecognition.addDescriptor).toHaveBeenCalledWith(
        mockDescriptor
      );
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should handle errors during registration", async () => {
      FacialRecognition.addDescriptor = jest
        .fn()
        .mockRejectedValue(new Error("Failed to add descriptor"));

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await facialRecognitionController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        error: "Failed to add descriptor",
      });
    });
  });

  describe("updateDescriptor", () => {
    it("should update an existing face descriptor successfully", async () => {
      const updatedDescriptor = {
        PatientID: "1",
        DoctorID: "2",
        name: "John Doe",
        descriptor: [0.1, 0.2, 0.4],
      };
      FacialRecognition.updateDescriptor = jest.fn().mockResolvedValue(true);

      const req = { body: updatedDescriptor };
      const res = {
        sendStatus: jest.fn(),
      };

      await facialRecognitionController.updateDescriptor(req, res);

      expect(FacialRecognition.updateDescriptor).toHaveBeenCalledWith(
        updatedDescriptor
      );
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 404 if descriptor is not found", async () => {
      FacialRecognition.updateDescriptor = jest.fn().mockResolvedValue(false);

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await facialRecognitionController.updateDescriptor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Descriptor not found");
    });

    it("should handle errors during update", async () => {
      FacialRecognition.updateDescriptor = jest
        .fn()
        .mockRejectedValue(new Error("Failed to update descriptor"));

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await facialRecognitionController.updateDescriptor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        error: "Failed to update descriptor",
      });
    });
  });

  describe("deleteDescriptor", () => {
    it("should delete a face descriptor successfully", async () => {
      FacialRecognition.deleteDescriptor = jest.fn().mockResolvedValue(true);

      const req = { body: { PatientID: "1", DoctorID: "2" } };
      const res = {
        sendStatus: jest.fn(),
      };

      await facialRecognitionController.deleteDescriptor(req, res);

      expect(FacialRecognition.deleteDescriptor).toHaveBeenCalledWith({
        PatientID: "1",
        DoctorID: "2",
      });
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 404 if descriptor is not found", async () => {
      FacialRecognition.deleteDescriptor = jest.fn().mockResolvedValue(false);

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await facialRecognitionController.deleteDescriptor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Descriptor not found");
    });

    it("should handle errors during deletion", async () => {
      FacialRecognition.deleteDescriptor = jest
        .fn()
        .mockRejectedValue(new Error("Failed to delete descriptor"));

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await facialRecognitionController.deleteDescriptor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        error: "Failed to delete descriptor",
      });
    });
  });

  describe("getDescriptors", () => {
    it("should retrieve all face descriptors successfully", async () => {
      const mockDescriptors = [
        {
          PatientID: "1",
          DoctorID: "2",
          name: "John Doe",
          descriptor: [0.1, 0.2, 0.3],
        },
      ];
      FacialRecognition.getDescriptors = jest
        .fn()
        .mockResolvedValue(mockDescriptors);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await facialRecognitionController.getDescriptors(req, res);

      expect(FacialRecognition.getDescriptors).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockDescriptors);
    });

    it("should handle errors during retrieval", async () => {
      FacialRecognition.getDescriptors = jest
        .fn()
        .mockRejectedValue(new Error("Failed to get descriptors"));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await facialRecognitionController.getDescriptors(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        error: "Failed to get descriptors",
      });
    });
  });
});
