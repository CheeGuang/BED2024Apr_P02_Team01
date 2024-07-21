const voucherController = require("../modules/voucher/controllers/voucherController");
const Voucher = require("../models/voucher");

jest.mock("../models/voucher");

describe("Voucher Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllVouchers", () => {
    it("should retrieve all vouchers successfully", async () => {
      const mockVouchers = [
        {
          VoucherID: 1,
          Code: "ABC123",
          Discount: 10,
          ExpiryDate: "2024-12-31",
        },
      ];
      Voucher.getAllVouchers.mockResolvedValue(mockVouchers);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await voucherController.getAllVouchers(req, res);

      expect(res.json).toHaveBeenCalledWith(mockVouchers);
    });

    it("should handle errors when retrieving all vouchers", async () => {
      const errorMessage = "Database connection error";
      Voucher.getAllVouchers.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await voucherController.getAllVouchers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving vouchers");
    });
  });

  describe("getVoucherByCode", () => {
    it("should retrieve a voucher by code successfully", async () => {
      const mockVoucher = {
        VoucherID: 1,
        Code: "ABC123",
        Discount: 10,
        ExpiryDate: "2024-12-31",
      };
      Voucher.getVoucherByCode.mockResolvedValue(mockVoucher);

      const req = { params: { code: "ABC123" } };
      const res = {
        json: jest.fn(),
      };

      await voucherController.getVoucherByCode(req, res);

      expect(res.json).toHaveBeenCalledWith(mockVoucher);
    });

    it("should handle errors when retrieving a voucher by code", async () => {
      const errorMessage = "Database connection error";
      Voucher.getVoucherByCode.mockRejectedValue(new Error(errorMessage));

      const req = { params: { code: "ABC123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await voucherController.getVoucherByCode(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Voucher not found");
    });

    it("should handle case when voucher is not found by code", async () => {
      Voucher.getVoucherByCode.mockResolvedValue(null);

      const req = { params: { code: "ABC123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await voucherController.getVoucherByCode(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Voucher not found");
    });
  });
});
