const socket = io();

let btnSend = document.getElementById('sendPostit');
let btnLeave = document.getElementById('leaveRoom');
let btnPlay = document.getElementById('playVideo');
let btnPause = document.getElementById('pauseVideo');
let btnSelect = document.getElementById('selectVideo');
let media = document.querySelector('video');

let message = document.getElementById('message');
let username = document.getElementById('username');
let output = document.getElementById('output');
let idRoom = document.getElementById('idRoom');
let password = document.getElementById('password');
let typeRoom = document.getElementById('typeRoom');


document.querySelector("body").addEventListener('click', (data) => {
    const dataInput = data.target.closest('a');

    if (dataInput !== null) {
        const sendDataInput = { ...dataInput.id.split(',') };
        if (dataInput.id == 'leaveRoom') {
            console.log('Leave Room')
            socket.emit('socketRoom:unsubscribe');
        }
        if (password.value) {
            Object.assign(sendDataInput, { 3: password.value });
            document.getElementById('password').value = '';
            socket.emit('joinRoom:private', sendDataInput);
            return;
        }
        if (Object.keys(sendDataInput).length >= 3) {
            socket.emit('joinRoom:public', sendDataInput);
            document.getElementById('password').value = '';
        }


    }
});

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
btnSelect.addEventListener('click', () => {
    document.getElementById('fileupload').click();
    const fileupload = document.getElementById('fileupload');
    fileupload.addEventListener('change', (event) => {
        const fileList = event.target.files;
        document.getElementById('nombreArchivo').innerHTML=fileList[0].name;
        document.getElementById('videoPlayer').src = 'video/' + fileList[0].name;
    });

});

socket.on('video:playAll', () => {
    media.play();
})
socket.on('video:pauseAll', () => {
    media.pause();
})

socket.on('postit:message', (data) => {
    output.innerHTML += `<p>
        <Strong>Username: ${data.username}</Strong>
        Postit: ${data.message}
    </p>`
});

socket.on('room:message', (data) => {
    console.log(data);
});

