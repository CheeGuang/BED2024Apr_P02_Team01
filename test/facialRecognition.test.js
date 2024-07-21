const fs = require("fs");
const path = require("path");
const FacialRecognition = require("../models/facialRecognition"); // Adjust the path as necessary

jest.mock("fs");

describe("FacialRecognition Model", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("addDescriptor", () => {
    it("should add a new descriptor and save to file", () => {
      const mockDescriptor = {
        PatientID: "1",
        DoctorID: "2",
        name: "John Doe",
        descriptor: "someDescriptorData",
      };

      fs.writeFileSync = jest.fn(); // Mock the writeFileSync function

      FacialRecognition.addDescriptor(mockDescriptor);

      expect(FacialRecognition.labeledDescriptors).toContainEqual(
        mockDescriptor
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../data/faces.json"),
        JSON.stringify(FacialRecognition.labeledDescriptors)
      );
    });
  });

  describe("updateDescriptor", () => {
    it("should update an existing descriptor and save to file", () => {
      const initialDescriptor = {
        PatientID: "1",
        DoctorID: "2",
        name: "John Doe",
        descriptor: "oldDescriptorData",
      };

      const updatedDescriptor = {
        PatientID: "1",
        DoctorID: "2",
        name: "John Doe",
        descriptor: "newDescriptorData",
      };

      FacialRecognition.addDescriptor(initialDescriptor); // Add initial descriptor

      fs.writeFileSync = jest.fn(); // Mock the writeFileSync function

      const result = FacialRecognition.updateDescriptor(updatedDescriptor);

      expect(result).toBe(true);
      expect(FacialRecognition.labeledDescriptors).toContainEqual(
        updatedDescriptor
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../data/faces.json"),
        JSON.stringify(FacialRecognition.labeledDescriptors)
      );
    });

    it("should return false if descriptor is not found", () => {
      const updatedDescriptor = {
        PatientID: "999",
        DoctorID: "2",
        name: "John Doe",
        descriptor: "nonExistentDescriptorData",
      };

      fs.writeFileSync = jest.fn(); // Mock the writeFileSync function

      const result = FacialRecognition.updateDescriptor(updatedDescriptor);

      expect(result).toBe(false);
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe("deleteDescriptor", () => {
    it("should delete a descriptor and save to file", () => {
      const initialDescriptor = {
        PatientID: "1",
        DoctorID: "2",
        name: "John Doe",
        descriptor: "someDescriptorData",
      };

      FacialRecognition.addDescriptor(initialDescriptor); // Add initial descriptor

      fs.writeFileSync = jest.fn(); // Mock the writeFileSync function

      const result = FacialRecognition.deleteDescriptor({
        PatientID: "1",
        DoctorID: "2",
      });

      expect(result).toBe(true);
      expect(FacialRecognition.labeledDescriptors).not.toContainEqual(
        `[{"DoctorID": "2", "PatientID": "1", "descriptor": "oldDescriptorData", "name": "John Doe"}, {"DoctorID": "2", "PatientID": "1", "descriptor": "someDescriptorData", "name": "John Doe"}]`
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(__dirname, "../data/faces.json"),
        JSON.stringify(FacialRecognition.labeledDescriptors)
      );
    });

    it("should return false if descriptor is not found", () => {
      fs.writeFileSync = jest.fn(); // Mock the writeFileSync function

      const result = FacialRecognition.deleteDescriptor({
        PatientID: "999",
        DoctorID: "2",
      });

      expect(result).toBe(false);
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe("getDescriptors", () => {
    it("should retrieve all descriptors", () => {
      const mockDescriptors = [
        {
          PatientID: "1",
          DoctorID: "2",
          name: "John Doe",
          descriptor: "someDescriptorData",
        },
      ];

      FacialRecognition.labeledDescriptors = mockDescriptors; // Set descriptors directly

      const descriptors = FacialRecognition.getDescriptors();

      expect(descriptors).toEqual(mockDescriptors);
    });
  });
});
