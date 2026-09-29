<div align="center">

<img src="img/mh hridoy.png" alt="Under Construction">

# 🩸 Blood Donor Finder — Sylhet Division

> 🚧 **UNDER CONSTRUCTION**
>
> This project is currently under active development. Features, design, database structure, and security implementation may change as development continues.

</div>

A web-based platform built to help people quickly find suitable blood donors and share emergency blood requirements across the **Sylhet Division of Bangladesh**.

---

## 🌐 About the Project

Finding a suitable blood donor during an emergency can be difficult, especially when time is limited.

Blood Donor Finder aims to make this process easier by bringing donor information and blood requests together in one platform.

The current project focuses on the four districts of **Sylhet Division**:

* Sylhet
* Sunamganj
* Moulvibazar
* Habiganj

Users can search for donors using information such as blood group, district, upazila, area, and availability.

---

## ✨ Features

### 🔎 Find Blood Donors

Users can search for available donors using:

* Blood Group
* District
* Upazila
* Area
* Availability

Supported blood groups:

`A+` `A-` `B+` `B-` `O+` `O-` `AB+` `AB-`

---

### 🩸 Become a Donor

People can register as blood donors by providing information such as:

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

After completing email verification, the donor profile can be activated.

---

## 📧 Email OTP Verification

The registration process uses an email-based OTP verification system.

### Registration Flow

```text
Registration Form
       ↓
Temporary Registration
       ↓
Generate OTP
       ↓
Google Apps Script
       ↓
OTP Sent to Email
       ↓
User Enters OTP
       ↓
OTP Verification
       ↓
Account Verified
       ↓
Permanent User / Donor Profile
```

Google Apps Script is used for the email delivery portion of the OTP system.

It is not intended to act as the complete authentication or account-management system.

---

## 🔐 Custom Account System

The project does not use **Firebase Authentication**.

Instead, the application uses a custom account structure stored in **Firebase Realtime Database**.

The basic login flow is:

```text
Email + Password
       ↓
Find User
       ↓
Verify Account
       ↓
Verify Password
       ↓
Login
```

Only verified accounts should be able to access authenticated user features.

> **Security note:** A custom authentication system requires careful server-side security. Passwords should never be stored in plaintext, and sensitive authentication operations should not be trusted to frontend JavaScript alone.

---

## 🗂️ Temporary Registration Data

Before email verification is completed, registration information can be stored temporarily.

Example:

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

After successful OTP verification, the temporary registration can be converted into a permanent user/donor record.

---

## 👤 User Profile

A verified user can have a profile containing information such as:

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

Users can manage their donor availability:

* **Available**
* **Not Available**

---

## 📊 User Dashboard

The dashboard gives users an overview of their donor profile.

It can include:

* Donor Status
* Blood Group
* Total Donations
* Last Donation Date
* Personal Profile
* Donation Availability

---

## 🚨 Emergency Blood Requests

Users can submit an emergency blood request when blood is needed.

A request may include:

* Patient Name
* Required Blood Group
* Hospital Name
* District
* Upazila / Location
* Number of Blood Bags Required
* Required Date
* Contact Number
* Urgency Level
* Additional Information

### Urgency Levels

| Level       | Description           |
| ----------- | --------------------- |
| 🔴 Critical | Immediate requirement |
| 🟠 Urgent   | Required within hours |
| 🟢 Normal   | Required within days  |

Emergency requests can help suitable donors identify people who need blood.

---

## 📍 Nearby Donors

The platform can use browser location access to help users discover donors around their current location.

Example:

```text
User Allows Location
        ↓
Current Location
        ↓
Search Nearby Donors
        ↓
Display Suitable Donors
```

Location-based searching can be further improved as the project develops.

---

## 👨‍💼 Admin Dashboard

An administrator dashboard is included for managing the platform.

### Admin Sections

* Donors
* Blood Requests
* Reports
* Users
* Statistics

### Donor Management

Administrators can view information such as:

* Name
* Blood Group
* District
* Mobile Number
* Verification Status
* Availability

### Blood Request Management

Administrators can manage emergency requests and view:

* Patient
* Blood Group
* Hospital
* Location
* Urgency
* Required Date
* Request Status

### Reports

Users can report donor-related problems or inappropriate activity.

Administrators can review these reports and take appropriate action.

### User Management

The admin dashboard can display:

* Email
* User ID
* Account Status
* Account Creation Date

### Statistics

The platform can provide statistics such as:

* Total Donors
* Available Donors
* Total Blood Requests
* Emergency Requests
* Donors by Blood Group
* Donors by District

---

## 🔥 Firebase Realtime Database

**Firebase Realtime Database** is used as the primary application database.

A possible database structure is:

```text
Firebase Realtime Database
│
├── temporaryUsers/
├── users/
├── donors/
├── bloodRequests/
├── emergencyRequests/
├── reports/
└── settings/
```

Firebase is responsible for storing and retrieving the application's data.

---

## 🔒 Database Security

The application is designed around restricted database access.

General users should only be able to read or modify information that they are authorized to access.

