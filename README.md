# 🛡️ BharatMedGuard

## AI-Powered Healthcare Fraud & Anomaly Detection Platform

BharatMedGuard is an AI-powered healthcare cybersecurity and anomaly-detection platform designed to identify suspicious activities, inconsistencies, and potential fraud across India's healthcare ecosystem.

The platform focuses on four major healthcare anomaly domains:

- 💳 Billing & Insurance Claim Anomalies
- 🪪 Patient & Identity Anomalies
- 📄 Medical Document Anomalies
- 🏥 Clinical Data Anomalies

BharatMedGuard combines machine learning, healthcare document processing, secure APIs, authentication, authorization, audit logging, and network-security analysis into a unified platform.

---

## 🎯 Problem Statement

Healthcare organizations handle large amounts of sensitive information, including:

- Patient identities
- Medical records
- Insurance claims
- Billing information
- Clinical data
- Medical documents

Manual verification of this information can be time-consuming and may fail to detect complex or unusual patterns.

BharatMedGuard provides an intelligent security layer that identifies abnormal patterns and helps investigators prioritize potentially suspicious cases.

---

# 🚀 Key Features

## 1. 💳 Billing & Insurance Claim Anomaly Detection

Analyzes healthcare billing and insurance claim information to identify suspicious patterns such as:

- Duplicate claims
- Unusual billing amounts
- Abnormal claim frequency
- Invoice inconsistencies
- Suspicious provider/claim combinations
- Unusual billing patterns

### Pipeline

