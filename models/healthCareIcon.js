const sql = require("mssql");
const dbConfig = require("../dbConfig");

class HealthcareIcon {
  constructor(IconID, IconName, IconClass) {
    this.IconID = IconID;
    this.IconName = IconName;
    this.IconClass = IconClass;
  }

  /**
   * Retrieves any 4 random icons from the HealthcareIcons table.
   *
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of 4 random icon objects.
   * Each object contains the properties: IconID, IconName, and IconClass.
   *
   * @throws {Error} If there is an error connecting to the database or executing the query.
   *
   * Example usage:
   *
   * const randomIcons = await HealthcareIcon.getRandomIcons();
   * console.log(randomIcons);
   *
   * // Output:
   * // [
   * //   { IconID: 1, IconName: "heart", IconClass: "fas fa-heart" },
   * //   { IconID: 5, IconName: "pills", IconClass: "fas fa-pills" },
   * //   { IconID: 9, IconName: "user-md", IconClass: "fas fa-user-md" },
   * //   { IconID: 12, IconName: "microscope", IconClass: "fas fa-microscope" }
   * // ]
   */
  static async getRandomIcons() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT TOP 4 * FROM HealthcareIcons ORDER BY NEWID()`;
    const result = await connection.request().query(sqlQuery);
    connection.close();

    // Convert icons to an array of objects
    const icons = result.recordset.map((item) => ({
      IconID: item.IconID,
      IconName: item.IconName,
      IconClass: item.IconClass,
    }));

    return icons;
  }
}

module.exports = HealthcareIcon;
