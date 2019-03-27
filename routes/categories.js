const express = require('express');
const router = express.Router();


/* Bring in bookModel && categoryModel */
let Book = require('../models/bookModel');
let Category = require('../models/categoryModel');


// Get Categories
router.get('/', function (req, res) {
    Category.find({}, function (err, categories) {
        if (err) {
            console.log(err);
        } else {

            res.render('categories', {
                categories: categories
            });
        }
    })
});

// Add category form
router.get('/add', function (req, res) {
    res.render('category-add');
});

// Add a category
router.post('/add', function (req, res) {
    req.checkBody('name', 'Name is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('book-add', {
            errors: errors
        });
    } else {
        let category = new Category();
        category.name = req.body.name;

        category.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Category Added!')
                res.redirect('/categories');
            }
        });
    }
});


// Edit category Form
router.get('/edit/:id', function (req, res) {
    Category.findOne({ _id: req.params.id }, function (err, category) {
        if (err) {
            console.log(err);
        } else {
            res.render('category-edit', {
                category: category,
            })
        }
    });
});

// Edit Category
router.post('/edit/:id', function (req, res) {
    let category = {};
    category.name = req.body.name;

    // Setting rules for a field
    req.checkBody('name', 'Name is required').notEmpty();

    // Validation Errors
    var errors = req.validationErrors();

    if (errors) {
        Category.findOne({ _id: req.params.id }, function (err, category) {
            res.render('category-edit', {
                category: category,
                errors: errors
            });
        });
    } else {
        Category.update({ _id: req.params.id }, category, function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Category Edited!');
                res.redirect('/categories');
            }
        });
    }
});

// Delete Category
router.post('/delete/:id', function (req, res) {
    Category.remove({ _id: req.params.id }, function (err) {
        if (err) {
            console.log(err);
        }
        req.flash('success', 'Category Deleted!');
        res.redirect('/categories');
    });
});

// Export router
module.exports = router;