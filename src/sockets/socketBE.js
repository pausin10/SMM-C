const room = require('../models/room');
const postit = require('../models/postit');
const video = require('../models/video')
const blockedUser = require('../models/blockedUser');
const fs = require('fs');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Connected', socket.id);

        socket.on('checkPublic:creator', async (check) => {
            if (await checkCreatorInRoom(check)) {
                socket.emit('checkPublic:true',check);
            }
            else {
                socket.emit('creatorFalse:message');
            }
        })

        socket.on('checkPrivate:creator', async (check) => {
            if (await checkCreatorInRoom(check)) {
                socket.emit('checkPrivate:true',check);
            }
            else {
                socket.emit('creatorFalse:message');
            }
        })

        socket.on('joinRoom:private', async (socketInfo) => {
            if (await checkRoom(socketInfo)) {
                if (socketInfo[3] == socketInfo[4]) updateCreatorInRoom(socketInfo, true);
                socket.join(socketInfo[1]);
                io.sockets.in(socketInfo[1]).emit('room:message', socketInfo);

                socket.on('postit:message', async (data) => {
                    if (await checkBlockedUsers(socketInfo)) io.sockets.to(socketInfo[1]).emit('postit:message', data);
                    else socket.emit('blocked:message');
                })
                socket.on('postit:save', async (data) => {
                    if (await checkBlockedUsers(socketInfo)) addPostit(data);
                    else socket.emit('blocked:message');
                });
                socket.on('video:play', async () => {
                    if (await checkBlockedUsers(socketInfo)) io.to(socketInfo[1]).emit('video:playAll');
                    else socket.emit('blocked:message');
                })
                socket.on('video:pause', async () => {
                    if (await checkBlockedUsers(socketInfo)) io.to(socketInfo[1]).emit('video:pauseAll');
                    else socket.emit('blocked:message');
                })

                socket.on('video:source', async (data) => {
                    if (await checkBlockedUsers(socketInfo)) io.to(socketInfo[1]).emit('video:changeSource', data);
                    else socket.emit('blocked:message');
                })

                socket.on('user:block', (data) => {
                    socketInfo[6] = data;
                    addBlockedUser(socketInfo);
                    io.to(socketInfo[1]).emit('user:disabled', socketInfo);
                })

                socket.on('socketRoom:unsubscribe', () => {
                    if (socketInfo[3] == socketInfo[4]) updateCreatorInRoom(socketInfo, false);
                    io.to(socketInfo[1]).emit('user:leave', socketInfo);
                    socket.leave(socketInfo[1]);
                })
            }
        })
        socket.on('joinRoom:public', async (socketRoom) => {
            if (socketRoom[3] == socketRoom[4]) updateCreatorInRoom(socketRoom, true);
            socket.join(socketRoom[1]);
            io.to(socketRoom[1]).emit('room:message', socketRoom);

            socket.on('postit:message', async (data) => {

                if (await checkBlockedUsers(socketRoom)) io.to(socketRoom[1]).emit('postit:message', data);
                else socket.emit('blocked:message');
            });
            socket.on('postit:save', async (data) => {
                if (await checkBlockedUsers(socketRoom)) addPostit(data);
                else socket.emit('blocked:message');
            });
            socket.on('video:play', async () => {
                if (await checkBlockedUsers(socketRoom)) io.to(socketRoom[1]).emit('video:playAll', socketRoom[1]);
                else socket.emit('blocked:message');
            })
            socket.on('video:pause', async () => {
                if (await checkBlockedUsers(socketRoom)) io.to(socketRoom[1]).emit('video:pauseAll', socketRoom[1]);
                else socket.emit('blocked:message');
            })
            socket.on('video:source', async (data) => {
                if (await checkBlockedUsers(socketRoom)) io.to(socketRoom[1]).emit('video:changeSource', data);
                else socket.emit('blocked:message');
            })

            socket.on('user:block', (data) => {
                socketRoom[6] = data;
                addBlockedUser(socketRoom);
                io.to(socketRoom[1]).emit('user:disabled', socketRoom);
            })
            socket.on('socketRoom:unsubscribe', () => {
                if (socketRoom[3] == socketRoom[4]) updateCreatorInRoom(socketRoom, false);
                io.to(socketRoom[1]).emit('user:leave', socketRoom);
                socket.leave(socketRoom[1]);

            })
        });
    });


    async function checkRoom(data) {
        const roomOne = await room.findById({ _id: data[0] });;
        return (roomOne.password == data[5]) ? true : false;
    }

    async function checkBlockedUsers(data) {
        const noBlockedUsers = await blockedUser.countDocuments({ user: data[3], room: data[1] });
        return (noBlockedUsers == 0) ? true : false;
    }

    async function checkCreatorInRoom(data) {
        const creatorInRoom = await room.countDocuments({ name: data[1], createdBy: data[4], stateCreator: true });
        return (creatorInRoom == 1) ? true : false;
    }

    async function addBlockedUser(data) {
        const newBlockedUser = new blockedUser({
            user: data[6],
            room: data[1]
        });
        await newBlockedUser.save((err) => {
            if (err) {
                console.log('Error al guardar el usuario bloqueado en la BD. ' + err);
            } else {
                console.log('Exito al guardar ' + data[6] + ' bloqueado en la BD');
            }
        });
    }

    async function updateCreatorInRoom(data, state) {
        const updateState = await room.updateOne({ createdBy: data[3], name: data[1] }, { stateCreator: state });
        console.log(updateState);
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