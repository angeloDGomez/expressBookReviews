const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password){
    // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let bookList = JSON.stringify(books, null, 1);
    res.status(200).send(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.status(200).send(books[isbn]);
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
    let isbn = req.params.isbn;
    try{
        res.status(200).send(books[isbn].reviews);
    }
    catch (TypeError){
        res.status(500).send({message:"A book with that ISBN does not exist"})
    }
});

module.exports.general = public_users;
