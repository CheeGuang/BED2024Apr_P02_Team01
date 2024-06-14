const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Patient = require("./models/patient"); // Ensure this path is correct
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientSecret,
      clientSecret: process.env.googleClientSecret,
      callbackURL: "/auth/google/callback",
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

module.exports = passport;
