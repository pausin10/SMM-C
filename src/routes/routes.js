const express = require('express');
const user = require('../models/user');
const router = express.Router();
const User = require('../models/user');

router.get('/home', isAuthenticated, async (req, res) => {
    const myUser = await user.findOne({email: req.user.email}).lean()
    .then (data => {
        return{
            user: data.email
        }
    });
    res.render('general/home', myUser);
});

router.get('/postit', isAuthenticated, (req,res) =>{
    res.send('Hola');
});

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