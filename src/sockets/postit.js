const socket = io();

let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');

btn.addEventListener('click', () => {
    socket.emit('postit:message', {
        message: message.value, 
        username: username.value
    });
});

socket.on('postit:message', (data) => {
    console.log(data.username + " "+ data.message);
    output.innerHTML += `<p>
        Username: <Strong>${data.username}</Strong>
        Postit: ${data.message}
    </p>`
});