
# AI-Tool Explore TechTrove

AI-Tool Explore TechTrove is a responsive MERN stack application showcasing various AI tools. This project allows users to explore AI tools, contribute suggestions, and includes an admin portal for managing tool submissions.

## Project Links

- **Live Website:** [AI-Tool Explore TechTrove](https://techtrove.vercel.app/)
- **GitHub Repository:** [TechTrove GitHub](https://github.com/IshantSomani/TechTrove)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Key Libraries Used](#key-libraries-used)
- [Run Locally](#run-locally)
- [Contributing](#contributing)

## Features

- Browse AI tools categorized by use cases
- User-friendly, responsive interface
- User contribution system for AI tool suggestions
- Admin portal for review and approval of submissions
- Contributor recognition in the footer
- Search functionality for easy tool discovery
- Responsive design for seamless user experience on various devices
- Light/dark mode toggle

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

### Backend
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key 
    PORT=3000

### Frontend
    VITE_API_URI=your_backend_api_url
    VITE_LOCAL_STORAGE_KEY=ai_tools_storage_key
    VITE_LOCAL_STORAGE_KEY_USER=your_user_local_storage_key
## Key Libraries Used

### Backend

```bash
npm i express mongoose cors dotenv jsonwebtoken nodemon
```
- cors
- dotenv
- express
- jsonwebtoken
- mongoose
- nodemon

### Frontend

```bash
npm i react-router-dom @reduxjs/toolkit react-redux axios jwt-decode 
npm i @mui/material @mui/icons-material @mui/x-data-grid @emotion/react @emotion/styled 
npm i @heroicons/react material-ui-popup-state react-favicon
```

- @emotion/react
- @emotion/styled
- @heroicons/react
- @mui/material
- @mui/system
- @mui/x-data-grid
- @reduxjs/toolkit
- axios
- jwt-decode
- material-ui-popup-state
- react-dom
- react-favicon
- react-redux
- react-router-dom

### Database
- MongoDB
## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express

**Database:** MongoDB


## Run Locally

Clone the project

```bash
  git clone https://github.com/IshantSomani/TechTrove.git
  cd TechTrove
```

Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
    cd backend
    npm install

# Install frontend dependencies
    cd ../frontend
    npm install
```

Set up environment variables as described above.

Start the backend server:
```bash
    cd backend
    npm start
```

In a new terminal, start the frontend development server:

```bash
    cd frontend
    npm run dev
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.