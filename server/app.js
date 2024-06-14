const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")
// Load environment variables from .env file
dotenv.config();

// Register models before importing routes
require("./models/user.models");
require("./models/post.models")
// Database connection string from environment variables
const connectionString = process.env.DATABASE_URI;

// Connect to MongoDB
mongoose
  .connect(connectionString)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log("Error in Connection ", err));

// Import routes after models are registered
const auth = require("./routes/auth.routes");
const post = require("./routes/post.routes")
// This line should be written before the route handler, FIRST WE NEED TO PARSE THE REQ INTO JSON FORMAT THEN DO THE ROUTING
app.use(express.json());
app.use(auth);
app.use(post)
app.use(cors)
// Custom middleware function
/*
const customMiddleware = (req, res, next) => {
  console.log("Middleware executed");
  next();
};
*/


// Apply middleware to all routes

/*
app.use(customMiddleware);

// Define routes
app.get("/", (req, res) => {
  console.log("Home page is responded");
  res.send("Hello world!!");
});

app.get("/about", (req, res) => {
  console.log("About page is responded");
  res.send("About page");
});
*/


// Example of applying middleware to a specific route
/*
app.get("/about", customMiddleware, (req, res) => {
  console.log("About page is responded");
  res.send("About page");
});
*/

// Start the server and listen on the specified port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
