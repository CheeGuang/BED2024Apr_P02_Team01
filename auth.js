const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { google } = require("googleapis"); // this is for google calendar
const Patient = require("./models/patient"); // Ensure this path is correct
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientSecret,
      clientSecret: process.env.googleClientSecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"], // Request access to google calendar API
    },
    async (accessToken, refreshToken, profile, done) => {
      const { sub, email, given_name, family_name, picture } = profile._json;

      const userData = {
        googleId: sub,
        Email: email,
        ContactNumber: null, // Fill in as necessary
        DOB: null, // Fill in as necessary
        Gender: null, // Fill in as necessary
        Address: null, // Fill in as necessary
        eWalletAmount: 0, // Default value
        resetPasswordCode: null, // Default value
        PCHI: null, // Default value
        givenName: given_name,
        familyName: family_name,
        profilePicture: picture, // Updated field name

        // These are for google calendar -
        //might need to save in database to access Google Calendar on behalf of the user
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      try {
        let user = await Patient.findOrCreateGoogleUser(userData);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.PatientID);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Patient.getPatientById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Additional setup for Google Calendar API
const oauth2Client = new google.auth.OAuth2(
  process.env.googleClientID,
  process.env.googleClientSecret,
  "http://localhost:3000/auth/google/callback" // Adjust according to setup
);

google.options({ auth: oauth2Client });

const calendar = google.calendar({ version: "v3" });

module.exports = {
  passport,
  calendar,
  oauth2Client,
};
