# 🩸 Blood Donor Finder — Sylhet Division

A web-based blood donor discovery and emergency blood request platform designed to connect blood donors with people who need blood across the **Sylhet Division of Bangladesh**.

The system allows users to register as blood donors, verify their email through OTP, manage their donor profile, search for donors by blood group and location, submit emergency blood requests, and interact with an administrator-managed donor database.

---

## 🌐 Project Overview

**Blood Donor Finder** is designed to make it easier to find available blood donors quickly during normal and emergency situations.

The platform focuses on:

* Blood donor registration
* Email OTP verification
* Donor search
* Blood group filtering
* District and Upazila filtering
* Emergency blood requests
* Nearby donor discovery
* Donor availability management
* User dashboard
* Admin dashboard
* Donor verification
* Reports management
* Statistics and donor analytics

The project currently focuses on the four districts of the **Sylhet Division**:

* Sylhet
* Sunamganj
* Moulvibazar
* Habiganj

---

## ✨ Main Features

### 🔎 Find Blood Donors

Users can search for donors using:

* Blood Group
* District
* Upazila
* Area
* Availability

Supported blood groups:

* A+
* A-
* B+
* B-
* O+
* O-
* AB+
* AB-

---

### 🩸 Become a Blood Donor

Users can register as a donor by providing:

* Full Name
* Email Address
* Password
* Blood Group
* Mobile Number
* District
* Upazila
* Area
* Gender
* Last Blood Donation Date
* Profile Picture
* Contact Permission
* Terms & Conditions Agreement

The donor registration form is the main entry point for adding a new donor profile to the platform.

---

## 📧 Email OTP Verification

The registration system uses an email-based OTP verification process.

### Registration Flow

```text
User enters registration information
              ↓
       Temporary User Data
              ↓
         Generate OTP
              ↓
       Google Apps Script
              ↓
       Send OTP to Email
              ↓
        User enters OTP
              ↓
      OTP verification
              ↓
           Verified
              ↓
        Account activated
              ↓
       User profile created
```

### Google Apps Script Responsibility

Google Apps Script is intended to handle the OTP delivery process.

It will:

1. Generate a temporary OTP.
2. Store the OTP in the temporary registration data.
3. Send the OTP to the user's email address.

It will **not** handle the complete account system.

---

## 🔐 Custom Account System

This project does **not** use Firebase Authentication.

Instead, the application uses a custom account structure stored in Firebase Realtime Database.

Conceptually:

```text
Email + Password
       ↓
Firebase Database
       ↓
Find User
       ↓
Verify Account
       ↓
Verify Password
       ↓
Login
```

Only verified accounts should be allowed to access authenticated user features.

---

## 🗂️ Temporary Registration Data

Before email verification, registration information can be stored temporarily.

Example structure:

```text
temporaryUsers/
    tempId/
        name
        email
        passwordHash
        bloodGroup
        mobile
        district
        upazila
        area
        gender
        lastDonationDate
        avatar
        otp
        otpExpiresAt
        verified: false
```

After successful verification, the temporary registration can be converted into a permanent user/donor record.

---

## 👤 User Data

A verified user can have a permanent profile such as:

```text
users/
    userId/
        name
        email
        passwordHash
        bloodGroup
        mobile
        district
        upazila
        area
        gender
        lastDonationDate
        avatar
        verified: true
        available: true
        createdAt
```

---

## 📊 User Dashboard

The user dashboard provides information about the donor account.

It can display:

* Donor Status
* Blood Group
* Total Donations
* Last Donation
* Personal Profile
* Donation Availability

Users can update their availability status between:

* Available
* Not Available

---

## 🚨 Emergency Blood Requests

Users can submit emergency blood requests with information such as:

* Patient Name
* Required Blood Group
* Hospital Name
* District
* Location / Upazila
* Blood Bags Required
* Required Date
* Contact Number
* Urgency Level
* Additional Message

### Urgency Levels

* Critical — Immediate
* Urgent — Within Hours
* Normal — Within Days

Emergency requests can be displayed to help connect suitable donors with people who need blood.

---

## 📍 Nearby Donors

The platform includes a nearby donor feature.

Users can allow browser location access and use:

```text
Find Nearby Donors
```

to search for donors near their current location.

---

## 👨‍💼 Admin Dashboard

The system includes an administrator dashboard.

### Admin Sections

* Donors
* Blood Requests
* Reports
* Users
* Statistics

### Donor Management

Admin can view donor information including:

* Name
* Blood Group
* District
* Mobile Number
* Verification Status
* Availability

### Blood Request Management

Admin can manage emergency blood requests and view:

* Patient
* Blood Group
* Hospital
* Location
* Urgency
* Required Date
* Status

### Reports

Users can report donor-related issues.

The administrator can review submitted reports and take appropriate action.

### Users

The admin dashboard can display:

* Email
* User ID
* Account Status
* Creation Date

### Statistics

The dashboard provides statistics such as:

* Total Donors
* Available Donors
* Total Blood Requests
* Emergency Requests
* Donors by Blood Group
* Donors by District

---

## 🔥 Firebase Realtime Database

