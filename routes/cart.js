const express = require('express');
const router = express.Router();


/* Bring in bookModel && categoryModel */
let Book = require('../models/bookModel');
let Category = require('../models/categoryModel');

// Cart
router.get('/', function (req, res) {
    // Get cart from the session 
    var cart = req.session.cart;
    var displayCart = { items: [], total: 0 };
    var total = 0;

    // Get Total
    for (var item in cart) {
        displayCart.items.push(cart[item]);
        total += (cart[item].qty * cart[item].price);
    }
    displayCart.total = total;
    carts = displayCart.items

    // Render Cart
    res.render('cart', {
        carts: carts.map(function (cart) {
            cart['total'] = cart.qty * cart.price;
            return cart;
        }),
        total: displayCart.total
    });
});

// Add to cart route
router.post('/:id', function (req, res) {
    req.session.cart = req.session.cart || {};
    var cart = req.session.cart;

    Book.findOne({ _id: req.params.id }, function (err, book) {
        if (err) {
            console.log(err);
        }
        if (cart[req.params.id]) {
            cart[req.params.id].qty++
        } else {
            cart[req.params.id] = {
                item: book._id,
                title: book.title,
                price: book.price,
                qty: 1
            }
        }
        res.redirect('/cart');
    });
});


// Remove fom the cart
router.get('/remove', function (req, res) {
    if (req.session.cart) {
        console.log('its working')
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/cart');
            }
        });
    }
});

// Export router
module.exports = router;