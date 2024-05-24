module.exports = {
  user: process.env.awsRDSDatabaseUsername,
  password: process.env.awsRDSDatabaseMasterPassword,
  server: process.env.awsRDSDatabaseEndpoint,
  database: process.env.awsRDSDatabaseName,
  trustServerCertificate: true,
  options: {
    port: 1433,
    connectionTimeout: 60000,
  },
};
