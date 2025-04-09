<div align="center">
  
<h3 align="center">Next Stop</h3>

  <p align="center">
    A travel destination search and bucket list application with user reviews.
    <br />
     <a href="https://github.com/vivekajayjariwala/nextstop">github.com/vivekajayjariwala/nextstop</a>
  </p>
</div>

<!-- REMOVE THIS IF YOU DON'T HAVE A DEMO -->
<!-- TIP: You can alternatively directly upload a video up to 100MB by dropping it in while editing the README on GitHub. This displays a video player directly on GitHub instead of making it so that you have to click an image/link -->
<div align="center">
  <a href="https://youtu.be/JN5ZydEXF6s">
<!--     <img src="https://github.com/user-attachments/assets/f45c9ee9-ad2f-40f4-bb60-e9bbd1472c45" alt="Project Demo"> -->
    <p>Watch Demo Video</p>
  </a>
</div>

## Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
      </ul>
    </li>
    <li><a href="#architecture">Architecture</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Next Stop is a full-stack web application that allows users to search for travel destinations, create personalized bucket lists, and contribute reviews. It provides a platform for travel enthusiasts to discover new places, plan their trips, and share their experiences with the community. The application is built with a responsive design, ensuring a seamless experience across various devices.

### Key Features

- **Destination Search:** Users can search for destinations by name, country, or region, with detailed information displayed for each result.
- **Bucket List Creation:** Authenticated users can create and manage their own travel bucket lists, adding destinations they wish to visit.
- **User Reviews:** Users can submit reviews and ratings for travel lists, contributing to the community's knowledge and helping others make informed decisions.
- **Admin Panel:** Administrators have access to a user management panel, allowing them to manage user accounts and permissions.
- **Authentication and Authorization:** Secure user authentication and authorization using JWT (JSON Web Tokens) to protect user data and restrict access to certain features.
- **Responsive Design:** The application is designed to be responsive and accessible on various devices, providing a consistent user experience.

## Architecture

The Next Stop application follows a Model-View-Controller (MVC) architecture, with a React-based frontend and a Node.js/Express.js backend.

- **Frontend:**
    - React: A JavaScript library for building user interfaces.
    - React Router: For handling client-side routing and navigation.
    - Tailwind CSS: A utility-first CSS framework for styling the application.
    - Axios: A promise-based HTTP client for making API requests.
    - JWT Decode: For decoding JSON Web Tokens (JWT) on the client-side.

- **Backend:**
    - Node.js: A JavaScript runtime environment for executing server-side code.
    - Express.js: A web application framework for Node.js, providing routing and middleware functionality.
    - Mongoose: An Object Data Modeling (ODM) library for MongoDB, providing a schema-based solution for modeling application data.
    - JSON Web Tokens (JWT): For secure authentication and authorization.
    - Bcrypt: For hashing and salting passwords to protect user credentials.
    - Cors: Middleware to enable Cross-Origin Resource Sharing.
    - String Similarity: Used for fuzzy searching of destinations.

- **Database:**
    - MongoDB: A NoSQL database used to store destination data, user accounts, and travel lists.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/vivekajayjariwala/nextstop.git
   ```

2. Navigate to the client directory:
   ```sh
   cd nextstop/client
   ```

3. Install client-side dependencies:
   ```sh
   npm install
   ```

4. Start the client-side development server:
   ```sh
   npm start
   ```

5. Navigate to the server directory:
   ```sh
   cd ../server
   ```

6. Install server-side dependencies:
   ```sh
   npm install
   ```

7. Create a `.env` file in the server directory and configure the following environment variables:
   ```
   PORT=3000
   MONGOURL=mongodb://localhost:27017/your_database
   JWTPRIVATEKEY=your_jwt_private_key
   CLIENT_URL=http://localhost:3001
   ```

8. Start the server:
   ```sh
   node server.js
   ```
