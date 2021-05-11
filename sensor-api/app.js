let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');

const PORT = 8080;

// used to query the database
let pool = new pg.Pool({
    user: 'postgres',
    database: 'senseme',
    password: '@yMcc0426',
    host: 'localhost',
    port: 5432,
    max: 10   
});
/*
const getTemp = () => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM test ORDER BY id ASC', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getHum = () => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM test ORDER BY id ASC', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const createEntry = (body) => {
    return new Promise(function (resolve, reject) {
        const { temp_f, temp_c, hum_percent } = body
        pool.query('INSRT INTO test (temp_f, temp_c, hum_percent) VALUES ($1, $2, $3 RETURNING *', [temp_f, temp_c, hum_percent], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve('New data read: ${results.row[0]}');
        })
    })
}
module.exports = {
    getTemp,
    getHum,
    createEntry,
}
*/
pool.connect((err, db, done) => {
    if (err) {
        return console.log(err)
    }
    else {
        db.query('SELECT * FROM test', (err, table) => {
            done();
            if (err) {
                return console.log(err)
            }
            else {
                console.log(JSON.stringify(table))
            }
        })
    }
})

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//morgan used for logging
app.use(morgan('dev'));

//get request for when successfully connected
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/newEndpoint', (req, res) => res.send('New Endpoint! Loading Data...'));

app.get('/account', (req, res) => res.send('account page'));


const app_form = require('./app')

// allows requests from react client side to postgres and express api
app.use(express.json());
app.use(function (request, response, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/test', (req, res) => {
    app_form.getTemp()
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/sense-temp', (req, res) => {
    app_form.createEntry(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})


app.post('/sensor_api/Account', function(request, response, nextr) {
    console.log(request.body);
});

// Tells system what port to listen to the api on and logs result
app.listen(PORT, () => console.log('Listening on port ' + PORT));