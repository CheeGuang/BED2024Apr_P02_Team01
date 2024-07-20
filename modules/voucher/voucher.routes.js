// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising dbConfig file
const voucherController = require("./controllers/voucherController");

// ========== Middleware ==========
// Initializing authMiddleware
const authorizeUser = require("../../middlewares/authMiddleware");

// ========== Set-up ==========
// Initialising voucherRoutes
const voucherRoutes = express.Router();

// ========== Routes ==========
// Define routes for the voucher
voucherRoutes.get("/", authorizeUser, voucherController.getAllVouchers);
voucherRoutes.get("/:code", authorizeUser, voucherController.getVoucherByCode);

// ========== Export ==========
module.exports = voucherRoutes;