```text
Claim Data
    ↓
Data Validation
    ↓
Feature Extraction
    ↓
Anomaly Detection
    ↓
Risk Scoring
    ↓
Alert Generation
    ↓
Investigation Case

2. 🪪 Patient & Identity Anomaly Detection
Detects suspicious patient identity and activity patterns.
Examples include:
Duplicate patient identities
Inconsistent identity information
Unusual admission patterns
Impossible travel / geographic velocity
Multiple hospital activities occurring within unrealistic time intervals
Suspicious identity reuse

##Pipeline

Patient / Identity Data
        ↓
Validation
        ↓
Identity Feature Extraction
        ↓
Pattern Analysis
        ↓
Isolation Forest
        ↓
Risk Score
        ↓
Security Alert

3. 📄 Medical Document Anomaly Detection
Processes medical documents and extracts relevant information using OCR.
The system can analyze:
Medical PDFs
Scanned documents
Bills
Reports
Invoices
Patient-related documents

Pipeline

Medical Document
       ↓
Document Upload
       ↓
Tesseract OCR
       ↓
Text Extraction
       ↓
Data Validation
       ↓
Feature Extraction
       ↓
Anomaly Analysis
       ↓
Risk / Alert

4. 🏥 Clinical Data Anomaly Detection
Analyzes clinical information to identify unusual or inconsistent patterns.
Examples include:
Abnormal clinical values
Inconsistent patient information
Suspicious treatment patterns
Unusual procedure combinations
Missing or inconsistent clinical information
Outlier clinical activity

Clinical Data
      ↓
Validation
      ↓
Preprocessing
      ↓
Feature Engineering
      ↓
Isolation Forest
      ↓
Anomaly Score
      ↓
Risk Classification
      ↓
Investigation

🤖 AI / ML
BharatMedGuard uses machine learning to identify unusual patterns in healthcare data.
Primary Algorithm
Isolation Forest
Isolation Forest is used as the primary unsupervised anomaly-detection algorithm.
It is useful when labeled examples of fraud are limited because the model learns patterns from available data and identifies observations that behave differently from the majority.
ML Technologies
Scikit-learn
Isolation Forest
Pandas
NumPy
ML Pipeline

Raw Data
   ↓
Data Cleaning
   ↓
Feature Engineering
   ↓
Feature Scaling
   ↓
Isolation Forest
   ↓
Anomaly Score
   ↓
Risk Level
   ↓
Alert / Investigation

🔐 Security Architecture
Security is a core component of BharatMedGuard.
Authentication
OAuth 2.0
JWT-based authentication
bcrypt password hashing
Authorization
Role-Based Access Control (RBAC) restricts functionality according to user roles.

Example roles:

Administrator
     ↓
Investigator
     ↓
Healthcare / Insurance User
     ↓
Viewer

Each role receives appropriate access to system resources and workflows.
API Security
Pydantic input validation
CORS configuration
Rate limiting
JWT validation
Secure password hashing
Error handling
Audit logging
Audit & Monitoring
Important security-related activities are recorded through Python logging and audit mechanisms.

🌐 Network Security
BharatMedGuard includes Scapy-based network analysis capabilities.
Scapy Pipeline

Network Traffic
      ↓
Packet Capture / Analysis
      ↓
Protocol Information
      ↓
Traffic Features
      ↓
Suspicious Pattern Detection
      ↓
Security Alert

Scapy is used for packet-level network analysis and security-oriented monitoring.

🧱 System Architecture
┌──────────────────────┐
                         │      User / Admin     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    React Frontend    │
                         └──────────┬───────────┘
                                    │
                              Secure API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     FastAPI Backend  │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      Authentication          ML Processing          Document OCR
       & Authorization       Isolation Forest       Tesseract OCR
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       MongoDB        │
                         └──────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Alerts / Audit Logs  │
                         └──────────────────────┘

🛠️ Technology Stack
Frontend
React.js
JavaScript
Tailwind CSS
Vite
Backend
Python
FastAPI
Pydantic
Database
MongoDB
MongoDB Compass
AI / Machine Learning
Scikit-learn
Isolation Forest
Pandas
NumPy
Healthcare Documents
Tesseract OCR
Authentication & Security
OAuth 2.0
JWT
RBAC
bcrypt
CORS
Rate Limiting
Python Logging
Network Security
Scapy
Testing & Development
Postman
Git
GitHub
VS Code

📁 Project Structure
BharatMedGuard/
│
├── bharatmedguard-backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── security/
│   │   ├── ml/
│   │   └── main.py
│   │
│   ├── scripts/
│   ├── tests/
│   ├── uploads/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── bharatmedguard-frontend/
│   │
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

🔄 End-to-End Workflow
User Authentication
        ↓
Select Security Pipeline
        ↓
Submit Healthcare Data
        ↓
Input Validation
        ↓
Data Processing
        ↓
Feature Extraction
        ↓
AI / ML Anomaly Detection
        ↓
Risk Score Generation
        ↓
Risk Classification
        ↓
Security Alert
        ↓
Investigation
        ↓
Audit Logging
        ↓
Report

📊 Risk Classification
Detected anomalies can be classified into different risk levels:
LOW
 ↓
MEDIUM
 ↓
HIGH
 ↓
CRITICAL

Risk scoring helps investigators prioritize cases that require immediate attention.

🔎 Investigation Workflow
When suspicious activity is detected:
Anomaly Detected
      ↓
Risk Score Generated
      ↓
Alert Created
      ↓
Investigator Reviews Case
      ↓
Evidence / Data Analysis
      ↓
Investigation Status Updated
      ↓
Final Report
This allows BharatMedGuard to function not only as an anomaly detector but also as an investigation-support platform.
🧪 API Testing
Postman is used for testing and validating backend APIs.
The project includes a Postman collection covering major API workflows.
Typical API flow:
Authentication
      ↓
Obtain JWT
      ↓
Authenticated API Request
      ↓
Data Submission
      ↓
Anomaly Detection
      ↓
Result / Alert
⚙️ Installation
1. Clone the Repository
git clone https://github.com/YOUR-USERNAME/Bharat-MedGuard.git
cd Bharat-MedGuard
🐍 Backend Setup
Navigate to the backend:
cd bharatmedguard-backend
Create a virtual environment:
Windows
python -m venv venv
venv\Scripts\activate
Linux / macOS
python3 -m venv venv
source venv/bin/activate
Install dependencies:
pip install -r requirements.txt
Create environment configuration:
copy .env.example .env
Configure the required environment variables.
Start the FastAPI server:
uvicorn app.main:app --reload
Backend:
http://127.0.0.1:8000
FastAPI documentation:
http://127.0.0.1:8000/docs
⚛️ Frontend Setup
Open another terminal:
cd bharatmedguard-frontend
Install dependencies:
npm install
Start the development server:
npm run dev
Frontend:
http://localhost:5173
🗄️ MongoDB Configuration
BharatMedGuard uses MongoDB for application data storage.
Configure the MongoDB connection through the backend .env file.
Example:
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=bharatmedguard
Never commit your real .env file or database credentials to GitHub.
🔑 Environment Variables
Create a .env file inside the backend directory.
Example:
MONGODB_URI=
DATABASE_NAME=
JWT_SECRET=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
CORS_ORIGINS=
Use .env.example as the template.
🧪 Testing
Backend APIs can be tested using Postman.
Run the backend:
uvicorn app.main:app --reload
Then import the provided Postman collection and test:
Authentication
Authorization
Claims pipeline
Identity pipeline
Document pipeline
Clinical pipeline
Alerts
Investigation workflows
Audit logs
🛡️ Security Principles
BharatMedGuard follows several security principles:
Never store plaintext passwords
Validate incoming API data
Use authentication before accessing protected resources
Apply role-based authorization
Protect secrets using environment variables
Apply rate limiting to reduce API abuse
Maintain audit logs
Restrict cross-origin requests
Avoid committing sensitive files
Separate frontend and backend responsibilities
🎯 Project Objectives
The primary objectives of BharatMedGuard are to:
Detect suspicious healthcare activity.
Identify potential billing and insurance anomalies.
Detect patient and identity inconsistencies.
Analyze medical documents for suspicious patterns.
Identify unusual clinical data patterns.
Provide risk indicators for investigators.
Secure healthcare APIs and user access.
Maintain auditability of security-related actions.
Demonstrate practical application of AI/ML in healthcare cybersecurity.
🔮 Future Enhancements
Potential future improvements include:
Advanced supervised fraud detection models
XGBoost-based classification
FHIR / SMART on FHIR integration
Real-time streaming anomaly detection
Advanced threat intelligence integration
Improved explainable AI
Automated case prioritization
SIEM integration
Cloud deployment
Advanced network intrusion detection
Multi-hospital deployment architecture
⚠️ Disclaimer
BharatMedGuard is an educational and prototype cybersecurity project.
It is designed to demonstrate healthcare anomaly detection, security engineering, machine learning, and investigation workflows.
It is not intended to provide medical diagnosis, make autonomous healthcare decisions, or replace professional medical, insurance, compliance, or cybersecurity judgment.
Any anomaly detected by the system should be reviewed by an appropriately authorized human investigator.
👩‍💻 Development
BharatMedGuard combines:
Healthcare Security
        +
Machine Learning
        +
Fraud Detection
        +
API Security
        +
Document Intelligence
        +
Network Security
📜 License
This project is intended for educational and research purposes.
Add an appropriate open-source license if you decide to publish the project for external use.
⭐ BharatMedGuard
Detect. Analyze. Investigate. Protect.
An intelligent security layer for the healthcare ecosystem.

**That's one single copy operation.** Paste the whole thing into your root `README.md`, save, commit, and push.
