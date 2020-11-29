const express = require('express');
const user = require('../models/user');
const router = express.Router();
const User = require('../models/user');
const postit = require('../models/postit');
const room = require('../models/room');

router.get('/home', isAuthenticated, async (req, res) => {
    const myUser = await user.findOne({ email: req.user.email }).lean()
        .then(data => {
            return {
                user: data.email
            }
        });
    const rooms = await room.find().lean();

    res.render('general/home',{
        myUser: myUser, 
        rooms: {...rooms}
    });
});

router.get('/postit', isAuthenticated, async (req, res) => {
    const myUser = await user.findOne({ email: req.user.email }).lean()
        .then(data => {
            return {
                user: data.email
            }
        });
    console.log(myUser.user);
    const myPostits = await postit.find({ user: myUser.user }).lean();
    res.render('general/postits', { myPostits });
});

router.get('/postit/delete/:id', isAuthenticated, async (req, res) => {
    
    await postit.findByIdAndDelete({ _id: req.params.id });
    res.redirect('/postit');
});

router.get('/addRoom', isAuthenticated, async (req, res) => {
    res.render('general/addRoom');
});

router.post('/addRoom', isAuthenticated, async (req,res) =>{
    const newRoom = new room({name: req.body.nombreSala});
    await newRoom.save((err) =>{
        if(err){
            console.log('Error al crear la sala '+ req.body.nombreSala);
            req.flash('error', 'Error al crear una sala');
            res.redirect('/addRoom');
        }else{
            console.log('Sala '+req.body.nombreSala+'creada con exito');
            res.redirect('/home');
        }
    })
    
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