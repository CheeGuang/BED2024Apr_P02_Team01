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
   * @param {Object} param - An object containing the name and descriptor.
   */
  addDescriptor({ name, descriptor }) {
    this.labeledDescriptors.push({ name, descriptor });
    fs.writeFileSync(this.dataPath, JSON.stringify(this.labeledDescriptors));
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
