const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
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
public_users.get('/', function (req, res) {
    //Write your code here
    getBooksAsync().then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: "Couldn't get the books in the shop." });
      })
  });
  function getBooksAsync() {
    return new Promise((resolve) => {
      resolve(JSON.stringify(books, null, 4));
    });
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByIsbnAsync(isbn)
    .then(bookRecord => {
      return res.send(bookRecord);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err });
    })
});
function getBookByIsbnAsync(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book based on ISBN not Found");
    }
  });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
  
    getBookByAuthorAsync(author)
      .then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
  });
  function getBookByAuthorAsync(author) {
    return new Promise((resolve, reject) => {
      const booksExist = Object.values(books).filter(book => book.author == author);
      if (booksExist.length > 0) {
        resolve(booksExist);
      } else {
        reject("Book based on the author not Found");
      }
    });
  }
  
  // Get all books based on title
  public_users.get('/title/:title', function (req, res) {
  
    const title = req.params.title;
  
    getBookByTitleAsync(title)
      .then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
  });
  function getBookByTitleAsync(title) {
    return new Promise((resolve, reject) => {
      const booksExist = Object.values(books).filter(book => book.title == title);
      if (booksExist.length > 0) {
        resolve(booksExist);
      } else {
        reject("Book based on the title not Found");
      }
    });
  }

// Get book review
public_users.get('/review/:isbn', function (req, res) {
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