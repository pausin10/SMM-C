const socket = io();

let message = document.getElementById('message');
let username = document.getElementById('username');
let btnSend = document.getElementById('sendPostit');
let btnLeave = document.getElementById('leaveRoom');
let output = document.getElementById('output');
let idRoom = document.getElementById('idRoom');
let password = document.getElementById('password');
let typeRoom = document.getElementById('typeRoom');


document.querySelector("body").addEventListener('click', (data) => {
    const dataInput = data.target.closest('a');
    if (dataInput !== null) {
        const sendDataInput = { ...dataInput.id.split(',') };
        if (dataInput.id == 'leaveRoom') {
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
        username: username.value
    });
});

socket.on('postit:message', (data) => {
    output.innerHTML += `<p>
        <Strong>Username: ${data.username}</Strong>
        Postit: ${data.message}
    </p>`
});

socket.on('room:message', (data) => {
    console.log(data);
});

