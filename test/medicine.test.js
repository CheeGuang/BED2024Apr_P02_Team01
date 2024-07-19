const Medicine = require("../models/medicine");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

jest.mock("mssql");

describe("Medicine Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllMedicines", () => {
    it("should return all medicines", async () => {
      const mockMedicines = [
        {
          MedicineID: 1,
          Name: "Aspirin",
          Description: "Pain reliever and fever reducer.",
          Price: 5.0,
          RecommendedDosage:
            "Take 1-2 tablets after meals, up to 4 times a day.",
          Image: "aspirin.jpg",
        },
        // Add other medicines as needed
      ];

      sql.connect.mockResolvedValue({
        request: () => ({
          query: jest.fn().mockResolvedValue({ recordset: mockMedicines }),
        }),
        close: jest.fn(),
      });

      const result = await Medicine.getAllMedicines();

      expect(result).toHaveLength(mockMedicines.length);
      expect(result[0]).toBeInstanceOf(Medicine);
      expect(result[0].Name).toBe("Aspirin");
    });

    it("should handle errors when getting all medicines", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Medicine.getAllMedicines()).rejects.toThrow(errorMessage);
    });
  });

  describe("getMedicineById", () => {
    it("should return a medicine by ID", async () => {
      const mockMedicine = {
        MedicineID: 1,
        Name: "Aspirin",
        Description: "Pain reliever and fever reducer.",
        Price: 5.0,
        RecommendedDosage: "Take 1-2 tablets after meals, up to 4 times a day.",
        Image: "aspirin.jpg",
      };

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: [mockMedicine] }),
        }),
        close: jest.fn(),
      });

      const result = await Medicine.getMedicineById(1);

      expect(result).toBeInstanceOf(Medicine);
      expect(result.Name).toBe("Aspirin");
    });

    it("should return null if medicine not found", async () => {
      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: [] }),
        }),
        close: jest.fn(),
      });

      const result = await Medicine.getMedicineById(999);

      expect(result).toBeNull();
    });

    it("should handle errors when getting a medicine by ID", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Medicine.getMedicineById(1)).rejects.toThrow(errorMessage);
    });
  });

  describe("createMedicine", () => {
    it("should create a new medicine", async () => {
      const newMedicineData = {
        Name: "Ibuprofen",
        Description: "Nonsteroidal anti-inflammatory drug.",
        Price: 10.0,
        RecommendedDosage: "Take 1 tablet after meals, up to 3 times a day.",
        Image: "ibuprofen.jpg",
      };

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest
            .fn()
            .mockResolvedValue({ recordset: [{ MedicineID: 1 }] }),
        }),
        close: jest.fn(),
      });

      const result = await Medicine.createMedicine(newMedicineData);

      expect(result).toBeInstanceOf(Medicine);
    });

    it("should handle errors when creating a medicine", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Medicine.createMedicine({})).rejects.toThrow(errorMessage);
    });
  });

  describe("updateMedicine", () => {
    it("should update an existing medicine", async () => {
      const updatedMedicineData = {
        Name: "Updated Aspirin",
        Description: "Updated description.",
        Price: 6.0,
        RecommendedDosage: "Updated dosage.",
        Image: "updated_aspirin.jpg",
      };

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest
            .fn()
            .mockResolvedValue({ recordset: [{ MedicineID: 1 }] }),
        }),
        close: jest.fn(),
      });

      const result = await Medicine.updateMedicine(1, updatedMedicineData);

      expect(result).toBeInstanceOf(Medicine);
    });

    it("should handle errors when updating a medicine", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Medicine.updateMedicine(1, {})).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("deleteMedicine", () => {
    it("should delete a medicine successfully", async () => {
      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
        }),
        close: jest.fn(),
      });

      const result = await Medicine.deleteMedicine(1);

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

      const result = await Medicine.deleteMedicine(999);

      expect(result).toBe(false);
    });

    it("should handle errors when deleting a medicine", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Medicine.deleteMedicine(1)).rejects.toThrow(errorMessage);
    });
  });

  describe("getDefaultMedicine", () => {
    it("should return default medicines", async () => {
      const mockMedicines = [
        {
          MedicineID: 1,
          Name: "Aspirin",
          Description: "Pain reliever and fever reducer.",
          Price: 5.0,
          RecommendedDosage:
            "Take 1-2 tablets after meals, up to 4 times a day.",
          Image: "aspirin.jpg",
        },
        // Add other default medicines as needed
      ];

      sql.connect.mockResolvedValue({
        request: () => ({
          query: jest.fn().mockResolvedValue({ recordset: mockMedicines }),
        }),
        close: jest.fn(),
      });

      const result = await Medicine.getDefaultMedicine();

      expect(result).toHaveLength(mockMedicines.length);
      expect(result[0]).toBeInstanceOf(Medicine);
      expect(result[0].Name).toBe("Aspirin");
    });

    it("should handle errors when getting default medicines", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Medicine.getDefaultMedicine()).rejects.toThrow(errorMessage);
    });
  });

  describe("getMedicinesByPatientId", () => {
    it("should return patient medicines with default medicines appended", async () => {
      const patientMedicines = [
        {
          MedicineID: 1,
          Name: "Aspirin",
          Description: "Pain reliever and fever reducer.",
          Price: 5.0,
          RecommendedDosage:
            "Take 1-2 tablets after meals, up to 4 times a day.",
          Image: "aspirin.jpg",
        },
      ];

      const defaultMedicines = [
        {
          MedicineID: 2,
          Name: "Ibuprofen",
          Description: "Nonsteroidal anti-inflammatory drug.",
          Price: 10.0,
          RecommendedDosage: "Take 1 tablet after meals, up to 3 times a day.",
          Image: "ibuprofen.jpg",
        },
      ];

      sql.connect.mockResolvedValueOnce({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: patientMedicines }),
        }),
        close: jest.fn(),
      });

      sql.connect.mockResolvedValueOnce({
        request: () => ({
          query: jest.fn().mockResolvedValue({ recordset: defaultMedicines }),
        }),
        close: jest.fn(),
      });

      const result = await Medicine.getMedicinesByPatientId(1);

      expect(result).toHaveLength(
        patientMedicines.length + defaultMedicines.length
      );
      expect(result[0]).toBeInstanceOf(Medicine);
      expect(result.some((m) => m.Name === "Ibuprofen")).toBe(true);
    });

    it("should handle errors when getting medicines by patient ID", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Medicine.getMedicinesByPatientId(1)).rejects.toThrow(
        errorMessage
      );
    });
  });
});
