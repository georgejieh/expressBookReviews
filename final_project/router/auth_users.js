const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => {
    return username && typeof username === 'string' && username.trim().length > 0;
};

// Authenticate user credentials
const authenticatedUser = (username, password) => {
    const user = users.find((u) => u.username === username);
    return user && user.password === password;
};

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    // Validate input
    if (!isValid(username) || !isValid(password)) {
        return res.status(400).json({ message: "Username and password are required and must be valid." });
    }

    // Check if the username already exists
    const userExists = users.some((u) => u.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists. Please choose another username." });
    }

    // Add the new user to the users list
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully!" });
});

// Login for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    // Validate input
    if (!isValid(username) || !isValid(password)) {
        return res.status(400).json({ message: "Username and password are required and must be valid." });
    }

    // Check if the user exists and credentials are correct
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate a JWT for the user
    const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

    // Save the token in the session
    req.session.token = accessToken;

    return res.status(200).json({
        message: "Login successful!",
        token: accessToken
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
