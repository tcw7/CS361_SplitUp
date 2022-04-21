// EXPRESS
const express = require('express');
const app = express();
const PORT = 7777;

// HANDLEBARS
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
// const template = Handlebars.compile('Name: {{name}}');
// console.log(template({ name: 'Tyler' }));
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: '.hbs',
    })
);
app.set('view engine', 'hbs');

// ROUTES
app.get('/', (req, res) => {
    res.render('test');
});

// Open the PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
