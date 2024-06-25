module.exports = {
  user: process.env.databaseUsername,
  password: process.env.databasePassword,
  server: process.env.awsRDSDatabaseEndpoint,
  database: process.env.databaseName,
  trustServerCertificate: true,
  options: {
    port: 1433,
    connectionTimeout: 60000,
  },
};
