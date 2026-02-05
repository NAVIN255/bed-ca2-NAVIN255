🔮 Magical Wellness Challenge — CA2

A wellness challenge web application enhanced with gamification features.
Users earn skillpoints by completing wellness challenges and use them to unlock and activate spells that provide gameplay advantages.

This project extends the backend system developed in CA1, with a strong focus on frontend–backend integration, user experience, and secure authentication.

🎯 Project Objectives

Build a complete wellness challenge application

Integrate frontend features with an existing backend

Implement secure authentication using JWT and BCrypt

Apply gamification concepts such as points, spells, and progress tracking

Design an intuitive and visually appealing user interface

🚀 Quick Start
Option 1: Startup Script (Windows – Recommended)

Double-click start-backend.bat

Open frontend/index.html in your browser

Login using the test account:

Email: test@lol.com
Password: 1234

Option 2: Manual Setup
Backend
cd backend
npm install       # First time only
npm start


Backend runs at:

http://localhost:3000

Database Initialization

⚠️ This will reset all database tables:

node src/configs/initTables.js

Frontend

Open:

frontend/index.html


(Recommended: Live Server)

🧪 Test Account
Email	Password
test@lol.com
	1234
✨ Core Features
🔐 Authentication & Security

User registration and login

Password hashing with BCrypt

JWT access and refresh tokens

Protected API routes

Secure session handling

🎯 Wellness Challenge Management

Users can:

Create wellness challenges

Select difficulty levels (Easy / Medium / Hard)

Earn skillpoints upon completion

Track active and completed challenges

🔮 Gamification System

Spell shop with point requirements

Users can own multiple spells

One active spell at a time

Limited-use spell activation

Spells provide gameplay advantages

📊 Progress Tracking

Total skillpoints

Active & completed challenges

Level progression bar

Badge display

🔧 Technology Stack
Backend

Node.js

Express.js

MySQL

JWT Authentication

BCrypt Password Hashing

MVC Architecture

Frontend

HTML5

CSS3 (Custom Magical Theme)

Vanilla JavaScript

Fetch API

DOM Manipulation

Responsive Design

📁 Project Structure
backend/
 ├── src/
 │   ├── configs/          # Database initialization
 │   ├── controllers/      # Business logic
 │   ├── middleware/       # Auth & validation
 │   ├── models/           # Database queries
 │   ├── routes/           # API routing
 │   ├── services/         # Database connection
 │   ├── app.js
 │   └── index.js
 ├── .env
 └── package.json

frontend/
 ├── css/
 │   └── magical-theme.css
 ├── js/
 │   ├── services/
 │   │   └── APIService.js
 │   ├── dashboard-fixed.js
 │   ├── api.js
 │   └── register.js
 ├── index.html
 ├── register.html
 ├── dashboard.html
 └── profile.html

🌐 API Endpoints Overview
Authentication

POST /api/login

POST /api/register

POST /api/refresh

User

GET /api/users/profile

Challenges

GET /api/challenges

POST /api/challenges

POST /api/challenges/:id/completions

Gamification

GET /api/spells

POST /api/spells/activate

🛡️ Security Practices

Passwords hashed using BCrypt

JWT used for session management

Token verification middleware

Backend validation for all sensitive operations

Server-controlled skillpoint updates

🎥 Video Demonstration

An unlisted YouTube video is included in the report, demonstrating:

Features available before login

User registration and login flow

Challenge creation and completion

Spell activation and gamification system

🧹 Code Quality & Modularity

MVC architecture applied on backend

Unused legacy tables and routes removed

Modular frontend JavaScript files

Consistent naming conventions

Clear separation of concerns

📘 Version Control

GitHub Classroom repository used

Regular commits with clear messages

README provided for setup and usage

👨‍🎓 Author

Navin
BED CA2 – Magical Wellness Challenge
Singapore Polytechnic