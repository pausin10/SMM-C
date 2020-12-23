document.getElementById('pwdPrivate').style.display = 'none';
document.getElementById('pwdInput').style.display = 'none';

let addUserMail = '';
let btnUserMail = document.getElementById('btnUserMail').click();

function mostrar(dato) {
    if (dato == 'public') {
        document.getElementById('pwdPrivate').style.display = 'none';
        document.getElementById('pwdInput').style.display = 'none';
    }
    if (dato == 'private') {
        document.getElementById('pwdPrivate').style.display = 'block';
        document.getElementById('pwdInput').style.display = 'block';
    }
}

document.querySelector("body").addEventListener('click', () => {
    if (document.getElementById('userMail').value) {
        const userMail = document.getElementById('userMail').value;
        addUserMail += userMail + ",";
        outputMail.innerHTML += `<Strong>${userMail}</Strong><br>`
        document.getElementById('userMail').value = '';
        document.getElementById('sendMail').value = addUserMail;
    }
})

/*btnUserMail.addEventListener('click', () => {
    const userMail = document.getElementById('userMain');
    addUserMail += userMain+ " ";
    output.innerHTML += `<Strong>${userMail}</Strong><br>`
})*/