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

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Get ISBN from request parameters
    const { review } = req.query; // Get review from request query

    if (!review) {
        return res.status(400).json({ message: "Review is required." });
    }

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Verify user authentication
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No session token found." });
    }

    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        const username = decoded.username; // Extract username from the token

        // Add or update the review for the book
        book.reviews[username] = review;

        return res.status(200).json({
            message: "Review added/updated successfully.",
            book: { isbn, reviews: book.reviews }
        });
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
