const Voucher = require("../../../models/voucher.js");

const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.getAllVouchers();
    res.json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving vouchers");
  }
};

const getVoucherByCode = async (req, res) => {
  const code = req.params.code;

  try {
    const voucher = await Voucher.getVoucherByCode(code);
    res.json(voucher);
  } catch (error) {
    console.error(error);
    res.status(404).send("Voucher not found");
  }
};

module.exports = {
  getAllVouchers,
  getVoucherByCode,
};