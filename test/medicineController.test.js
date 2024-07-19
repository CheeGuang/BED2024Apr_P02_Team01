const medicineController = require("../modules/medicine/controllers/medicineController");
const Medicine = require("../models/medicine");

jest.mock("../models/medicine");

describe("Medicine Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllMedicines", () => {
    it("should retrieve all medicines successfully", async () => {
      const mockMedicines = [
        {
          MedicineID: 1,
          Name: "Paracetamol",
          Dosage: "500mg",
          ExpiryDate: "2024-12-31",
          Stock: 100,
        },
      ];
      Medicine.getAllMedicines.mockResolvedValue(mockMedicines);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await medicineController.getAllMedicines(req, res);

      expect(res.json).toHaveBeenCalledWith(mockMedicines);
    });

    it("should handle errors when retrieving all medicines", async () => {
      const errorMessage = "Database connection error";
      Medicine.getAllMedicines.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.getAllMedicines(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving medicines");
    });
  });

  describe("getMedicineById", () => {
    it("should retrieve a medicine by ID successfully", async () => {
      const mockMedicine = {
        MedicineID: 1,
        Name: "Paracetamol",
        Dosage: "500mg",
        ExpiryDate: "2024-12-31",
        Stock: 100,
      };
      Medicine.getMedicineById.mockResolvedValue(mockMedicine);

      const req = { params: { id: "1" } };
      const res = {
        json: jest.fn(),
      };

      await medicineController.getMedicineById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockMedicine);
    });

    it("should handle errors when retrieving a medicine by ID", async () => {
      const errorMessage = "Database connection error";
      Medicine.getMedicineById.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.getMedicineById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving medicine");
    });

    it("should handle case when medicine is not found by ID", async () => {
      Medicine.getMedicineById.mockResolvedValue(null);

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.getMedicineById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Medicine not found");
    });
  });

  describe("getMedicinesByPatientId", () => {
    it("should retrieve medicines by patient ID successfully", async () => {
      const mockMedicines = [
        {
          MedicineID: 1,
          Name: "Paracetamol",
          Dosage: "500mg",
          ExpiryDate: "2024-12-31",
          Stock: 100,
        },
      ];
      Medicine.getMedicinesByPatientId.mockResolvedValue(mockMedicines);

      const req = { params: { patientId: "1" } };
      const res = {
        json: jest.fn(),
      };

      await medicineController.getMedicinesByPatientId(req, res);

      expect(res.json).toHaveBeenCalledWith(mockMedicines);
    });

    it("should handle errors when retrieving medicines by patient ID", async () => {
      const errorMessage = "Database connection error";
      Medicine.getMedicinesByPatientId.mockRejectedValue(
        new Error(errorMessage)
      );

      const req = { params: { patientId: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.getMedicinesByPatientId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error retrieving medicines for patient"
      );
    });

    it("should handle case when no medicines are found for a patient", async () => {
      Medicine.getMedicinesByPatientId.mockResolvedValue([]);

      const req = { params: { patientId: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.getMedicinesByPatientId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        "No medicines found for this patient"
      );
    });
  });

  describe("createMedicine", () => {
    it("should create a new medicine successfully", async () => {
      const newMedicine = {
        Name: "Ibuprofen",
        Dosage: "200mg",
        ExpiryDate: "2025-01-01",
        Stock: 50,
      };
      Medicine.createMedicine.mockResolvedValue({
        MedicineID: 2,
        ...newMedicine,
      });

      const req = { body: newMedicine };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await medicineController.createMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ MedicineID: 2, ...newMedicine });
    });

    it("should handle errors when creating a new medicine", async () => {
      const errorMessage = "Database connection error";
      Medicine.createMedicine.mockRejectedValue(new Error(errorMessage));

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.createMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error creating medicine");
    });
  });

  describe("updateMedicine", () => {
    it("should update a medicine successfully", async () => {
      const updatedMedicineData = {
        Name: "Aspirin",
        Dosage: "300mg",
        ExpiryDate: "2025-01-01",
        Stock: 30,
      };
      Medicine.updateMedicine.mockResolvedValue({
        MedicineID: 1,
        ...updatedMedicineData,
      });

      const req = { params: { id: "1" }, body: updatedMedicineData };
      const res = {
        json: jest.fn(),
      };

      await medicineController.updateMedicine(req, res);

      expect(res.json).toHaveBeenCalledWith({
        MedicineID: 1,
        ...updatedMedicineData,
      });
    });

    it("should handle errors when updating a medicine", async () => {
      const errorMessage = "Database connection error";
      Medicine.updateMedicine.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: "1" }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.updateMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating medicine");
    });

    it("should handle case when medicine to update is not found", async () => {
      Medicine.updateMedicine.mockResolvedValue(null);

      const req = { params: { id: "1" }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.updateMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Medicine not found");
    });
  });

  describe("deleteMedicine", () => {
    it("should delete a medicine successfully", async () => {
      Medicine.deleteMedicine.mockResolvedValue(true);

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.deleteMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should handle errors when deleting a medicine", async () => {
      const errorMessage = "Database connection error";
      Medicine.deleteMedicine.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.deleteMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error deleting medicine");
    });

    it("should handle case when medicine to delete is not found", async () => {
      Medicine.deleteMedicine.mockResolvedValue(false);

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.deleteMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Medicine not found");
    });
  });

  describe("updatePatientMedicine", () => {
    it("should update patient medicine successfully", async () => {
      Medicine.updatePatientMedicine.mockResolvedValue();

      const req = { params: { patientId: "1" }, body: { medicineIds: [1, 2] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.updatePatientMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        "Patient medicine updated successfully"
      );
    });

    it("should handle errors when updating patient medicine", async () => {
      const errorMessage = "Database connection error";
      Medicine.updatePatientMedicine.mockRejectedValue(new Error(errorMessage));

      const req = { params: { patientId: "1" }, body: { medicineIds: [1, 2] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.updatePatientMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating patient medicine");
    });

    it("should handle case when medicineIds is invalid", async () => {
      const req = {
        params: { patientId: "1" },
        body: { medicineIds: "not an array" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await medicineController.updatePatientMedicine(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "medicineIds must be a non-empty array"
      );
    });
  });
});
