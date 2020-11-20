const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/signin');
});

router.get('/*', (req,res) => {
    res.render('partials/error404');
});

module.exports = router;