const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review;
    if(!review){
	    return res.status(400).json({message: "A review is required."});
    }
    let user = req.session.authorization.username;
    if (books[isbn]){
        books[isbn].reviews[user] = review;
        return res.status(200).send("Review has been posted/changed.");
    }
    res.status(404).json({message: "The given ISBN was not found."});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let user = req.session.authorization.username;
    if (books[isbn]){
        delete books[isbn].reviews[user];
        return res.status(200).send("Review has been deleted.");
    }
    res.status(404).json({message: "The given ISBN was not found."});
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
