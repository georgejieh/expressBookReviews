const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid (not empty and a string)
const isValid = (username) => {
    return username && typeof username === 'string' && username.trim().length > 0;
};

// Check if the username and password match the records
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

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
