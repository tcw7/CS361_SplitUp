// EXPRESS
const express = require('express');
const app = express();
const PORT = process.env.PORT || 7777;
app.use(express.static('public'));

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

// STORE
const store = require('store');
store.set('members', []);
store.set('expenses', []);
// console.log(store.get('members'));

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

// Open the PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
