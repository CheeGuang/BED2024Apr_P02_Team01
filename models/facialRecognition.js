const fs = require("fs");
const path = require("path");

class FacialRecognition {
  constructor() {
    this.dataPath = path.join(__dirname, "../data/faces.json");
    this.labeledDescriptors = [];

    // Ensure the data directory exists
    if (!fs.existsSync(path.join(__dirname, "../data"))) {
      fs.mkdirSync(path.join(__dirname, "../data"));
    }

    // Load existing faces
    if (fs.existsSync(this.dataPath)) {
      this.labeledDescriptors = JSON.parse(fs.readFileSync(this.dataPath));
    }
  }

  /**
   * Add a new descriptor to the labeledDescriptors array and save to file.
   * @param {Object} param - An object containing the PatientID, DoctorID, name, and descriptor.
   */
  addDescriptor({ PatientID, DoctorID, name, descriptor }) {
    this.labeledDescriptors.push({ PatientID, DoctorID, name, descriptor });
    fs.writeFileSync(this.dataPath, JSON.stringify(this.labeledDescriptors));
  }
  /**
   * Update an existing descriptor and save to file.
   * @param {Object} param - An object containing the PatientID, DoctorID, name, and descriptor.
   * @returns {boolean} True if the descriptor was updated, false if not found.
   */
  updateDescriptor({ PatientID, DoctorID, name, descriptor }) {
    const index = this.labeledDescriptors.findIndex(
      (ld) => ld.PatientID === PatientID
    );
    if (index !== -1) {
      this.labeledDescriptors[index] = {
        PatientID,
        DoctorID,
        name,
        descriptor,
      };
      fs.writeFileSync(this.dataPath, JSON.stringify(this.labeledDescriptors));
      return true;
    }
    return false;
  }
  /**
   * Delete a descriptor and save to file.
   * @param {Object} param - An object containing the PatientID and DoctorID.
   * @returns {boolean} True if the descriptor was deleted, false if not found.
   */
  deleteDescriptor({ PatientID, DoctorID }) {
    let index;
    if (PatientID) {
      index = this.labeledDescriptors.findIndex(
        (ld) => ld.PatientID === PatientID
      );
    } else {
      index = this.labeledDescriptors.findIndex(
        (ld) => ld.DoctorID === DoctorID
      );
    }

    if (index !== -1) {
      this.labeledDescriptors.splice(index, 1);
      fs.writeFileSync(this.dataPath, JSON.stringify(this.labeledDescriptors));
      return true;
    }
    return false;
  }
  /**
   * Get all descriptors.
   * @returns {Array} An array of labeled descriptors.
   */
  getDescriptors() {
    return this.labeledDescriptors;
  }
}

module.exports = new FacialRecognition();
