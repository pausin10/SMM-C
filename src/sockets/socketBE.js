const room = require('../models/room');
const postit = require('../models/postit');
const fs = require('fs');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Connected', socket.id);

        socket.on('joinRoom:private', async (socketInfo) => {
            if (await checkRoom(socketInfo)) {
                socket.join(socketInfo[1]);
                io.sockets.in(socketInfo[1]).emit('room:message', 'Private Room ' + socketInfo[1]);
                socket.on('postit:message', (data) => {
                    io.sockets.to(socketInfo[1]).emit('postit:message', data);
                    addPostit(data);
                })
                socket.on('video:play', () => {
                    io.to(socketInfo[1]).emit('video:playAll');
                })
                socket.on('video:pause', () => {
                    io.to(socketInfo[1]).emit('video:pauseAll');
                })
                socket.on('socketRoom:unsubscribe', () => {
                    console.log(socket.adapter.rooms);
                    socket.leave(socketInfo[1]);
                })
            }
        })

        socket.on('joinRoom:public', (socketRoom) => {
            socket.join(socketRoom[1]);
            io.to(socketRoom[1]).emit('room:message', 'Public Room ' + socketRoom[1]);
            socket.on('postit:message', (data) => {
                io.to(socketRoom[1]).emit('postit:message', data);
                addPostit(data);
            });
            socket.on('video:play', () => {
                io.to(socketRoom[1]).emit('video:playAll', socketRoom[1]);
            })
            socket.on('video:pause', () => {
                io.to(socketRoom[1]).emit('video:pauseAll', socketRoom[1]);
            })
            socket.on('socketRoom:unsubscribe', () => {          
                socket.leave(socketRoom[1]);
            })
        });
    });


    async function checkRoom(data) {
        const roomOne = await room.findById({ _id: data[0] });
        return (roomOne.password == data[3]) ? true : false;
    }

    async function addPostit(data) {
        const newPostit = new postit({
            user: data.username,
            text: data.message,
            nameVideo: data.nameVideo,
            currentTime: data.currentTime
        });
        await newPostit.save((err) => {
            if (err) {
                console.log('Error al guardar el postit en la BD. ' + err);
            } else {
                console.log('Exito al guardar el postit en la BD');
            }
        });
    }

}