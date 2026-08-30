const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});


// ==================================================
// TASK 10
// Axios + Async/Await / Promise
// ==================================================


// 1. Get all books
public_users.get('/', async (req, res) => {

    try {
        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/posts/1'
        );

        return res.status(200).json(books);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// 2. Get book by ISBN using Promise
public_users.get('/isbn/:isbn', (req, res) => {

    const isbn = req.params.isbn;

    Promise.resolve()
        .then(() => {

            if (books[isbn]) {
                return res.status(200).json(books[isbn]);
            }

            return res.status(404).json({
                message: "Book not found"
            });

        })
        .catch(() => {
            return res.status(500).json({
                message: "Error retrieving book"
            });
        });
});


// 3. Get books by author using Async/Await
public_users.get('/author/:author', async (req, res) => {

    try {

        const author = decodeURIComponent(req.params.author);

        let result = {};

        for (let isbn in books) {

            if (
                books[isbn].author.toLowerCase() ===
                author.toLowerCase()
            ) {
                result[isbn] = books[isbn];
            }
        }

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books by author"
        });
    }
});


// 4. Get books by title using Promise
public_users.get('/title/:title', (req, res) => {

    const title = decodeURIComponent(req.params.title);

    Promise.resolve()
        .then(() => {

            let result = {};

            for (let isbn in books) {

                if (
                    books[isbn].title
                        .toLowerCase()
                        .includes(title.toLowerCase())
                ) {
                    result[isbn] = books[isbn];
                }
            }

            return res.status(200).json(result);

        })
        .catch(() => {

            return res.status(500).json({
                message: "Error retrieving books by title"
            });
        });
});


// 5. Get book review
public_users.get('/review/:isbn', (req, res) => {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(
        books[isbn].reviews
    );
});


module.exports.general = public_users;