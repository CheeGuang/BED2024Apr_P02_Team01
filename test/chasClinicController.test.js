const chasClinicController = require("../modules/chasClinic/controllers/chasClinicController");
const ChasClinic = require("../models/chasClinic");

jest.mock("../models/chasClinic");

describe("ChasClinicController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("getMapApiKey", () => {
    it("should return the map API key", async () => {
      const mockApiKey = "mockApiKey";
      ChasClinic.getMapApiKey.mockResolvedValue(mockApiKey);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.getMapApiKey(req, res);

      expect(ChasClinic.getMapApiKey).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ apiKey: mockApiKey });
    });

    it("should handle errors", async () => {
      const errorMessage = "Error getting API Key";
      ChasClinic.getMapApiKey.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.getMapApiKey(req, res);

      expect(ChasClinic.getMapApiKey).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Error getting API Key" });
    });
  });

  describe("downloadChasClinics", () => {
    it("should download the CHAS clinics file", async () => {
      ChasClinic.downloadFile.mockResolvedValue(undefined);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.downloadChasClinics(req, res);

      expect(ChasClinic.downloadFile).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "File downloaded successfully",
      });
    });

    it("should handle errors", async () => {
      const errorMessage = "Failed to download file";
      ChasClinic.downloadFile.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.downloadChasClinics(req, res);

      expect(ChasClinic.downloadFile).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to download file",
      });
    });
  });

  describe("getRandomClinics", () => {
    it("should return random clinics", async () => {
      const mockClinics = [
        { id: 1, name: "Clinic A" },
        { id: 2, name: "Clinic B" },
      ];
      ChasClinic.getRandomClinics.mockResolvedValue(mockClinics);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.getRandomClinics(req, res);

      expect(ChasClinic.getRandomClinics).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClinics);
    });

    it("should handle errors", async () => {
      const errorMessage = "Failed to retrieve clinics";
      ChasClinic.getRandomClinics.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.getRandomClinics(req, res);

      expect(ChasClinic.getRandomClinics).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to retrieve clinics",
      });
    });
  });

  describe("getNearestClinics", () => {
    it("should return nearest clinics", async () => {
      const mockClinics = [
        { id: 1, name: "Clinic A" },
        { id: 2, name: "Clinic B" },
      ];
      ChasClinic.getNearestClinics.mockResolvedValue(mockClinics);

      const req = { query: { lat: "1.3521", lng: "103.8198" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.getNearestClinics(req, res);

      expect(ChasClinic.getNearestClinics).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClinics);
    });

    it("should handle errors", async () => {
      const errorMessage = "Failed to retrieve clinics";
      ChasClinic.getNearestClinics.mockRejectedValue(new Error(errorMessage));

      const req = { query: { lat: "1.3521", lng: "103.8198" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.getNearestClinics(req, res);

      expect(ChasClinic.getNearestClinics).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to retrieve clinics",
      });
    });
  });

  describe("getClinicsInBounds", () => {
    it("should return clinics within bounds", async () => {
      const mockClinics = [
        { id: 1, name: "Clinic A" },
        { id: 2, name: "Clinic B" },
      ];
      ChasClinic.getClinicsInBounds.mockResolvedValue(mockClinics);

      const req = {
        query: {
          north: "1.482",
          south: "1.282",
          east: "104.019",
          west: "103.619",
          centerLat: "1.3521",
          centerLng: "103.8198",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.getClinicsInBounds(req, res);

      expect(ChasClinic.getClinicsInBounds).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClinics);
    });

    it("should handle errors", async () => {
      const errorMessage = "Failed to retrieve clinics";
      ChasClinic.getClinicsInBounds.mockRejectedValue(new Error(errorMessage));

      const req = {
        query: {
          north: "1.482",
          south: "1.282",
          east: "104.019",
          west: "103.619",
          centerLat: "1.3521",
          centerLng: "103.8198",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await chasClinicController.getClinicsInBounds(req, res);

      expect(ChasClinic.getClinicsInBounds).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to retrieve clinics",
      });
    });
  });
});
