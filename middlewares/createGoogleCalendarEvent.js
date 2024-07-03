const { google } = require("googleapis");
require("dotenv").config();

const createGoogleCalendarEvent = async (req, res) => {
  try {
    const { startDateTime, endDateTime, IllnessDescription } =
      req.createdAppointment;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.googleClientID,
      process.env.googleClientSecret,
      "http://localhost:3000/auth/google/callback" // Adjust according to your setup
    );

    oAuth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary: "Medical Appointment",
      description: IllnessDescription,
      start: {
        dateTime: startDateTime,
        timeZone: "Asia/Singapore",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Asia/Singapore",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    };

    calendar.events.insert(
      {
        calendarId: "primary",
        resource: event,
      },
      (err, event) => {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        console.log("Event created: %s", event.data.htmlLink);
      }
    );
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
  }
};

module.exports = createGoogleCalendarEvent;
