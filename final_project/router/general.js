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
    const bookList = JSON.stringify(books, null, 2); // Pretty-print with 2 spaces for indentation
    return res.status(200).send(bookList);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching the book list." });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const matchedBooks = [];

  for (const key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchedBooks.push(books[key]);
    }
  }

  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given author" });
  }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const matchedBooks = [];

  for (const key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchedBooks.push(books[key]);
    }
  }

  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given title" });
  }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews || {});
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Define a helper function to simulate fetching books from an external API
const fetchBooks = () => {
  return new Promise((resolve, reject) => {
    try {
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
    const response = await axios.get('http://localhost:5000/'); // Simulate external API call
    res.status(200).json(JSON.parse(response.data));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books: " + error.message });
  }
});

// Using Async-Await with Local Data
public_users.get('/books-async-local', async (req, res) => {
  try {
    const bookList = await fetchBooks();
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books: " + error });
  }
});

// Using Promise Callbacks to fetch book details by Author
public_users.get('/author-promise/:author', (req, res) => {
  const { author } = req.params;

  const fetchBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const matchedBooks = [];

      for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchedBooks.push(books[key]);
        }
      }

      if (matchedBooks.length > 0) {
        resolve(matchedBooks);
      } else {
        reject("No books found for the given author");
      }
    });
  };

  fetchBooksByAuthor(author)
    .then((matchedBooks) => {
      res.status(200).json(matchedBooks);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Using Async-Await with Axios to fetch book details by Author
public_users.get('/author-async/:author', async (req, res) => {
  const { author } = req.params;

  try {
    const response = await axios.get(`https://example.com/api/books?author=${author}`); // Replace with real endpoint
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author: " + error.message });
  }
});

// Using Async-Await with Local Data to fetch book details by Author
public_users.get('/author-async-local/:author', async (req, res) => {
  const { author } = req.params;

  const fetchBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const matchedBooks = [];

      for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchedBooks.push(books[key]);
        }
      }

      if (matchedBooks.length > 0) {
        resolve(matchedBooks);
      } else {
        reject("No books found for the given author");
      }
    });
  };

  try {
    const matchedBooks = await fetchBooksByAuthor(author);
    res.status(200).json(matchedBooks);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Using Promise Callbacks to fetch book details by Title
public_users.get('/title-promise/:title', (req, res) => {
  const { title } = req.params;

  const fetchBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const matchedBooks = [];

      for (const key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          matchedBooks.push(books[key]);
        }
      }

      if (matchedBooks.length > 0) {
        resolve(matchedBooks);
      } else {
        reject("No books found for the given title");
      }
    });
  };

  fetchBooksByTitle(title)
    .then((matchedBooks) => {
      res.status(200).json(matchedBooks);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Using Async-Await with Axios to fetch book details by Title
public_users.get('/title-async/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const response = await axios.get(`https://example.com/api/books?title=${title}`); // Replace with real endpoint
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title: " + error.message });
  }
});

// Using Async-Await with Local Data to fetch book details by Title
public_users.get('/title-async-local/:title', async (req, res) => {
  const { title } = req.params;

  const fetchBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const matchedBooks = [];

      for (const key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          matchedBooks.push(books[key]);
        }
      }

      if (matchedBooks.length > 0) {
        resolve(matchedBooks);
      } else {
        reject("No books found for the given title");
      }
    });
  };

  try {
    const matchedBooks = await fetchBooksByTitle(title);
    res.status(200).json(matchedBooks);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports.general = public_users;