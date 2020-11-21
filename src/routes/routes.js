const express = require('express');
const router = express.Router();

router.get('/home', (req,res) =>{
    res.render('partials/home');
});

router.get('/*', (req,res) => {
    res.render('partials/error404');
});

module.exports = router;