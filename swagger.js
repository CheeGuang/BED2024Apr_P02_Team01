const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
  info: {
    title: "SyncHealth API",
    description:
      "API documentation for SyncHealth, providing a wide range of telemedicine services designed to enhance patient care and accessibility. The API offers functionality for managing appointments, patient records, and healthcare services, ensuring seamless integration and user experience.",
    version: "1.0.0", // Version of the API
  },
  host: "localhost:8000", // Replace with your actual host if needed
  schemes: ["http"], // Supported protocols
  tags: [
    {
      name: "Appointments",
      description: "Endpoints related to appointment operations",
    },
    {
      name: "Patients",
      description: "Endpoints related to patient operations",
    },
    { name: "Doctors", description: "Endpoints related to doctor operations" },
    {
      name: "Medicines",
      description: "Endpoints related to medicine operations",
    },
    {
      name: "Chatbots",
      description: "Endpoints related to chatbot operations",
    },
    {
      name: "CHAS Clinics",
      description: "Endpoints related to CHAS clinics operations",
    },
    {
      name: "Vouchers",
      description: "Endpoints related to voucher operations",
    },
    {
      name: "Facial Recognition",
      description: "Endpoints related to facial recognition operations",
    },
    {
      name: "Healthcare Icons",
      description: "Endpoints related to healthcare icons operations",
    },
    {
      name: "Others",
      description: "Other miscellaneous endpoints",
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "API key for authentication",
    },
  },
  definitions: {
    Appointment: {
      AppointmentID: "integer",
      PatientID: "integer",
      DoctorID: "integer",
      endDateTime: "datetime",
      PatientURL: "string",
      HostRoomURL: "string",
      IllnessDescription: "string",
      Diagnosis: "string",
      MCStartDate: "date",
      MCEndDate: "date",
      DoctorNotes: "string",
    },
    Patient: {
      PatientID: "integer",
      Email: "string",
      ContactNumber: "string",
      DOB: "date",
      Gender: "string",
      Address: "string",
      eWalletAmount: "number",
      resetPasswordCode: "string",
      PCHI: "number",
      googleId: "string",
      givenName: "string",
      familyName: "string",
      profilePicture: "string",
      Cart: "string",
    },
    Doctor: {
      DoctorID: "integer",
      Email: "string",
      ContactNumber: "string",
      DOB: "date",
      Gender: "string",
      Profession: "string",
      resetPasswordCode: "string",
      googleId: "string",
      givenName: "string",
      familyName: "string",
      profilePicture: "string",
    },
    Medicine: {
      MedicineID: "integer",
      Name: "string",
      Description: "string",
      Price: "number",
      RecommendedDosage: "string",
      Image: "string",
    },
    PatientMedicine: {
      PatientMedicineID: "integer",
      PatientID: "integer",
      MedicineID: "integer",
    },
    AppointmentMedicine: {
      AppointmentMedicineID: "integer",
      AppointmentID: "integer",
      MedicineID: "integer",
    },
    ChatHistory: {
      ChatSessionID: "string",
      PatientID: "integer",
      Sender: "string",
      Message: "string",
      Timestamp: "datetime",
    },
    MedicineRecognitionHistory: {
      PromptID: "string",
      PatientID: "integer",
      MedicineName: "string",
      MainPurpose: "string",
      SideEffects: "string",
      RecommendedDosage: "string",
      OtherRemarks: "string",
      Timestamp: "datetime",
    },
    Voucher: {
      VoucherID: "integer",
      Code: "string",
      Discount: "number",
    },
    HealthcareIcon: {
      IconID: "integer",
      IconName: "string",
      IconClass: "string",
    },
    ResponseSuccess: {
      message: "string",
      data: "object",
    },
    ResponseError: {
      message: "string",
      error: "object",
    },
  },
  responses: {
    200: {
      description: "Successful operation",
      schema: {
        $ref: "#/definitions/ResponseSuccess", // Reference to a response model
      },
    },
    400: {
      description: "Bad Request",
      schema: {
        $ref: "#/definitions/ResponseError", // Reference to an error model
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Not Found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};

swaggerAutogen(outputFile, routes, doc);
