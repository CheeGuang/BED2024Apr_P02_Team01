const Voucher = require("../models/voucher");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

jest.mock("mssql");

describe("Voucher Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllVouchers", () => {
    it("should return all vouchers", async () => {
      const mockVouchers = [
        {
          VoucherID: 1,
          Code: "DISCOUNT10",
          Discount: 10,
        },
        {
          VoucherID: 2,
          Code: "DISCOUNT20",
          Discount: 20,
        },
      ];

      sql.connect.mockResolvedValue({
        request: () => ({
          query: jest.fn().mockResolvedValue({ recordset: mockVouchers }),
        }),
        close: jest.fn(),
      });

      const result = await Voucher.getAllVouchers();

      expect(result).toHaveLength(mockVouchers.length);
      expect(result[0]).toBeInstanceOf(Voucher);
      expect(result[0].Code).toBe("DISCOUNT10");
    });

    it("should handle errors when getting all vouchers", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Voucher.getAllVouchers()).rejects.toThrow(errorMessage);
    });
  });

  describe("getVoucherByCode", () => {
    it("should return a voucher by code", async () => {
      const mockVoucher = {
        VoucherID: 1,
        Code: "DISCOUNT10",
        Discount: 10,
      };

      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: [mockVoucher] }),
        }),
        close: jest.fn(),
      });

      const result = await Voucher.getVoucherByCode("DISCOUNT10");

      expect(result).toBeInstanceOf(Voucher);
      expect(result.Code).toBe("DISCOUNT10");
    });

    it("should return an error if voucher not found", async () => {
      sql.connect.mockResolvedValue({
        request: () => ({
          input: jest.fn(),
          query: jest.fn().mockResolvedValue({ recordset: [] }),
        }),
        close: jest.fn(),
      });

      await expect(Voucher.getVoucherByCode("INVALIDCODE")).rejects.toThrow(
        "Voucher not found"
      );
    });

    it("should handle errors when getting a voucher by code", async () => {
      const errorMessage = "Database connection error";
      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Voucher.getVoucherByCode("DISCOUNT10")).rejects.toThrow(
        errorMessage
      );
    });
  });
});
