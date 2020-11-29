const socket = io();

let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let jn = document.getElementById('join');
let idRoom = document.getElementById('idRoom');


document.querySelector("body").addEventListener('click', (data) => {
    const anchor = data.target.closest('a');
    if (anchor !== null) {
        console.log(anchor.id);
        socket.emit('joinRoom', anchor.id);
    }
});



btn.addEventListener('click', () => {
    socket.emit('postit:message', {
        message: message.value,
        username: username.value
    });
});

socket.on('postit:message', (data) => {
    output.innerHTML += `<p>
        Username: <Strong>${data.username}</Strong>
        Postit: ${data.message}
    </p>`
});

socket.on('room:message', (data) => {
    console.log(data);
});




/********* */
var video = document.getElementById('videoPlayer')

socket.on('data', function (data) {
  video.src = 'data:img/jpeg;base64,' + data;
});