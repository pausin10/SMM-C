const express = require("express");
const router = require("router");
const exphbs = require("express-handlebars");
const path = require('path');
const passport = require('passport');
const morgan = require('morgan');

//require ('./passport/local-auth');

const app = express();

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'index',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('', require('./routes/routes'));
app.use('', require('./routes/login'));

app.listen(app.get('port'), () => {
    console.log(`Server on ${app.get('port')}`);
});