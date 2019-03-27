const express = require('express');
const router = express.Router();


/* Bring in bookModel && categoryModel */
let Book = require('../models/bookModel');
let Category = require('../models/categoryModel');


// Get Books
router.get('/', function (req, res) {
    Book.find({}, function (err, books) {
        if (err) {
            console.log(err);
        } else {
            res.render('books', {
                books: books
            });
        }
    });
});

// Book Form
router.get('/add', function (req, res) {
    Category.find({}, function (err, categories) {
        if (err) {
            console.log(err);
        } else {
            res.render('book-add', {
                categories: categories
            });
        }
    });
});

// Add Book
router.post('/add', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('publisher', 'Publisher is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('category', 'Category is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('cover', 'Cover is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        Category.find({}, function (err, categories) {
            res.render('book-add', {
                errors: errors,
                categories: categories
            });
        });

    } else {
        let book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        book.publisher = req.body.publisher;
        book.price = req.body.price;
        book.category = req.body.category;
        book.description = req.body.description;
        book.cover = req.body.cover;

        book.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Book Added!')
                res.redirect('/books');
            }
        });
    }
});

// Edit Form
router.get('/edit/:id', function (req, res) {
    Category.find({}, function (err, categories) {
        Book.findOne({ _id: req.params.id }, function (err, book) {
            if (err) {
                console.log(err);
            } else {
                res.render('book-edit', {
                    book: book,
                    categories: categories
                })
            }
        });
    });
});


// Edit Book
router.post('/edit/:id', function (req, res) {
    let book = {};
    book.title = req.body.title;
    book.author = req.body.author;
    book.publisher = req.body.publisher;
    book.price = req.body.price;
    book.category = req.body.category;
    book.description = req.body.description;
    book.cover = req.body.cover;

    // Setting rules for a field
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('publisher', 'Publisher is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('category', 'Category is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('cover', 'Cover is required').notEmpty();

    // Validation Errors
    var errors = req.validationErrors();

    if (errors) {
        Category.find({}, function (err, categories) {
            Book.findOne({ _id: req.params.id }, function (err, book) {
                res.render('book-edit', {
                    book: book,
                    categories: categories,
                    errors: errors
                });
            });
        });
    } else {
        Book.update({ _id: req.params.id }, book, function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Book Edited!');
                res.redirect('/books');
            }
        });
    }
});


// Delete Book
router.post('/delete/:id', function (req, res) {
    Book.remove({ _id: req.params.id }, function (err) {
        if (err) {
            console.log(err);
        }
        req.flash('success', 'Book Deleted!');
        res.redirect('/books');
    });
});

// Export router
module.exports = router;