Firebase Realtime Database is used as the primary application database.

Possible data structure:

```text
Firebase Realtime Database
│
├── temporaryUsers/
│
├── users/
│
├── donors/
│
├── bloodRequests/
│
├── emergencyRequests/
│
├── reports/
│
└── settings/
```

Firebase is responsible for storing and retrieving application data.

---

## 🔒 Database Security

The project is designed around restricted database writing.

### General Users

Users should not be allowed to freely modify protected database records.

```text
Read  → Allowed where required
Write → Restricted
```

### Administrative Operations

Protected write operations should be performed through a trusted administrative/server-side mechanism.

> Firebase Authentication is not used in this custom account architecture, so Firebase `auth.uid` cannot be used directly as the application's user identity.

For production deployment, sensitive operations should be protected by a trusted server-side layer rather than exposing privileged credentials in frontend JavaScript.

---

## 🧩 Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap 5
* Font Awesome

### Backend / Services

* Firebase Realtime Database
* Google Apps Script
* Gmail

### Authentication Model

* Custom account system
* Email OTP verification
* No Firebase Authentication

---

## 📁 Project Structure

A possible project structure:

```text
blood-donor-finder/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── avatars/
│
└── apps-script/
    └── Code.gs
```

---

## 🖥️ Main Pages / Sections

The application contains the following major sections:

### Home

Provides:

* Project introduction
* Total donor statistics
* Available donor statistics
* Blood request statistics
* Emergency request statistics
* Sylhet Division district information
* How It Works section
* Become a Donor call-to-action

### Find Donor

Allows users to search and filter available blood donors.

### Become a Donor

Provides the donor registration form.

### Emergency Request

Allows users to submit emergency blood requirements.

### Nearby Donors

Provides location-based donor discovery.

### User Dashboard

Allows verified users to view and manage their donor information.

### Login / Register

Provides custom account login and registration.

### Admin Dashboard

Provides administrative management and statistics.

---

## 🗺️ Supported Location

The current project focuses on:

### Sylhet Division

| District    |
| ----------- |
| Sylhet      |
| Sunamganj   |
| Moulvibazar |
| Habiganj    |

Each district can contain multiple Upazilas and local areas for more detailed donor searching.

---

## ⚙️ Registration Security Flow

A simplified registration process:

```text
1. User opens registration
2. User enters personal information
3. User enters email
4. User requests OTP
5. Temporary registration is created
6. OTP is generated
7. OTP is stored temporarily
8. OTP is sent through email
9. User enters received OTP
10. OTP is verified
11. Account becomes verified
12. Permanent user/donor record is created
13. User can log in
```

---

## ⏱️ OTP Expiration

OTP should have a limited validity period.

Example:

```text
OTP
 ↓
Generated
 ↓
Valid for a limited time
 ↓
Expires
 ↓
New OTP required
```

Expired OTPs should not be accepted.

---

## 🛡️ Recommended Security Practices

For production use:

* Never expose Firebase privileged credentials in frontend JavaScript.
* Do not store plaintext passwords.
* Store password hashes instead of raw passwords.
* Do not expose OTP values to public users.
* Add OTP expiration.
* Add OTP request rate limiting.
* Limit repeated verification attempts.
* Protect temporary registration data.
* Validate all user input.
* Sanitize displayed user-generated content.
* Restrict administrative operations.
* Keep private donor information protected.
* Use HTTPS in production.
* Avoid exposing unnecessary personal information publicly.

---

## 🎯 Project Goals

The main goals of Blood Donor Finder are:

1. Make blood donor discovery faster.
2. Connect donors with people who need blood.
3. Provide location-based donor searching.
4. Support emergency blood requests.
5. Verify donor accounts through email OTP.
6. Provide donor availability information.
7. Give administrators tools to manage the platform.
8. Maintain a structured donor database.
9. Improve access to blood donors across Sylhet Division.

---

## 🚀 Future Improvements

Possible future features include:

* Advanced donor verification
* Better location-based searching
* Donor availability reminders
* Blood donation history
* Donation eligibility reminders
* Emergency request notifications
* Email notifications
* Improved anti-spam protection
* Account recovery
* Password reset
* Advanced admin analytics
* Donor reputation/reporting system
* Mobile application
* Progressive Web App support

---

## 📜 Terms & Privacy

Users should agree to the platform's Terms & Conditions and Privacy Policy before completing donor registration.

The platform should only expose the donor information necessary for blood donation communication.

---

## ❤️ Mission

> **Find a blood donor. Save a life.**

Blood Donor Finder aims to make it easier for people in Sylhet Division to find suitable blood donors quickly when they need help.

---

## 👨‍💻 Developer

**MH2 HRIDOY**

Web and Mobile App Developer

GitHub: `@mhhridoy7907`

---

## 📌 Project Status

**Status:** Active Development

**🚧 Under Construction**

The project is currently under active development and is being improved with Firebase, JavaScript, and Google Apps Script-based services.

---

## 📄 License

This project is intended for educational and development purposes.

A suitable open-source license can be added to the repository when the project is ready for public distribution.
