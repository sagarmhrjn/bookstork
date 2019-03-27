const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');


/* Connecting to mongoose */
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', function (err) {
    console.log(err);
});

/* Init app */
const app = express();

/* Bring in bookModel && categoryModel */
let Book = require('./models/bookModel');
let Category = require('./models/categoryModel');


/*  PORT NUMBER */
var port = process.env.PORT || 8080

// Body Parser middleware parse application/x-www-form-urlecoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Middleware for template/view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

/* Middleware for public/static folder */
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyword cat',
    resave: false,
}));

/* Global vars */
app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
});

/* Middleware for express-validator */
app.use(expressValidator());

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


/*let books = [{
    title: 'Node.js Blueprints',
    category: 'Node.js',
    publisher: 'Packt Publishing - ebooks Account (June 16, 2014)',
    price: '$19.99',
    description: 'Starting with an overview of the most popular programming paradigms',
    cover: 'https://www.packtpub.com/sites/default/files/7338OS_Node.js%20Blueprints.jpg'
}]
*/

// FRONTEND
app.get('/', function (req, res) {
    Book.find({}, function (err, books) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                books: books
            });
        }
    });
});

app.get('/details/:id', function (req, res) {
    Book.findOne({ _id: req.params.id }, function (err, book) {
        if (err) {
            console.log(err);
        } else {
            res.render('book-details', {
                book: book
            });
        }
    });
})

/* Router files */
// MANAGE BOOKS && CATEGORIES, CART
let books = require('./routes/books');
let categories = require('./routes/categories');
let cart = require('./routes/cart');

app.use('/books', books);
app.use('/categories', categories);
app.use('/cart', cart);


app.listen(port, () => {
    console.log('Server started on port ' + port);
});