const socket = io();

let btnSend = document.getElementById('sendPostit');
let btnLeave = document.getElementById('leaveRoom');
let btnPlay = document.getElementById('playVideo');
let btnPause = document.getElementById('pauseVideo');
let btnSave = document.getElementById('savePostit');
let btnSelect = document.getElementById('videoname');
let media = document.querySelector('video');

let message = document.getElementById('message');
let username = document.getElementById('username');
let output = document.getElementById('output');
let info = document.getElementById('info');
let idRoom = document.getElementById('idRoom');
let password = document.getElementById('password');
let typeRoom = document.getElementById('typeRoom');

document.querySelector("body").addEventListener('click', (data) => {
    const dataInput = data.target.closest('a');
    const dataVideo = data.target.closest('input');

    if (dataVideo) {
        console.log(dataVideo.value);
    }

    if (dataInput !== null) {
        const sendDataInput = { ...dataInput.id.split(',') };
        if (dataInput.id == 'leaveRoom') {
            console.log('Leave Room')
            socket.emit('socketRoom:unsubscribe', sendDataInput);
        }
        if (sendDataInput[2]=='private'&&password.value) {
            Object.assign(sendDataInput, { 4: password.value });
            document.getElementById('password').value = '';
            socket.emit('joinRoom:private', sendDataInput);
            return;
        }
        if (sendDataInput[2]=='public') {
            socket.emit('joinRoom:public', sendDataInput);
            document.getElementById('password').value = '';
        }


    }
});

btnSelect.addEventListener('click', () => {
    var selectedVideo = document.getElementById("videoname");
    var text = selectedVideo.options[selectedVideo.selectedIndex].text;
    socket.emit('video:source', text);
});

/*btnSave.addEventListener('click', () => {
    socket.emit('postit:save', {
        message: message.value,
        username: username.value,
        nameVideo: media.currentSrc,
        currentTime: media.currentTime
    });
    document.getElementById('message').value = '';
});*/

btnSend.addEventListener('click', () => {
    socket.emit('postit:message', {
        message: message.value,
        username: username.value,
        nameVideo: media.currentSrc,
        currentTime: media.currentTime
    });
    document.getElementById('message').value = '';
});

btnPlay.addEventListener('click', () => {
    socket.emit('video:play');
});
btnPause.addEventListener('click', () => {
    socket.emit('video:pause');
});

socket.on('video:playAll', () => {
    media.play();
})
socket.on('video:pauseAll', () => {
    media.pause();
})

socket.on('video:changeSource', (data) => {
    media.src = 'video/' + data;
    document.getElementById('nombreArchivo').innerHTML = data;
})

socket.on('postit:message', (data) => {
    output.innerHTML += `<Strong>${data.username}</Strong> : ${data.message}<br>`
});

socket.on('room:message', (data) => {
    info.innerHTML += data[3] + ' joined to ' + data[1]+'<br>';
    info.style.color = "grey";
    info.style.fontStyle = "italic";
    document.getElementById('nombreSala').innerHTML = data[1];
});
socket.on('user:leave', (data) => {
    console.log(data[3] + ' left ' + data[1]);
    info.innerHTML += data[3] + ' left ' + data[1]+'<br>';
    info.style.color = "grey";
    info.style.fontStyle = "italic";
    
});