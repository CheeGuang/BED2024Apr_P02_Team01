const axios = require("axios");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const haversine = require("haversine-distance");

class ChasClinic {
  static async getMapApiKey() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    return apiKey;
  }

  static async downloadFile() {
    const filePath = path.resolve(__dirname, "../data/chasClinic.kml");
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const url =
        "https://api-production.data.gov.sg/v2/internal/api/datasets/d_65d11d02ab0246cec53bfc995c782628/initiate-download";
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-GB,en;q=0.9",
        Origin: "https://beta.data.gov.sg",
        Referer: "https://beta.data.gov.sg/",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
      };

      const response = await axios.post(url, {}, { headers });
      const downloadLink = response.data.data.url;

      if (!downloadLink) {
        console.error("Download link not found");
        return;
      }

      const fileResponse = await axios({
        method: "GET",
        url: downloadLink,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      fileResponse.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  static async parseKmlFile() {
    const filePath = path.resolve(__dirname, "../data/chasClinic.kml");
    const fileContent = fs.readFileSync(filePath, "utf8");

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(fileContent);

    const clinics = result.kml.Document[0].Folder[0].Placemark.map(
      (placemark) => {
        const data = {};
        placemark.ExtendedData[0].SchemaData[0].SimpleData.forEach((field) => {
          data[field.$.name] = field._;
        });
        const coordinates = placemark.Point[0].coordinates[0].split(",");
        data.longitude = parseFloat(coordinates[0]);
        data.latitude = parseFloat(coordinates[1]);
        return data;
      }
    );

    return clinics;
  }

  static async getRandomClinics() {
    const clinics = await this.parseKmlFile();
    const randomClinics = clinics.sort(() => 0.5 - Math.random()).slice(0, 50);
    return randomClinics;
  }

  static async getNearestClinics(lat, lng) {
    const clinics = await this.parseKmlFile();
    clinics.forEach((clinic) => {
      clinic.distance = haversine(
        { lat, lng },
        { lat: clinic.latitude, lng: clinic.longitude }
      );
    });
    const nearestClinics = clinics
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
    return nearestClinics;
  }

  static async getClinicsInBounds(bounds) {
    const clinics = await this.parseKmlFile();
    const inBounds = clinics.filter((clinic) => {
      return (
        clinic.latitude > bounds.south &&
        clinic.latitude < bounds.north &&
        clinic.longitude > bounds.west &&
        clinic.longitude < bounds.east
      );
    });
    const sortedClinics = inBounds
      .sort(
        (a, b) =>
          haversine(bounds.center, { lat: a.latitude, lng: a.longitude }) -
          haversine(bounds.center, { lat: b.latitude, lng: b.longitude })
      )
      .slice(0, 20);
    return sortedClinics;
  }
}

module.exports = ChasClinic;
