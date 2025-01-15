const express = require('express');
let books = require("./booksdb.js"); // Import the books database
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  // Placeholder implementation
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    // Convert the books object to a JSON string and return it with proper formatting
    const bookList = JSON.stringify(books, null, 2); // Pretty-print with 2 spaces for indentation
    return res.status(200).send(bookList);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching the book list." });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params; // Retrieve the ISBN from the request parameters

    if (books[isbn]) {
        // If the book exists, return the book details
        return res.status(200).json(books[isbn]);
    } else {
        // If the book is not found, return a 404 error
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Placeholder implementation
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Placeholder implementation
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Placeholder implementation
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;