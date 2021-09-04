var express = require('express');
var app = express();
var mysql = require('mysql');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTful CRUD API with Node.js, Express, MySQL',
        writtenBy: 'Yong',
        publishedOn: 'https://milerdev.dev'
    });
});

// Connection to MySQL database
var dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_api',
});

dbCon.connect();

// Retrieve all books
app.get('/books', (req, res) => {
    dbCon.query('SELECT * FROM books', (error, results, fields) => {
        if (error) throw error;

        var message = "";
        if (results === undefined || results.length == 0) {
            message = "Books table is empty";
        } else {
            message = "Successfully retrieved all books";
        }
        return res.send({ error: false, data: results, message: message });
    });
});

// Add a new book
app.post('/book', (req, res) => {
    var name = req.body.name;
    var author = req.body.author;

    // Validation
    if (!name || !author) {
        return res.status(400).send({ error: true, message: "Please provide book name and author" });
    } else {
        dbCon.query('INSERT INTO books (name, author) VALUES(?, ?)', [name, author], (error, results, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: "Book successfully added" });
        });
    }
});

// Retrieve book by id
app.get('/book/:id', (req, res) => {
    var id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id" });
    } else {
        dbCon.query('SELECT * FROM books WHERE id = ?', id, (error, results, fields) => {
            if (error) throw error;

            var message = "";
            if (results === undefined || results.length == 0) {
                message = "Book not found";
            } else {
                message = "Successfully retrieve book data";
            }
            return res.send({ error: false, data: results[0], message: message });
        });
    }
});

// Update book with id
app.put('/book', (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var author = req.body.author;

    // Validation
    if (!id || !name || !author) {
        return res.status(400).send({ error: true, message: "Please provide book id, name, and author" });
    } else {
        dbCon.query('UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields) => {
            if (error) throw error;

            var message = "";
            if (results.changedRows === 0) {
                message = "Book not found or data are same";
            } else {
                message = "Book successfully updated";
            }

            return res.send({ error: false, data: results, message: message });
        });
    }
});

// Delete book by id
app.delete('/book', (req, res) => {
    var id = req.body.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id" });
    } else {
        dbCon.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
            if (error) throw error;

            message = "";
            if (results.affectedRows === 0) {
                message = "Book not found";
            } else {
                message = "Book successfully deleted";
            }

            return res.send({ error: false, data: results, message: message });
        });
    }
});

app.listen(3000, () => {
    console.log('Node App is running on port 3000');
});

module.exports = app;