const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let bookList = JSON.stringify(books, null, 1);
    res.status(200).send(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.status(200).send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let out = [];
    let author = req.params.author;
    for (const[key, values] of Object.entries(books)){
        const book = Object.entries(values);
        if (book[0][1] == author){
            out.push(books[key]);
        }
    }
    if (out.length == 0){
        return res.status(300).json({message: "Author not found."});
    }
    res.status(200).json(out);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let out = [];
    let title = req.params.title;
    for (const[key, values] of Object.entries(books)){
        const book = Object.entries(values);
        if (book[1][1] == title){
            out.push(books[key]);
        }
    }
    if (out.length == 0){
        return res.status(300).json({message: "Book not found."});
    }
    res.status(200).json(out);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
