const healthcareIconController = require("../modules/healthCareIcon/controllers/healthCareIconController.js");
const HealthcareIcon = require("../models/healthCareIcon.js");

jest.mock("../models/healthCareIcon.js");

describe("HealthcareIcon Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRandomIcons", () => {
    it("should return random icons successfully", async () => {
      const mockIcons = [
        { id: 1, name: "Icon1" },
        { id: 2, name: "Icon2" },
      ];
      HealthcareIcon.getRandomIcons = jest.fn().mockResolvedValue(mockIcons);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await healthcareIconController.getRandomIcons(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockIcons);
    });

    it("should handle errors during retrieval", async () => {
      HealthcareIcon.getRandomIcons = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await healthcareIconController.getRandomIcons(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to retrieve icons",
      });
    });
  });
});
