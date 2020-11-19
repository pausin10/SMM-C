const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/users');

router.get('/', (req, res) => {
    res.redirect('/signin');
});

router.post('/signin', passport.authenticate('local-signup', {
    successRedirect: '/home',
    faillureRedirect: '/signup',
    passReqToCallback: true
}));

router.get('/signin', (req, res) => {
    res.render('partials/signin')
});

router.get('/signup', (req,res) =>{
    res.render('partials/signup');
});

router.get('/*', (req,res) => {
    res.render('partials/error404');
})













module.exports = router; 