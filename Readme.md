# UI Thrive Backend
## Overview
The express API is a backend web application. It provides endpoint for user authentication. The application includes
features like authentication, logging etc.
## Features
- Authentication Endpoint:
    - User signup
    - User signin and retrieve JWT token.
    - Verify OTP
    - Resend OTP
- Logging:
    - Captures important events, request an errors.
## Prerequisites
- NodeJs
- ExpressJS
- MySQL
- Postman for API testing
## Getting Started
### Clone the Repository
```shell
git clone https://github.com/Daud94/pataverse-assessment.git
cd petaverse-assessment
```
### Configuration
Create a `.env` file in the root directory with the following content:
```dotenv
NODE_ENV=
SALT=
JWT_SECRET=
```
`NODE_ENV` can either be `development` or `production`. For this app, it should be set to development.
`SALT` should be a numeric value (e.g 10)
`JWT_SECRET` could be any string of your choice but should be secured enough.

### Installation
Install all dependencies from the `package.json` file:
```shell
npm install
```
Run the application:
```angular2html
npm run dev
```
### Database Migration
Apply migrations to the SQLite database:
```shell
npm run migrate
```

### API Endpoints
**Authentication Endpoint**
POST `/api/auth/signup`
  - Allows user to signup
POST `/api/auth/signin`
  - Allows user to signin
PUT `/api/auth/verify-otp`
  - After user signup, a six-digit OTP is sent to the user. This endpoint allows verification of the otp.
POST `/api/auth/resend-otp`
- Allows user to regenerate a new otp if previous one expires.

### Authentication
The API uses JWT (JSON Web Token) for authentication. After logging in, you will receive a token which must be included in the Authorization header of subsequent requests.

### Signup
Endpoint: POST `/api/auth/signup`

Request body:
```json
{
  "firstName": "your_first_name",
  "lastName": "your_last_name",
  "email": "your_email",
  "password": "your_password"
}
```
### Signin
Endpoint: POST `/api/auth/signin`

Request body:
```json
{
  "email": "your_email",
  "password": "your_password"
}
```
### Verify OTP
Endpoint: PUT `/api/auth/verify-otp`

Request body:
```json
{
  "email": "your_email",
  "emailToken": "your_OTP"
}
```
### Resend OTP
Endpoint: POST `/api/auth/resend-otp`

Request body:
```json
{
  "email": "your_email"
}
```