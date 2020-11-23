const express = require('express');
const router = express.Router();

router.get('/home', isAuthenticated, (req, res) => {
    res.render('partials/home');
});

router.get('/*', (req, res) => {
    res.render('partials/error404');
});

function isAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;