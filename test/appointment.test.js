const { Appointment, appointmentEmitter } = require("../models/appointment");
const sql = require("mssql");
const PDFDocument = require("pdfkit");
const path = require("path");

jest.mock("mssql"); // Mock the mssql library
jest.mock("pdfkit"); // Mock the pdfkit library

describe("Appointment Model", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("getAllAppointments", () => {
    it("should retrieve all appointments from the database", async () => {
      const mockAppointments = [
        {
          AppointmentID: 1,
          PatientID: 1,
          DoctorID: 1,
          endDateTime: "2024-06-25T09:00:00",
          PatientURL: "http://patienturl.com",
          HostRoomURL: "http://hostroomurl.com",
          IllnessDescription: "Fever and headache",
          Diagnosis: "Common cold",
          MCStartDate: "2024-06-25",
          MCEndDate: "2024-06-27",
          DoctorNotes: "Rest and stay hydrated.",
        },
        {
          AppointmentID: 2,
          PatientID: 2,
          DoctorID: 2,
          endDateTime: "2024-06-26T10:00:00",
          PatientURL: "http://patienturl2.com",
          HostRoomURL: "http://hostroomurl2.com",
          IllnessDescription: "Cough and cold",
          Diagnosis: "Flu",
          MCStartDate: "2024-06-26",
          MCEndDate: "2024-06-28",
          DoctorNotes: "Take medicine and rest.",
        },
      ];

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockAppointments }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const appointments = await Appointment.getAllAppointments();

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointments).toHaveLength(2);
      expect(appointments[0]).toBeInstanceOf(Appointment);
      expect(appointments[0].AppointmentID).toBe(1);
      expect(appointments[0].PatientID).toBe(1);
      expect(appointments[0].DoctorID).toBe(1);
      expect(appointments[0].endDateTime).toBe("2024-06-25T09:00:00");
      expect(appointments[0].PatientURL).toBe("http://patienturl.com");
      expect(appointments[0].HostRoomURL).toBe("http://hostroomurl.com");
      expect(appointments[0].IllnessDescription).toBe("Fever and headache");
      expect(appointments[0].Diagnosis).toBe("Common cold");
      expect(appointments[0].MCStartDate).toBe("2024-06-25");
      expect(appointments[0].MCEndDate).toBe("2024-06-27");
      expect(appointments[0].DoctorNotes).toBe("Rest and stay hydrated.");
      // ... Add assertions for the second appointment
      expect(appointments[1]).toBeInstanceOf(Appointment);
      expect(appointments[1].AppointmentID).toBe(2);
      expect(appointments[1].PatientID).toBe(2);
      expect(appointments[1].DoctorID).toBe(2);
      expect(appointments[1].endDateTime).toBe("2024-06-26T10:00:00");
      expect(appointments[1].PatientURL).toBe("http://patienturl2.com");
      expect(appointments[1].HostRoomURL).toBe("http://hostroomurl2.com");
      expect(appointments[1].IllnessDescription).toBe("Cough and cold");
      expect(appointments[1].Diagnosis).toBe("Flu");
      expect(appointments[1].MCStartDate).toBe("2024-06-26");
      expect(appointments[1].MCEndDate).toBe("2024-06-28");
      expect(appointments[1].DoctorNotes).toBe("Take medicine and rest.");
    });

    it("should handle errors when retrieving appointments", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Appointment.getAllAppointments()).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("getAppointmentById", () => {
    it("should retrieve an appointment by ID", async () => {
      const mockAppointment = {
        AppointmentID: 1,
        PatientID: 1,
        DoctorID: 1,
        endDateTime: "2024-06-25T09:00:00",
        PatientURL: "http://patienturl.com",
        HostRoomURL: "http://hostroomurl.com",
        IllnessDescription: "Fever and headache",
        Diagnosis: "Common cold",
        MCStartDate: "2024-06-25",
        MCEndDate: "2024-06-27",
        DoctorNotes: "Rest and stay hydrated.",
      };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [mockAppointment] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const appointment = await Appointment.getAppointmentById(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.AppointmentID).toBe(1);
      expect(appointment.PatientID).toBe(1);
      expect(appointment.DoctorID).toBe(1);
      expect(appointment.endDateTime).toBe("2024-06-25T09:00:00");
      expect(appointment.PatientURL).toBe("http://patienturl.com");
      expect(appointment.HostRoomURL).toBe("http://hostroomurl.com");
      expect(appointment.IllnessDescription).toBe("Fever and headache");
      expect(appointment.Diagnosis).toBe("Common cold");
      expect(appointment.MCStartDate).toBe("2024-06-25");
      expect(appointment.MCEndDate).toBe("2024-06-27");
      expect(appointment.DoctorNotes).toBe("Rest and stay hydrated.");
    });

    it("should return null if the appointment is not found", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const appointment = await Appointment.getAppointmentById(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointment).toBeNull();
    });

    it("should handle errors when retrieving an appointment by ID", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(Appointment.getAppointmentById(1)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("getAppointmentsByPatientId", () => {
    it("should retrieve appointments by patient ID", async () => {
      const mockAppointments = [
        {
          AppointmentID: 1,
          PatientID: 1,
          DoctorID: 1,
          endDateTime: "2024-06-25T09:00:00",
          PatientURL: "http://patienturl.com",
          HostRoomURL: "http://hostroomurl.com",
          IllnessDescription: "Fever and headache",
          Diagnosis: "Common cold",
          MCStartDate: "2024-06-25",
          MCEndDate: "2024-06-27",
          DoctorNotes: "Rest and stay hydrated.",
        },
      ];

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: mockAppointments }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const appointments = await Appointment.getAppointmentsByPatientId(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("PatientID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointments).toHaveLength(1);
      expect(appointments[0]).toBeInstanceOf(Appointment);
      expect(appointments[0].AppointmentID).toBe(1);
      expect(appointments[0].PatientID).toBe(1);
      expect(appointments[0].DoctorID).toBe(1);
      expect(appointments[0].endDateTime).toBe("2024-06-25T09:00:00");
      expect(appointments[0].PatientURL).toBe("http://patienturl.com");
      expect(appointments[0].HostRoomURL).toBe("http://hostroomurl.com");
      expect(appointments[0].IllnessDescription).toBe("Fever and headache");
      expect(appointments[0].Diagnosis).toBe("Common cold");
      expect(appointments[0].MCStartDate).toBe("2024-06-25");
      expect(appointments[0].MCEndDate).toBe("2024-06-27");
      expect(appointments[0].DoctorNotes).toBe("Rest and stay hydrated.");
    });

    it("should handle errors when retrieving appointments by patient ID", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(Appointment.getAppointmentsByPatientId(1)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("getAppointmentsByDoctorId", () => {
    it("should retrieve appointments by doctor ID", async () => {
      const mockAppointments = [
        {
          AppointmentID: 1,
          PatientID: 1,
          DoctorID: 1,
          endDateTime: "2024-06-25T09:00:00",
          PatientURL: "http://patienturl.com",
          HostRoomURL: "http://hostroomurl.com",
          IllnessDescription: "Fever and headache",
          Diagnosis: "Common cold",
          MCStartDate: "2024-06-25",
          MCEndDate: "2024-06-27",
          DoctorNotes: "Rest and stay hydrated.",
        },
      ];

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: mockAppointments }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const appointments = await Appointment.getAppointmentsByDoctorId(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("DoctorID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointments).toHaveLength(1);
      expect(appointments[0]).toBeInstanceOf(Appointment);
      expect(appointments[0].AppointmentID).toBe(1);
      expect(appointments[0].PatientID).toBe(1);
      expect(appointments[0].DoctorID).toBe(1);
      expect(appointments[0].endDateTime).toBe("2024-06-25T09:00:00");
      expect(appointments[0].PatientURL).toBe("http://patienturl.com");
      expect(appointments[0].HostRoomURL).toBe("http://hostroomurl.com");
      expect(appointments[0].IllnessDescription).toBe("Fever and headache");
      expect(appointments[0].Diagnosis).toBe("Common cold");
      expect(appointments[0].MCStartDate).toBe("2024-06-25");
      expect(appointments[0].MCEndDate).toBe("2024-06-27");
      expect(appointments[0].DoctorNotes).toBe("Rest and stay hydrated.");
    });

    it("should handle errors when retrieving appointments by doctor ID", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(Appointment.getAppointmentsByDoctorId(1)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("getUnassignedAppointments", () => {
    it("should retrieve unassigned appointments", async () => {
      const mockAppointments = [
        {
          AppointmentID: 1,
          PatientID: 1,
          DoctorID: null,
          endDateTime: "2024-06-25T09:00:00",
          PatientURL: "http://patienturl.com",
          HostRoomURL: "http://hostroomurl.com",
          IllnessDescription: "Fever and headache",
          Diagnosis: "Common cold",
          MCStartDate: "2024-06-25",
          MCEndDate: "2024-06-27",
          DoctorNotes: "Rest and stay hydrated.",
        },
      ];

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockAppointments }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const appointments = await Appointment.getUnassignedAppointments();

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointments).toHaveLength(1);
      expect(appointments[0]).toBeInstanceOf(Appointment);
      expect(appointments[0].AppointmentID).toBe(1);
      expect(appointments[0].PatientID).toBe(1);
      expect(appointments[0].DoctorID).toBe(null);
      expect(appointments[0].endDateTime).toBe("2024-06-25T09:00:00");
      expect(appointments[0].PatientURL).toBe("http://patienturl.com");
      expect(appointments[0].HostRoomURL).toBe("http://hostroomurl.com");
      expect(appointments[0].IllnessDescription).toBe("Fever and headache");
      expect(appointments[0].Diagnosis).toBe("Common cold");
      expect(appointments[0].MCStartDate).toBe("2024-06-25");
      expect(appointments[0].MCEndDate).toBe("2024-06-27");
      expect(appointments[0].DoctorNotes).toBe("Rest and stay hydrated.");
    });

    it("should handle errors when retrieving unassigned appointments", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(Appointment.getUnassignedAppointments()).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("createAppointment", () => {
    it("should create a new appointment", async () => {
      const newAppointmentData = {
        PatientID: 1,
        DoctorID: 1,
        endDateTime: "2024-06-25T09:00:00",
        PatientURL: "http://patienturl.com",
        HostRoomURL: "http://hostroomurl.com",
        IllnessDescription: "Fever and headache",
        Diagnosis: "Common cold",
        MCStartDate: "2024-06-25",
        MCEndDate: "2024-06-27",
        DoctorNotes: "Rest and stay hydrated.",
      };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest
          .fn()
          .mockResolvedValue({ recordset: [{ AppointmentID: 1 }] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const mockAppointment = new Appointment(
        1,
        newAppointmentData.PatientID,
        newAppointmentData.DoctorID,
        newAppointmentData.endDateTime,
        newAppointmentData.PatientURL,
        newAppointmentData.HostRoomURL,
        newAppointmentData.IllnessDescription,
        newAppointmentData.Diagnosis,
        newAppointmentData.MCStartDate,
        newAppointmentData.MCEndDate,
        newAppointmentData.DoctorNotes
      );

      Appointment.getAppointmentById = jest
        .fn()
        .mockResolvedValue(mockAppointment);

      const appointment = await Appointment.createAppointment(
        newAppointmentData
      );

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith(
        "PatientID",
        newAppointmentData.PatientID
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "DoctorID",
        newAppointmentData.DoctorID
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "endDateTime",
        newAppointmentData.endDateTime
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "PatientURL",
        newAppointmentData.PatientURL
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "HostRoomURL",
        newAppointmentData.HostRoomURL
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "IllnessDescription",
        newAppointmentData.IllnessDescription
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "Diagnosis",
        newAppointmentData.Diagnosis
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "MCStartDate",
        newAppointmentData.MCStartDate
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "MCEndDate",
        newAppointmentData.MCEndDate
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "DoctorNotes",
        newAppointmentData.DoctorNotes
      );
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.AppointmentID).toBe(1);
    });

    it("should handle errors when creating an appointment", async () => {
      const newAppointmentData = {
        PatientID: 1,
        DoctorID: 1,
        endDateTime: "2024-06-25T09:00:00",
        PatientURL: "http://patienturl.com",
        HostRoomURL: "http://hostroomurl.com",
        IllnessDescription: "Fever and headache",
        Diagnosis: "Common cold",
        MCStartDate: "2024-06-25",
        MCEndDate: "2024-06-27",
        DoctorNotes: "Rest and stay hydrated.",
      };

      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(
        Appointment.createAppointment(newAppointmentData)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("updateAppointment", () => {
    it("should update an appointment", async () => {
      const updatedAppointmentData = {
        PatientID: 1,
        DoctorID: 1,
        endDateTime: "2024-06-25T09:00:00",
        PatientURL: "http://patienturl.com",
        HostRoomURL: "http://hostroomurl.com",
        IllnessDescription: "Fever and headache",
        Diagnosis: "Common cold",
        MCStartDate: "2024-06-25",
        MCEndDate: "2024-06-27",
        DoctorNotes: "Rest and stay hydrated.",
      };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({}),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const mockAppointment = new Appointment(
        1,
        updatedAppointmentData.PatientID,
        updatedAppointmentData.DoctorID,
        updatedAppointmentData.endDateTime,
        updatedAppointmentData.PatientURL,
        updatedAppointmentData.HostRoomURL,
        updatedAppointmentData.IllnessDescription,
        updatedAppointmentData.Diagnosis,
        updatedAppointmentData.MCStartDate,
        updatedAppointmentData.MCEndDate,
        updatedAppointmentData.DoctorNotes
      );

      Appointment.getAppointmentById = jest
        .fn()
        .mockResolvedValue(mockAppointment);

      const appointment = await Appointment.updateAppointment(
        1,
        updatedAppointmentData
      );

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockRequest.input).toHaveBeenCalledWith(
        "PatientID",
        updatedAppointmentData.PatientID
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "DoctorID",
        updatedAppointmentData.DoctorID
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "endDateTime",
        updatedAppointmentData.endDateTime
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "PatientURL",
        updatedAppointmentData.PatientURL
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "HostRoomURL",
        updatedAppointmentData.HostRoomURL
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "IllnessDescription",
        updatedAppointmentData.IllnessDescription
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "Diagnosis",
        updatedAppointmentData.Diagnosis
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "MCStartDate",
        updatedAppointmentData.MCStartDate
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "MCEndDate",
        updatedAppointmentData.MCEndDate
      );
      expect(mockRequest.input).toHaveBeenCalledWith(
        "DoctorNotes",
        updatedAppointmentData.DoctorNotes
      );
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.AppointmentID).toBe(1);
    });

    it("should handle errors when updating an appointment", async () => {
      const updatedAppointmentData = {
        PatientID: 1,
        DoctorID: 1,
        endDateTime: "2024-06-25T09:00:00",
        PatientURL: "http://patienturl.com",
        HostRoomURL: "http://hostroomurl.com",
        IllnessDescription: "Fever and headache",
        Diagnosis: "Common cold",
        MCStartDate: "2024-06-25",
        MCEndDate: "2024-06-27",
        DoctorNotes: "Rest and stay hydrated.",
      };

      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(
        Appointment.updateAppointment(1, updatedAppointmentData)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("updateDoctorId", () => {
    it("should update the doctor ID of an appointment", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({}),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const mockAppointment = new Appointment(
        1,
        1,
        2, // Updated DoctorID
        "2024-06-25T09:00:00",
        "http://patienturl.com",
        "http://hostroomurl.com",
        "Fever and headache",
        "Common cold",
        "2024-06-25",
        "2024-06-27",
        "Rest and stay hydrated."
      );

      Appointment.getAppointmentById = jest
        .fn()
        .mockResolvedValue(mockAppointment);

      const appointment = await Appointment.updateDoctorId(1, 2);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockRequest.input).toHaveBeenCalledWith("DoctorID", 2);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.DoctorID).toBe(2);
    });

    it("should handle errors when updating the doctor ID of an appointment", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(Appointment.updateDoctorId(1, 2)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("deleteAppointment", () => {
    it("should delete an appointment", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const result = await Appointment.deleteAppointment(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it("should return false if no rows were affected", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [0] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const result = await Appointment.deleteAppointment(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it("should handle errors when deleting an appointment", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(Appointment.deleteAppointment(1)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("addMedicinesToAppointment", () => {
    it("should add medicines to an appointment", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({}),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      Appointment.updatePatientMedicineTable = jest
        .fn()
        .mockResolvedValue(undefined);

      await Appointment.addMedicinesToAppointment(1, [1, 2, 3]);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockRequest.input).toHaveBeenCalledWith("MedicineID", 1);
      expect(mockRequest.query).toHaveBeenCalledTimes(3); // Called for each medicine
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(Appointment.updatePatientMedicineTable).toHaveBeenCalledWith(1);
    });

    it("should handle errors when adding medicines to an appointment", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(
        Appointment.addMedicinesToAppointment(1, [1, 2, 3])
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("getMedicinesForAppointment", () => {
    it("should retrieve medicines for an appointment", async () => {
      const mockMedicines = [
        {
          MedicineID: 1,
          Name: "Aspirin",
          Description: "Pain reliever and fever reducer.",
          Price: 5.0,
          RecommendedDosage:
            "Take 1-2 tablets after meals, up to 4 times a day.",
          Image: "aspirin.jpg",
        },
        {
          MedicineID: 2,
          Name: "Ibuprofen",
          Description: "Nonsteroidal anti-inflammatory drug.",
          Price: 10.0,
          RecommendedDosage: "Take 1 tablet after meals, up to 3 times a day.",
          Image: "ibuprofen.jpg",
        },
      ];

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: mockMedicines }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const medicines = await Appointment.getMedicinesForAppointment(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(medicines).toHaveLength(2);
      expect(medicines[0].MedicineID).toBe(1);
      expect(medicines[0].Name).toBe("Aspirin");
      expect(medicines[0].Description).toBe("Pain reliever and fever reducer.");
      expect(medicines[0].Price).toBe(5.0);
      expect(medicines[0].RecommendedDosage).toBe(
        "Take 1-2 tablets after meals, up to 4 times a day."
      );
      expect(medicines[0].Image).toBe("aspirin.jpg");
      expect(medicines[1].MedicineID).toBe(2);
      expect(medicines[1].Name).toBe("Ibuprofen");
      expect(medicines[1].Description).toBe(
        "Nonsteroidal anti-inflammatory drug."
      );
      expect(medicines[1].Price).toBe(10.0);
      expect(medicines[1].RecommendedDosage).toBe(
        "Take 1 tablet after meals, up to 3 times a day."
      );
      expect(medicines[1].Image).toBe("ibuprofen.jpg");
    });

    it("should handle errors when retrieving medicines for an appointment", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(Appointment.getMedicinesForAppointment(1)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("getAppointmentDetailsById", () => {
    it("should retrieve appointment details by ID", async () => {
      const mockDetails = {
        PatientFullName: "John Doe",
        DoctorFullName: "Dr. Jane Smith",
        IllnessDescription: "Fever and headache",
        Diagnosis: "Common cold",
        MCStartDate: "2024-06-25",
        MCEndDate: "2024-06-27",
      };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [mockDetails] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const details = await Appointment.getAppointmentDetailsById(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(details.PatientFullName).toBe("John Doe");
      expect(details.DoctorFullName).toBe("Dr. Jane Smith");
      expect(details.IllnessDescription).toBe("Fever and headache");
      expect(details.Diagnosis).toBe("Common cold");
      expect(details.MCStartDate).toBe("2024-06-25");
      expect(details.MCEndDate).toBe("2024-06-27");
    });

    it("should return null if appointment details are not found", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const details = await Appointment.getAppointmentDetailsById(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("AppointmentID", 1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(details).toBeNull();
    });

    it("should handle errors when retrieving appointment details by ID", async () => {
      const errorMessage = "Database Error";
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      await expect(Appointment.getAppointmentDetailsById(1)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("generateMedicalCertificate", () => {
    it("should generate a medical certificate PDF", async () => {
      const mockDetails = {
        PatientFullName: "John Doe",
        DoctorFullName: "Dr. Jane Smith",
        IllnessDescription: "Fever and headache",
        Diagnosis: "Common cold",
        MCStartDate: "2024-06-25",
        MCEndDate: "2024-06-27",
      };

      Appointment.getAppointmentDetailsById = jest
        .fn()
        .mockResolvedValue(mockDetails);

      const mockBuffers = [];
      PDFDocument.prototype.image = jest.fn();
      PDFDocument.prototype.fontSize = jest.fn().mockReturnThis();
      PDFDocument.prototype.text = jest.fn().mockReturnThis();
      PDFDocument.prototype.moveDown = jest.fn().mockReturnThis();
      PDFDocument.prototype.end = jest.fn().mockImplementation(() => {
        mockBuffers.push(Buffer.from("PDF content"));
        mockBuffers.push(Buffer.from("more PDF content"));
      });
      PDFDocument.prototype.on = jest.fn((event, callback) => {
        if (event === "data") {
          mockBuffers.forEach(callback);
        }
        if (event === "end") {
          callback();
        }
      });

      const pdfBuffer = await Appointment.generateMedicalCertificate(1);

      expect(Appointment.getAppointmentDetailsById).toHaveBeenCalledWith(1);
      expect(pdfBuffer).toBeInstanceOf(Buffer);
    });

    it("should handle errors when generating a medical certificate PDF", async () => {
      const errorMessage = "Error generating PDF";
      Appointment.getAppointmentDetailsById = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await expect(Appointment.generateMedicalCertificate(1)).rejects.toThrow(
        errorMessage
      );
    });
  });
});
