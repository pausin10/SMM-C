const express = require('express');
const router = express.Router();
const user = require('../models/user');
const postit = require('../models/postit');
const room = require('../models/room');
const video = require('../models/video');
const email = require('../email');
const blockedUser = require('../models/blockedUser');

router.get('/home', isAuthenticated, async (req, res) => {
    const rooms = await room.find().lean();
    const myVideos = await video.find().lean();
    res.render('general/home', {
        myUser: req.user.email,
        myVideos,
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

router.get('/postit/deleteAll', isAuthenticated, async (req, res) => {
    await postit.deleteMany();
    res.redirect('/postit');
});

router.get('/addRoom', isAuthenticated, async (req, res) => {
    res.render('general/addRoom', { myUser: req.user.email });
});

router.post('/addRoom', isAuthenticated, async (req, res) => {

    const usersToSendMail = [...new Set(req.body.sendMail.split(","))];
    const usersDB = await user.find().lean();
    if (usersToSendMail) {
        for (let i = 0; i < usersDB.length; i++) {
            for (let j = 0; j < usersToSendMail.length; j++) {
                const mailAddRoom = usersToSendMail[j];
                const mailDB = usersDB[i].email;
                if (mailDB == mailAddRoom) {
                    email.sendMailAddRoom(mailDB, req.body.nombreSala, req.body.typeRoom, req.body.password);
                }
            }

        }
    }

    const newRoom = new room({
        name: req.body.nombreSala,
        type: req.body.typeRoom,
        password: req.body.password,
        createdBy: req.body.createdBy,
        stateCreator : false
    });
    await newRoom.save((err) => {
        if (err) {
            console.log('Error al crear la sala');
            req.flash('error', 'Error al crear una sala');
            res.redirect('/addRoom');
        } else {
            console.log('Sala ' + req.body.nombreSala + ' creada por ' + req.body.createdBy + ' guardada con exito ');
            res.redirect('/home');
        }
    })

    const newCreatorInRoom = new creatorInRoom({
        user: req.body.createdBy,
        room: req.body.nombreSala,
        state: false
    });
    await newCreatorInRoom.save((err) => {
        if (err) {
            console.log('Error al guardar el usuario creador en la BD. ' + err);
        } else {
            console.log('Exito al guardar usuario creador en la BD');
        }
    });
})

router.get('/addRoom/delete/:id', isAuthenticated, async (req, res) => {

    await room.countDocuments({ _id: req.params.id,createdBy:req.user.email},async (err,count)=>{
        if(count==1) {
           const deleteRoom = await room.find({ _id: req.params.id });
           await room.findByIdAndDelete({ _id: req.params.id });
           await blockedUser.deleteMany({room:deleteRoom[0].name});
           
        }
        else console('Imposible eliminar, no eres el creador de la sala');
    });
    
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