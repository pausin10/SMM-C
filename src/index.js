const express = require("express");
const router = require("router");
const exphbs = require("express-handlebars");
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const morgan = require('morgan');
const flash = require('connect-flash');
const cors = require('cors');
const SocketIO = require('socket.io');
const postit = require('./models/modelPostit.js')

const app = express();
require('./database');
require ('./passport/local-auth');

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
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'sockets')));
app.use(session({
    secret: 'key',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) =>{
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    next();
});

app.use('', require('./routes/login'));
app.use('', require('./routes/routes'));

const server = app.listen(app.get('port'), () => {
    console.log(`Server on ${app.get('port')}`);
});

const io = SocketIO(server);

io.on('connection', (socket) =>{
    console.log('Connected', socket.id);
    socket.on('postit:message', (data) =>{
        io.sockets.emit('postit:message',data);
        addPostit(data);
    });
});

io.on('error', () => {
    console.log('Error');
});

async function addPostit(data){
    const newPostit = new postit({
        user: data.username,
        description: data.message
    });
    await newPostit.save((err) =>{
        if(err){
            console.log('Error al guardar el postit en la BD. '+err);
            req.flash('error', 'Error al guardar');
        }else{
            console.log('Exito al guardar el postit en la BD');
        }
    });
}