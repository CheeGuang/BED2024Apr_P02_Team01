const sql = require("mssql");
const Patient = require("../models/patient");

jest.mock("mssql");

describe("Patient Model", () => {
  let mockConnection;
  let mockRequest;

  beforeEach(() => {
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };
    mockConnection = {
      request: jest.fn(() => mockRequest),
      close: jest.fn(),
    };
    sql.connect.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findOrCreateGoogleUser", () => {
    it("should find an existing patient or create a new one", async () => {
      const googleUserData = {
        googleId: "googleId123",
        Email: "john.doe@example.com",
        givenName: "John",
        familyName: "Doe",
        profilePicture: "profilePicture.jpg",
      };
      mockRequest.query.mockResolvedValueOnce({
        recordset: [],
      });
      mockRequest.query.mockResolvedValueOnce({
        recordset: [{ PatientID: 1 }],
      });
      mockRequest.query.mockResolvedValueOnce({
        recordset: [
          {
            PatientID: 1,
            Email: "john.doe@example.com",
            ContactNumber: "1234567890",
            DOB: "1980-01-01",
            Gender: "Male",
            Address: "123 Main St",
            eWalletAmount: 100,
            resetPasswordCode: "resetCode123",
            PCHI: 1000,
            googleId: "googleId123",
            givenName: "John",
            familyName: "Doe",
            profilePicture: "profilePicture.jpg",
            Cart: "{}",
          },
        ],
      });

      const patient = await Patient.findOrCreateGoogleUser(googleUserData);

      expect(patient).toHaveProperty("PatientID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(2);
    });

    it("should handle errors during find or create", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.findOrCreateGoogleUser({})).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("getPatientById", () => {
    it("should retrieve a patient by ID", async () => {
      mockRequest.query.mockResolvedValueOnce({
        recordset: [
          {
            PatientID: 1,
            Email: "john.doe@example.com",
            ContactNumber: "1234567890",
            DOB: "1980-01-01",
            Gender: "Male",
            Address: "123 Main St",
            eWalletAmount: 100,
            resetPasswordCode: "resetCode123",
            PCHI: 1000,
            googleId: "googleId123",
            givenName: "John",
            familyName: "Doe",
            profilePicture: "profilePicture.jpg",
            Cart: "{}",
          },
        ],
      });

      const patient = await Patient.getPatientById(1);

      expect(patient).toHaveProperty("PatientID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during retrieval", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.getPatientById(1)).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("createPatient", () => {
    it("should create a new patient", async () => {
      const newPatientData = {
        Email: "john.doe@example.com",
        ContactNumber: "1234567890",
        DOB: "1980-01-01",
        Gender: "Male",
        Address: "123 Main St",
        eWalletAmount: 100,
        resetPasswordCode: "resetCode123",
        PCHI: 1000,
        googleId: "googleId123",
        givenName: "John",
        familyName: "Doe",
        profilePicture: "profilePicture.jpg",
        Cart: "{}",
      };

      mockRequest.query.mockResolvedValueOnce({
        recordset: [{ PatientID: 1 }],
      });

      mockRequest.query.mockResolvedValueOnce({
        recordset: [
          {
            PatientID: 1,
            Email: "john.doe@example.com",
            ContactNumber: "1234567890",
            DOB: "1980-01-01",
            Gender: "Male",
            Address: "123 Main St",
            eWalletAmount: 100,
            resetPasswordCode: "resetCode123",
            PCHI: 1000,
            googleId: "googleId123",
            givenName: "John",
            familyName: "Doe",
            profilePicture: "profilePicture.jpg",
            Cart: "{}",
          },
        ],
      });

      const patient = await Patient.createPatient(newPatientData);

      expect(patient).toHaveProperty("PatientID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(2);
    });

    it("should handle errors during patient creation", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.createPatient({})).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("updatePatient", () => {
    it("should handle errors during patient update", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.updatePatient(1, {})).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("deletePatient", () => {
    it("should delete a patient", async () => {
      mockRequest.query.mockResolvedValueOnce({
        rowsAffected: [1],
      });

      const result = await Patient.deletePatient(1);

      expect(result).toBe(true);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during patient deletion", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.deletePatient(1)).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("searchPatients", () => {
    it("should search for patients by email, given name, or family name", async () => {
      mockRequest.query.mockResolvedValueOnce({
        recordset: [
          {
            PatientID: 1,
            Email: "john.doe@example.com",
            ContactNumber: "1234567890",
            DOB: "1980-01-01",
            Gender: "Male",
            Address: "123 Main St",
            eWalletAmount: 100,
            resetPasswordCode: "resetCode123",
            PCHI: 1000,
            googleId: "googleId123",
            givenName: "John",
            familyName: "Doe",
            profilePicture: "profilePicture.jpg",
            Cart: "{}",
          },
        ],
      });

      const patients = await Patient.searchPatients("john");

      expect(patients.length).toBe(1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during patient search", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.searchPatients("john")).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("updateAccountName", () => {
    it("should handle errors during account name update", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.updateAccountName(1, "John", "Doe")).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("updateAccountContact", () => {
    it("should handle errors during account contact update", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        Patient.updateAccountContact(1, "0987654321")
      ).rejects.toThrow(new Error(errorMessage));
    });
  });

  describe("updateAccountDOB", () => {
    it("should handle errors during account DOB update", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.updateAccountDOB(1, "1981-02-02")).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("updateAccountAddress", () => {
    it("should handle errors during account address update", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        Patient.updateAccountAddress(1, "456 New Address")
      ).rejects.toThrow(new Error(errorMessage));
    });
  });

  describe("updateEWalletAmount", () => {
    it("should handle errors during eWallet amount update", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.updateEWalletAmount(1, 150.0)).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });

  describe("updateCart", () => {
    it("should handle errors during cart update", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.updateCart(1, "{}")).rejects.toThrow(
        "Error updating patient cart: Database connection error"
      );
    });
  });

  describe("clearCart", () => {
    it("should clear the patient's cart", async () => {
      mockRequest.query.mockResolvedValueOnce({
        rowsAffected: [1],
      });

      await Patient.clearCart(1);

      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during cart clearance", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Patient.clearCart(1)).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });
});
