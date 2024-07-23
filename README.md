# ![SyncHealth Logo](./public/images/SyncHealthLogo.png) SyncHealth

[Visit SyncHealth's Website](https://bed2024apr-p02-team01.onrender.com/)

## Introduction

### Chosen Topic: Social Impact

This topic explores the areas for social impact across different sectors in a community/country, including healthcare, education, agriculture, food and nutrition, and the environment, due to the current developments in technology, political and climate changes.

### Context:

Access to quality healthcare is a significant challenge for low-income families. SyncHealth aims to bridge this gap by providing accessible and affordable telemedicine services, leveraging technology to make healthcare more inclusive and effective.

## Project Details

### Project Name: SyncHealth

#### Objective

SyncHealth aims to provide a comprehensive telemedicine service that ensures quality and accessible healthcare for low-income families. By facilitating free online consultations with our friendly volunteer doctors and offering affordable medication through an ePharmacy, SyncHealth ensures that healthcare is available from the comfort of home.

#### Target Audience

SyncHealth is designed for low-income families who need medical attention for non-emergency conditions. This service caters to individuals who seek convenient and cost-effective medical consultations and hopes to have access to affordable medication.

#### Mission

Fill the healthcare gap for low-income families through free consultations and affordable medication.

#### Vision

Ensuring accessible, quality healthcare regardless of financial status.

## Key Features

<table>
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Appointments</td>
    <td>Easily connect with volunteer doctors through video calls, offering consultations at no cost.</td>
  </tr>
  <tr>
    <td>Patient Diagnosis System</td>
    <td>Allow doctors to diagnose patients, prescribe medications, and issue Medical Certificates efficiently through our integrated system.</td>
  </tr>
  <tr>
    <td>Medical Certificate</td>
    <td>Download a PDF of your Medical Certificate after your doctor's visit, making it easy to share and store your medical records.</td>
  </tr>
  <tr>
    <td>Health Buddy</td>
    <td>Receive instant medical advice for free through our OpenAI powered chatbot, providing reliable health information at your fingertips.</td>
  </tr>
  <tr>
    <td>ePharmacy</td>
    <td>Purchase prescribed medications at subsidised rates, ensuring affordability and convenience.</td>
  </tr>
  <tr>
    <td>Authentication</td>
    <td>Experience a secure login and registration process using Google Sign-In, guaranteeing the privacy and security of your medical information. Note that this feature requires you to access the online version of SyncHealth.</td>
  </tr>
  <tr>
    <td>eWallet</td>
    <td>Manage your finances on SyncHealth seamlessly. Top up your account by scanning a QR code for quick and secure transactions.</td>
  </tr>
  <tr>
    <td>Shared Database</td>
    <td>Utilises AWS RDS MSSQL Database for reliable, scalable data storage solutions that are accessible to everyone.</td>
  </tr>
  <tr>
    <td>Web Hosting</td>
    <td>Host the MVC application on Render, providing accessible and efficient web service that everyone can easily access.</td>
  </tr>
  <tr>
    <td>Payment Process</td>
    <td>Integrates the eWallet with the ePharmacy, allowing for seamless payment of prescribed medications, ensuring convenience and efficiency.</td>
  </tr>
  <tr>
    <td>Medicine Recognition</td>
    <td>Leverages AI to accurately analyze medicine packages or labels from uploaded or captured images, providing detailed information and saving a comprehensive history of past recognitions.</td>
  </tr>
  <tr>
    <td>Google Address Autocompletion</td>
    <td>Higher efficiency in quickly and accurately providing user’s address while signing up for an account or editing profile using Google Maps JavaScript API.</td>
  </tr>
  <tr>
    <td>Voucher Lucky Draw</td>
    <td>A chance to receive voucher codes through lucky draw to enjoy discounted purchases in ePharmacy.</td>
  </tr>
  <tr>
    <td>CHAS Clinic</td>
    <td>Access subsidised healthcare services at Community Health Assist Scheme (CHAS) clinics. SyncHealth helps you find the nearest CHAS clinic and provides information on services and subsidies.</td>
  </tr>
  <tr>
    <td>FaceAuth</td>
    <td>Secure login with advanced facial recognition technology, ensuring only authorised users can access their accounts through seamless face scanning.</td>
  </tr>
  <tr>
    <td>Memory Match</td>
    <td>Engage in the MemoryMatch game to win vouchers. This interactive game challenges users to match pairs of cards, offering a fun way to earn discounts for purchases in the ePharmacy.</td>
  </tr>
  <tr>
    <td>Account Management</td>
    <td>Utilise detailed API documentation with Swagger for easy integration and development, enabling developers to understand and implement SyncHealth's APIs effectively.</td>
  </tr>
  <tr>
    <td>Authorization</td>
    <td>Utilised JWT to authorize user and securely transfer data between the controller and the model.</td>
  </tr>
  <tr>
    <td>Email System</td>
    <td>Leveraging modern email technologies like Nodemailer and Node Schedule to deliver notifications efficiently and reliably. Users of SyncHealth will be able to track their activities with timely reminders and easy access to documents like medical certificates.</td>
  </tr>
  <tr>
    <td>Unit Testing</td>
    <td>Ensure reliability through comprehensive unit testing with Jest, catching potential issues early and improving software quality.</td>
  </tr>
  <tr>
    <td>API Documentation</td>
    <td>Utilise detailed API documentation with Swagger for easy integration and development, enabling developers to understand and implement SyncHealth's APIs effectively.</td>
  </tr>
</table>

## Technology Stack

<table>
  <tr>
    <th>Component</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Video Conferencing</td>
    <td>The Whereby API is integrated for seamless video consultations, providing a smooth and reliable communication channel between patients and doctors.</td>
  </tr>
  <tr>
    <td>Server-Sent Events</td>
    <td>Server-Sent Events (SSE) provide real-time updates and notifications. This enables the Medical Certificate download button to activate automatically after a diagnosis and creates new sessions for Health Buddy, ensuring chat history and a seamless user experience without requiring a page refresh.</td>
  </tr>
  <tr>
    <td>PDF Generation</td>
    <td>pdfkit is incorporated for generating and managing PDF documents, specifically for creating Medical Certificates efficiently.</td>
  </tr>
  <tr>
    <td>GPT-3.5 Turbo</td>
    <td>GPT-3.5 Turbo powers Health Buddy, offering advanced AI-driven medical advice. The costs are $0.50 per million input tokens and $1.50 per million output tokens.</td>
  </tr>
  <tr>
    <td>GPT-4o Turbo</td>
    <td>GPT-4o powers the Medicine Recognition feature, which allows users to upload or capture images of medicine packages for AI-powered recognition. Users can view detailed analysis results that will also be stored as history for easy reference. The costs are $5.00 per million input tokens and $15.00 per million output tokens. Pricing Calculator for Image Prompts: https://openai.com/api/pricing/</td>
  </tr>
  <tr>
    <td>Session Management</td>
    <td>Express Sessions are used to create new sessions, facilitating chat history logic for Health Buddy. This ensures a continuous and coherent user experience.</td>
  </tr>
  <tr>
    <td>AWS Relational Database Service</td>
    <td>AWS Relational Database (MSSQL) is used for secure, scalable, and shared data management, ensuring data integrity and accessibility.</td>
  </tr>
  <tr>
    <td>Web Hosting</td>
    <td>The MVC application is hosted on Render, providing accessible and efficient web services that are easily accessible to everyone.</td>
  </tr>
  <tr>
    <td>Google Identity</td>
    <td>Google Sign-In is used to enable patients to securely log into their accounts, ensuring a straightforward and safe authentication process.</td>
  </tr>
  <tr>
    <td>Google Maps API</td>
    <td>Google Maps API is used to enable patients to accurately provide their address while signing up or editing profile, using the Google Address Autocompletion, enhancing the accuracy and efficiency of data entry.</td>
  </tr>
  <tr>
    <td>QR Code</td>
    <td>QR Code functionality is integrated to enable efficient and secure top-ups for the eWallet, streamlining the financial management process for users.</td>
  </tr>
  <tr>
    <td>Payment Process</td>
    <td>The integration of eWallet with ePharmacy allows for seamless payment of prescribed medications, ensuring convenience and efficiency.</td>
  </tr>
  <tr>
    <td>Data.gov.sg</td>
    <td>Data.gov.sg is used to access and integrate information on CHAS clinics, ensuring users can find the nearest clinic and obtain details about available services and subsidies.</td>
  </tr>
  <tr>
    <td>face-api.js</td>
    <td>face-api.js is utilised for facial recognition technology, providing secure and convenient login by scanning users' faces.</td>
  </tr>
  <tr>
    <td>Jest</td>
    <td>Jest is employed for unit testing, ensuring the reliability and stability of SyncHealth by catching potential issues early and improving software quality.</td>
  </tr>
  <tr>
    <td>Swagger</td>
    <td>Swagger is used for API documentation, providing detailed and thorough information for easy integration and development, enabling developers to understand and implement SyncHealth's APIs effectively.</td>
  </tr>
  <tr>
    <td>Font Awesome</td>
    <td>Font Awesome is utilised for Memory Match to provide a wide range of icons that enhance the visual appeal and usability of the game. The integration of these icons helps create a more engaging and interactive user experience.</td>
  </tr>
  <tr>
    <td>Nodemailer</td>
    <td>Nodemailer is utilised to send emails from the server easily. It is a zero-dependency module for all Node.js-compatible applications. The emails sent can be plain text, attachments, or HTML. Note that you can use Gmail accounts. SyncHealth uses this to send notifications, reminders, and Medical Certificates (MC) to patients.</td>
  </tr>
  <tr>
    <td>Node Schedule</td>
    <td>Node Schedule is an automated system that executes tasks at specific intervals or at particular times. SyncHealth uses this to schedule daily appointment reminders for the patients.</td>
  </tr>
  <tr>
    <td>JWT</td>
    <td>JWT (JSON Web Token) is used to securely transmit information between parties in a JSON format. It is used to authorize access to SyncHealth’s resources and services.</td>
  </tr>
  <tr>
    <td>Frontend</td>
    <td>Bootstrap is utilised to create a dynamic and responsive user interface, ensuring a seamless user experience across various devices.</td>
  </tr>
  <tr>
    <td>Backend</td>
    <td>Node.js and Express are employed for robust and efficient server-side operations, enabling quick and reliable performance.</td>
  </tr>
</table>
