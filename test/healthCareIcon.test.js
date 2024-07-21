const sql = require("mssql");
const dbConfig = require("../dbConfig");
const HealthcareIcon = require("../models/healthCareIcon"); // Adjust the path as necessary

jest.mock("mssql");

describe("HealthcareIcon Model", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("getRandomIcons", () => {
    it("should retrieve 4 random icons from the database", async () => {
      const mockIcons = [
        {
          IconID: 1,
          IconName: "heart",
          IconClass: "fas fa-heart",
        },
        {
          IconID: 2,
          IconName: "pills",
          IconClass: "fas fa-pills",
        },
        {
          IconID: 3,
          IconName: "user-md",
          IconClass: "fas fa-user-md",
        },
        {
          IconID: 4,
          IconName: "microscope",
          IconClass: "fas fa-microscope",
        },
      ];

      sql.connect.mockResolvedValue({
        request: () => ({
          query: jest.fn().mockResolvedValue({ recordset: mockIcons }),
        }),
        close: jest.fn(),
      });

      const icons = await HealthcareIcon.getRandomIcons();

      expect(icons).toHaveLength(4);
      expect(icons[0]).toHaveProperty("IconID");
      expect(icons[0]).toHaveProperty("IconName");
      expect(icons[0]).toHaveProperty("IconClass");
      expect(icons[0].IconName).toBe("heart");
    });

    it("should handle errors when querying the database", async () => {
      sql.connect.mockRejectedValue(new Error("Database connection error"));

      await expect(HealthcareIcon.getRandomIcons()).rejects.toThrow(
        "Database connection error"
      );
    });
  });
});
