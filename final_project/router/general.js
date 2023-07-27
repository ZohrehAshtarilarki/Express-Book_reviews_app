const express = require('express');
let booksData = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ errorMessage: "Unable to register customer." });
  }

  if (isValid(username)) {
    users.push({
      username,
      password
    })
    return res.send("Customer successfully registered. Now, you can login!");
  } else {
    return res.status(400).json({ errorMessage: "Customer with same username already exists" });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const formattedResponse = { books: booksData }; // Create an object with key "books"
  res.type('application/json').send(JSON.stringify(formattedResponse, null, 2));
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params;

    // Check if the book with the given ISBN exists in the booksData object
    if (booksData.hasOwnProperty(isbn)) {
      const bookDetails = booksData[isbn];
      return res.status(200).json(bookDetails);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const { author } = req.params;
  const matchedBooks = [];

  // Iterate through the booksData object
  Object.keys(booksData).forEach((isbn) => {
    const book = booksData[isbn];
    // Check if the author matches the one provided in the request parameters
    if (book.author === author) {
      matchedBooks.push(book);
    }
    // Check if any books matched the provided author
    if (matchedBooks.length > 0) {
      return res.status(200).json(matchedBooks);
    } else {
      return res.status(404).json({ message: "Books by the author not found" });
      }
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const { title } = req.params;
  const matchedBooks = [];

  // Iterate through the booksData object
  Object.keys(booksData).forEach((isbn) => {
    const book = booksData[isbn];
    // Check if the title matches the one provided in the request parameters
    if (book.title.toLowerCase() === title.toLowerCase()) {
      matchedBooks.push(book);
    }
  });

  // Check if any books matched the provided title
  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res.status(404).json({ message: "Books with the title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  
  // Check if the book with the given ISBN exists in the booksData object
  if (booksData.hasOwnProperty(isbn)) {
    const bookReviews = booksData[isbn].reviews;
    return res.status(200).json(bookReviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
