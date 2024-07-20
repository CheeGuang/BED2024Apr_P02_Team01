const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Voucher {
    constructor(VoucherID, Code, Discount) {
      this.VoucherID = VoucherID;
      this.Code = Code;
      this.Discount = Discount;
    }

    static async getAllVouchers() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Voucher`;
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) =>
            new Voucher(
              row.VoucherID,
              row.Code,
              row.Discount
            )
        );
      }
      
    static async getVoucherByCode(code) {
      const connection = await sql.connect(dbConfig);
    
      const sqlQuery = `SELECT * FROM Voucher WHERE Code = @code`;
      const request = connection.request();
      request.input("code", sql.VarChar, code);
    
      const result = await request.query(sqlQuery);
    
      connection.close();
    
      if (result.recordset.length === 1) {
        const { VoucherID, Code, Discount } = result.recordset[0];
        return new Voucher(VoucherID, Code, Discount);
      } else {
        throw new Error("Voucher not found");
      }
    }
}

module.exports = Voucher;