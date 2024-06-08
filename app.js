var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, 'db/sqlite.db'), (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

app.get('/api', (req, res) => {
    let goldType = req.query.GoldType;
    if (goldType !== 'gold24k') {
        res.status(400).send('Invalid gold type');
        return;
    }
    let sql = 'SELECT year, price FROM gold_prices WHERE type = ?';
    db.all(sql, [goldType], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(rows);
    });
});


app.post('/api', (req, res) => {
    let goldType = req.body.GoldType;
    if (goldType !== 'gold24k') {
        res.status(400).send('Invalid gold type');
        return;
    }
    let sql = 'SELECT year, price FROM gold_prices WHERE type = ?';
    db.all(sql, [goldType], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
