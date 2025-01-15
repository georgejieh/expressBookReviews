const express = require('express');
const axios = require('axios'); // Import Axios
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
    const { author } = req.params; // Retrieve the author from the request parameters
    const matchedBooks = [];

    // Iterate through the books object
    for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchedBooks.push(books[key]);
        }
    }

    if (matchedBooks.length > 0) {
        // If books are found, return them as a JSON response
        return res.status(200).json(matchedBooks);
    } else {
        // If no books are found, return a 404 error
        return res.status(404).json({ message: "No books found for the given author" });
    }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params; // Retrieve the title from the request parameters
    const matchedBooks = [];

    // Iterate through the books object
    for (const key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            matchedBooks.push(books[key]);
        }
    }

    if (matchedBooks.length > 0) {
        // If books are found, return them as a JSON response
        return res.status(200).json(matchedBooks);
    } else {
        // If no books are found, return a 404 error
        return res.status(404).json({ message: "No books found for the given title" });
    }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params; // Retrieve the ISBN from the request parameters

    if (books[isbn]) {
        // If the book exists, return the reviews
        return res.status(200).json(books[isbn].reviews || {});
    } else {
        // If the book is not found, return a 404 error
        return res.status(404).json({ message: "Book not found" });
    }
});

// Define a helper function to simulate fetching books from an external API
const fetchBooks = () => {
    return new Promise((resolve, reject) => {
        try {
            // Simulate a network call delay with a resolved Promise
            resolve(books);
        } catch (error) {
            reject("Error fetching book data");
        }
    });
};

// Using Promise Callbacks
public_users.get('/books-promise', (req, res) => {
    fetchBooks()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
});

// Using Async-Await with Axios (Example: Simulating API call)
public_users.get('/books-async', async (req, res) => {
    try {
        // Simulate an external API call by using the local `/` route
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(JSON.parse(response.data)); // Parse JSON if returned as string
    } catch (error) {
        res.status(500).json({ message: "Error fetching books: " + error.message });
    }
});

// Using Async-Await with Local Data
public_users.get('/books-async-local', async (req, res) => {
    try {
        // Simulate an async call to fetch local books
        const bookList = await fetchBooks();
        res.status(200).json(bookList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books: " + error });
    }
});

// Using Promise Callbacks to fetch book details by ISBN
public_users.get('/isbn-promise/:isbn', (req, res) => {
    const { isbn } = req.params;

    const fetchBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        });
    };

    fetchBookByISBN(isbn)
        .then((book) => {
            res.status(200).json(book);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});

// Using Async-Await with Axios to fetch book details by ISBN
public_users.get('/isbn-async/:isbn', async (req, res) => {
    const { isbn } = req.params;

    try {
        const response = await axios.get(`https://example.com/api/books/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details: " + error.message });
    }
});

// Using Async-Await with Local Data to fetch book details by ISBN
public_users.get('/isbn-async-local/:isbn', async (req, res) => {
    const { isbn } = req.params;

    const fetchBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        });
    };

    try {
        const book = await fetchBookByISBN(isbn);
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;