```text
User
 ├── Read → Allowed where required
 └── Write → Restricted
```

Administrative operations should be handled through a trusted backend or server-side mechanism.

Because this project uses a custom account system instead of Firebase Authentication, `auth.uid` cannot directly represent the application's custom user identity.

For production deployment, privileged operations should therefore be moved away from publicly accessible frontend JavaScript.

---

## 🧩 Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap 5
* Font Awesome

### Backend & Services

* Firebase Realtime Database
* Google Apps Script
* Gmail

### Account & Verification

* Custom account system
* Email OTP verification
* Firebase Authentication: **Not used**

---

## 📁 Project Structure

The project can be organized like this:

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

## 🖥️ Main Sections

### 🏠 Home

The home page introduces the platform and can display:

* Total Donors
* Available Donors
* Blood Requests
* Emergency Requests
* Sylhet Division information
* How It Works
* Become a Donor

### 🔎 Find Donor

Search and filter available blood donors based on blood group and location.

### 🩸 Become a Donor

Registration form for people who want to become blood donors.

### 🚨 Emergency Request

Form for submitting emergency blood requirements.

### 📍 Nearby Donors

Location-based donor discovery.

### 👤 User Dashboard

Personal donor profile and availability management.

### 🔐 Login / Register

Custom account registration and login with email verification.

### 👨‍💼 Admin Dashboard

Administrative management, reports, donor management, and statistics.

---

## 🗺️ Supported Location

The current version focuses on **Sylhet Division**.

| District    |
| ----------- |
| Sylhet      |
| Sunamganj   |
| Moulvibazar |
| Habiganj    |

Each district can contain multiple upazilas and local areas, allowing more detailed donor searches.

---

## ⚙️ Registration & Verification Flow

The complete registration process is designed around the following flow:

```text
1. Open Registration
        ↓
2. Enter Personal Information
        ↓
3. Enter Email Address
        ↓
4. Request OTP
        ↓
5. Create Temporary Registration
        ↓
6. Generate OTP
        ↓
7. Send OTP to Email
        ↓
8. Enter Received OTP
        ↓
9. Verify OTP
        ↓
10. Activate Account
        ↓
11. Create Permanent User / Donor Profile
        ↓
12. Login
```

---

## ⏱️ OTP Expiration

OTP codes should only remain valid for a limited period.

```text
OTP Generated
      ↓
Temporarily Valid
      ↓
Expiration Time Reached
      ↓
OTP Becomes Invalid
      ↓
New OTP Required
```

Expired OTPs should never be accepted.

The system should also limit repeated OTP requests and verification attempts.

---

## 🛡️ Security Considerations

Security is an important part of the project, especially because donor information can contain personal contact details.

For production use, the project should:

* Never expose Firebase privileged credentials in frontend JavaScript.
* Never store plaintext passwords.
* Store passwords using a secure password-hashing mechanism.
* Never expose OTP values publicly.
* Expire OTP codes automatically.
* Limit OTP requests.
* Limit repeated verification attempts.
* Protect temporary registration data.
* Validate user input.
* Sanitize user-generated content before displaying it.
* Restrict administrative operations.
* Protect private donor information.
* Use HTTPS in production.
* Avoid exposing unnecessary personal information.

---

## 🎯 Project Goals

Blood Donor Finder is being developed with several goals in mind:

1. Make blood donor discovery easier.
2. Help people find suitable donors during emergencies.
3. Support blood-group and location-based searching.
4. Provide an emergency blood request system.
5. Verify donor accounts through email OTP.
6. Allow donors to manage their availability.
7. Provide administrative tools for platform management.
8. Maintain an organized donor database.
9. Improve access to blood donors across Sylhet Division.

---

## 🚀 Future Plans

Possible future improvements include:

* Advanced donor verification
* Improved location-based searching
* Donor availability reminders
* Blood donation history
* Donation eligibility reminders
* Emergency notifications
* Email notifications
* Better anti-spam protection
* Account recovery
* Password reset
* Advanced admin analytics
* Donor reporting and reputation features
* Progressive Web App (PWA)
* Dedicated mobile application

---

## 📜 Terms & Privacy

Users should agree to the platform's **Terms & Conditions** and **Privacy Policy** before completing donor registration.

Only the information necessary for blood donation communication should be publicly visible.

Sensitive personal information should be protected and accessible only to authorized users or administrators.

---

## ❤️ Mission

> **Find a blood donor. Save a life.**

Blood Donor Finder is being developed to make it easier for people across Sylhet Division to find suitable blood donors when they need help.

---

## 👨‍💻 Developer

### MH2 HRIDOY

**Web & Mobile App Developer**

GitHub: **@mhhridoy7907**

---

## 📌 Project Status

**Active Development 🚧**

Blood Donor Finder is currently under development.

The project is being built and improved using **JavaScript, Firebase Realtime Database, and Google Apps Script**.

Features and architecture may continue to change as development progresses.

---

## 📄 License

This project is currently intended for **educational and development purposes**.

An open-source license may be added when the project is prepared for public distribution.
