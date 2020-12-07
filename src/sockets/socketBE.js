const room = require('../models/room');
const postit = require('../models/postit');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Connected', socket.id);
        socket.on('joinRoom:private', async (socketInfo, socketRoom) => {
            if (await checkRoom(socketInfo)) {
                socket.join(socketRoom);
                io.sockets.in(socketRoom).emit('room:message', 'Private Room ' + socketInfo[1]);
                socket.on('postit:message', (data) => {
                    io.sockets.in(socketRoom).emit('postit:message', data);
                    addPostit(data);
                })
            }
        })
        socket.on('joinRoom:public', (socketRoom) => {
            socket.join(socketRoom[1]);
            io.to(socketRoom[1]).emit('room:message', 'Public Room '+ socketRoom[1]);
            socket.on('postit:message', (data) => {
                io.to(socketRoom[1]).emit('postit:message', data);
                addPostit(data);
            });

        })
        socket.on('socketRoom:unsubscribe', (socketRoom) => {
            socket.leave(socketRoom);
            
        })

    });


    async function checkRoom(data) {
        const roomOne = await room.findById({ _id: data[0] });
        return (roomOne.password == data[3]) ? true : false;
    }

    async function addPostit(data) {
        const newPostit = new postit({
            user: data.username,
            description: data.message
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