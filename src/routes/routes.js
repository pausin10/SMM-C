const express = require('express');
const router = express.Router();
const user = require('../models/user');
const postit = require('../models/postit');
const room = require('../models/room');

router.get('/home', isAuthenticated, async (req, res) => {
    const rooms = await room.find().lean();
    res.render('general/home', {
        myUser: req.user.email,
        rooms: { ...rooms }
    });
});

router.get('/postit', isAuthenticated, async (req, res) => {
    const myPostits = await postit.find({ user: req.user.email }).lean();
    res.render('general/postits', { 
        myPostits,
        myUser: req.user.email
    });
});

router.get('/postit/delete/:id', isAuthenticated, async (req, res) => {
    await postit.findByIdAndDelete({ _id: req.params.id });
    res.redirect('/postit');
});

router.get('/addRoom', isAuthenticated, async (req, res) => {
    res.render('general/addRoom', { myUser: req.user.email });
});

router.post('/addRoom', isAuthenticated, async (req, res) => {
    const newRoom = new room({
        name: req.body.nombreSala,
        type: req.body.typeRoom,
        password: req.body.password,
        createdBy: req.body.createdBy
    });
    await newRoom.save((err) => {
        if (err) {
            console.log('Error al crear la sala');
            req.flash('error', 'Error al crear una sala');
            res.redirect('/addRoom');
        } else {
            console.log('Sala ' + req.body.nombreSala + ' creada por ' + req.bodycreatedBy + ' guardada con exito ');
            res.redirect('/home');
        }
    })
})

router.get('/addRoom/delete/:id', isAuthenticated, async (req, res) => {
    await room.findByIdAndDelete({ _id: req.params.id });
    res.redirect('/home');
})

router.get('/*', (req, res) => {
    res.render('general/error404');
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


module.exports = router;