// EXPRESS
const express = require('express');
const http = require('http');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 7777;
app.use(express.static('public'));

// HANDLEBARS
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: '.hbs',
    })
);
app.set('view engine', 'hbs');

// STORE
const store = require('store');
const res = require('express/lib/response');
const { options } = require('nodemon/lib/config');
store.set('members', []);
store.set('expenses', []);
let currencies = {
    USD: null,
    EUR: null,
    JPY: null,
    GBP: null,
    CHF: null,
    CAD: null,
    AUD: null,
    CNY: null,
    HKD: null,
    NZD: null,
    MXN: null,
    NOK: null,
    SGD: null,
    KRW: null,
    SEK: null,
};

/**
 * home page route
 */
app.get('/', (req, res) => {
    res.render('home');
});

// Open the PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

/**
 * route handler for Max Belyaev's Exchange Rate API
 */
app.get('/rate', (request, response) => {
    currency = request.query.currency;
    rate = null;
    console.log(`request to get currency rate: ${currency}:USD`);
    if (currencies[currency] != null) {
        response.send(String(currencies[currency]));
    } else {
        let options = get_server_options(currency);
        const port = options.port == 443 ? https : http;
        let output = '';
        send_exchange_rate_response(response, options, port, output);
    }
});

/**
 * returns an object with HTTP request option headers
 * @returns
 */
let get_server_options = (currency) => {
    let options = {
        host: 'exchange-rate-microservice.herokuapp.com',
        port: 443,
        path: `/exchangerate/${currency}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return options;
};

/**
 * calls Max Belyaev's exchnge rate API and returns the resulting
 * exchange rate
 * @param {*} options
 * @param {*} port
 * @param {*} output
 * @returns
 */
let send_exchange_rate_response = (response, options, port, output) => {
    const req = port.request(options, (res) => {
        console.log(`${options.host} : ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            output += chunk;
        });
        res.on('end', () => {
            let obj = JSON.parse(output);
            console.log('returned object: ', obj);
            rate = obj;
            console.log('Rate: ', rate);
            if (currencies[currency] == null) {
                currencies[currency] = rate;
            }
            response.send(String(rate));
        });
        req.on('error', (err) => {
            res.send('error: ' + err.message);
        });
    });
    req.end();
    return;
};
